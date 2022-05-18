const { parse, resolve } = require("path");
const { spawn } = require("child_process");
const watchDirectories = require("./watchDirectories.js");

(async () => {
  const [_node, _respawn, program, ...directories] = process.argv;

  let nodeServer = null;
  let counter = 0;

  const reload = () => {
    console.log("spawn", counter++, new Date());
    if (nodeServer) nodeServer.kill("SIGTERM");
    const ext = parse(program).ext;
    const tsm = ext === ".ts" ? ["-r", "tsm", program] : [];
    nodeServer = spawn("node", [...tsm, program], {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  };

  reload();
  await watchDirectories({
    directories,
    onChange: reload,
    onListening: () =>
      console.log(
        `watching ${directories.map((x) =>
          resolve(x)
        )} and respawning ${program}`
      ),
  });
})();
