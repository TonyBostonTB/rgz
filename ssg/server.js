const http = require("http");
const path = require("path");
const { readFile } = require("fs/promises");
const os = require("os");
const ws = require("ws");
const watchDirectories = require("./watchDirectories");
const marked = require("marked");

const ROOT = path.resolve(process.argv[2] || "./");
const PORT = parseInt(process.argv[3] || "8888", 10);
const WS_PORT = PORT - 1;
const DIV_ID = "_liveReload";

const relativeFilePath = (filePath, root = ROOT) =>
  path.relative(ROOT, filePath);
const getExt = (filePath) => path.extname(filePath);

const injectIntoMd = (body, filePath) =>
  injectIntoHtml(marked.parse(body.toString(), { gfm: true }), filePath);

const injectIntoHtml = async (body, filePath) => {
  const liveReloadCode = `
<style>
#${DIV_ID} {padding:10px;margin-bottom:10px;position:absolute;right:0;top:0px;display:none;}
.${DIV_ID}-warn {background-color:#fc8;color:#440;}
.${DIV_ID}-error {background-color:#fba;color:#400;}
</style><div id="${DIV_ID}"></div>
<script>
// <![CDATA[
(({ url, retries, divId }) => {
  const cssReload = () => {
    const sheets = [].slice.call(document.getElementsByTagName("link"));
    const head = document.getElementsByTagName("head")[0];
    for (var i = 0; i < sheets.length; ++i) {
      const elem = sheets[i];
      head.removeChild(elem);
      const { rel } = elem;
      if (
        (elem.href && typeof rel !== "string") ||
        rel.length == 0 ||
        rel.toLowerCase() == "stylesheet"
      ) {
        const url = elem.href.replace(/(&|\\?)_liveReload=\\d+/, "");
        elem.href =
          url +
          (url.indexOf("?") >= 0 ? "&" : "?") +
          "_liveReload=" +
          new Date().getTime();
      }
      head.appendChild(elem);
    }
  };
  const showMessage = (div, kind, text) => {
    div.className = divId + "-" + kind;
    div.textContent = text;
    div.style.display = "block";
  };
  const div = document.getElementById(divId);
  const handleMessageEvent = ({ data }) => {
    const message = JSON.parse(data);
    if (message.documentReload && message.href) {
      console.log("document reload and redirect: " + message.filePath);
      return (location.href = message.href);
    }
    if (message.documentReload) {
      console.log("document reload: " + message.filePath);
      return location.reload();
    }
    if (message.cssReload) {
      console.log("css reload: " + message.filePath);
      return cssReload();
    }
  };
  const liveReload = (t) => () => {
    if (t > retries) {
      const message = "disconnected";
      console.error(message);
      showMessage(div, "error", message);
      return;
    }
    const socket = new WebSocket(url);
    socket.addEventListener("error", () => {
      const message = "reconnecting... " + t + "/" + retries;
      console.log(message);
      showMessage(div, "warn", message);
      setTimeout(liveReload(t + 1), 1000);
    });
    socket.addEventListener("open", () => location.reload());
    socket.addEventListener("message", handleMessageEvent);
  };
  const socketInit = new WebSocket(url);
  socketInit.addEventListener("close", liveReload(1));
  socketInit.addEventListener("message", handleMessageEvent);
})({ retries: 60, divId: "${DIV_ID}", url: "ws://" + location.hostname + ":" + ${WS_PORT}  });
// ]]>
</script>`;
  try {
    const header = (
      await readFile(path.join(ROOT, ".ssgheader.html"))
    ).toString();
    const footer = (
      await readFile(path.join(ROOT, ".ssgfooter.html"))
    ).toString();
    return Buffer.from(`${header}${body}${footer}${liveReloadCode}`);
  } catch (err) {
    console.log(".ssgheader.html or .ssgfooter.html not found");
    return Buffer.from(`${body}${liveReloadCode}`);
  }
};

const injectIntoSvg = (body) =>
  Buffer.from(
    body.toString().replace(
      `</svg>`,
      `<script>
// <![CDATA[
(({ retries, url }) => {
  const handleMessageEvent = ({ data }) => {
    const message = JSON.parse(data);
    if (message && message.documentReload) {
      console.log("document reload: " + message.filePath);
      return location.reload();
    }
  };
  const liveReload = (t) => () => {
    if (t > retries) {
      console.error("disconnected");
      return;
    }
    const socket = new WebSocket(url);
    socket.addEventListener("error", () => {
      console.log("reconnecting... " + t + "/" + retries);
      setTimeout(liveReload(t + 1), 1000);
    });
    socket.addEventListener("open", () => location.reload());
    socket.addEventListener("message", handleMessageEvent);
  };
  const socketInit = new WebSocket(url);
  socketInit.addEventListener("close", liveReload(1));
  socketInit.addEventListener("message", handleMessageEvent);
})({ retries: 60, url: "ws://" + location.hostname + ":" + ${WS_PORT}});
// ]]>
</script>
</svg>`
    )
  );

const handleRequest = async (request, response) => {
  try {
    const passwd = JSON.parse(
      (await readFile(path.join(ROOT, ".ssgpasswd.json"))).toString()
    );

    const authorization = request.headers.authorization;
    if (!authorization) {
      const err = new Error("not authenticated");
      response.message = "not authenticated";
      const body = await injectIntoHtml(`<p>not authenticated</p>`);
      response.writeHead(401, {
        "www-authenticate": "basic",
        "content-type": "text/html",
        "content-length": Buffer.byteLength(body),
      });
      return response.end(body);
    }

    const [username, password] = new Buffer.from(
      authorization.split(" ")[1],
      "base64"
    )
      .toString()
      .split(":");

    if (
      passwd &&
      passwd.filter((x) => x.username === username && x.password === password)
        .length === 0
    ) {
      const err = new Error("not authenticated");
      response.message = "not authenticated";
      const body = await injectIntoHtml(`<p>not authenticated</p>`);
      response.writeHead(401, {
        "www-authenticate": "basic",
        "content-type": "text/html",
        "content-length": Buffer.byteLength(body),
      });
      return response.end(body);
    }
  } catch (err) {
    console.log(".ssgpasswd.json not found");
  }

  const logRequest = (
    { socket: { remoteAddress }, method, url },
    { statusCode, message = "" }
  ) =>
    console.log(
      remoteAddress,
      new Date().toJSON(),
      method,
      url,
      statusCode,
      message
    );

  response.on("finish", () => logRequest(request, response));
  if (request.method !== "GET") return;
  const pathname = decodeURI(
    new URL(request.url, `http://${request.headers.host}`).pathname
  );

  const filePath = path.join(
    ROOT,
    pathname.endsWith("/") ? path.join(pathname, "index.html") : pathname
  );

  if (getExt(filePath) === "") {
    console.log("no ext");
  }

  const getWrapper = (ext) => {
    switch (ext) {
      case "":
        return injectIntoHtml;
      case ".md":
        return injectIntoMd;
      case ".html":
        return injectIntoHtml;
      case ".svg":
        return injectIntoSvg;
      default:
        return (x) => x;
    }
  };

  const getMime = (filePath) => {
    const ext = path.extname(filePath).replace(".", "");
    const mimeTypes = {
      css: "text/css",
      html: "text/html",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      js: "application/javascript",
      md: "text/markdown",
      png: "image/png",
      svg: "image/svg+xml",
      txt: "text/plain",
    };
    if (!mimeTypes[ext]) return "text/html";
    return mimeTypes[ext];
  };

  if (
    [".ssgpasswd.json", ".ssgheader.html", ".ssgfooter.html"].includes(
      relativeFilePath(filePath)
    )
  ) {
    response.message = "no access";
    const body = await injectIntoHtml(`<p>no access</p>`);
    response.writeHead(403, {
      "content-type": "text/html",
      "content-length": Buffer.byteLength(body),
    });
    return response.end(body);
  }

  try {
    const file = await readFile(filePath);
    const body = await getWrapper(getExt(filePath))(
      file,
      relativeFilePath(filePath)
    );
    response.writeHead(200, {
      "content-type": getMime(filePath),
      "content-length": Buffer.byteLength(body),
    });
    return response.end(body);
  } catch (err) {
    try {
      const filePathMd =
        getExt(filePath) === ""
          ? `${filePath}.md`
          : filePath.replace(".html", ".md");
      const file = await readFile(filePathMd);
      const body = await getWrapper(getExt(filePathMd))(
        file,
        relativeFilePath(filePathMd)
      );
      response.message = `generated from ${relativeFilePath(filePathMd)}`;
      response.writeHead(200, {
        "content-type": getMime(filePath),
        "content-length": Buffer.byteLength(body),
      });
      return response.end(body);
    } catch (err) {
      response.message = "not found";
      const body = await injectIntoHtml(`<p>${pathname} not found</p>`);
      response.writeHead(404, {
        "content-type": "text/html",
        "content-length": Buffer.byteLength(body),
      });
      return response.end(body);
    }
  }
};

const httpServer = http.createServer(handleRequest);
httpServer.listen(PORT, () =>
  console.log(`listening http://localhost:${PORT}`)
);

const wss = new ws.WebSocketServer({ port: WS_PORT });
wss.on("listening", () => console.log(`websocket ws://localhost:${PORT}`));

const handleEvent =
  ({ documentReload, cssReload }) =>
  ({ type, filePath }) =>
    wss.clients.forEach((client) =>
      client.send(
        JSON.stringify({
          cssReload,
          documentReload,
          type,
          filePath: relativeFilePath(filePath),
          ...(type === "change" &&
            [".md", ".html"].includes(getExt(filePath)) &&
            ![".ssgheader.html", ".ssgfooter.html"].includes(
              relativeFilePath(filePath)
            ) && {
              href: "/" + relativeFilePath(filePath).replace(".md", ".html"),
            }),
        })
      )
    );
wss.on("documentReload", handleEvent({ documentReload: true }));
wss.on("cssReload", handleEvent({ cssReload: true }));

const handleFileChange = (type, filePath) =>
  console.log(type, filePath) || getExt(filePath) === ".css"
    ? wss.emit("cssReload", { filePath, type })
    : wss.emit("documentReload", { filePath, type });

watchDirectories({
  directories: [ROOT],
  onChange: handleFileChange,
  onListening: () => console.log(`watching ${ROOT}`),
});
