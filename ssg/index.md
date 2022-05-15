<p class="small">this is a draft</p>

# static site generator with live reload

_ssg_ converts markdown files to html with [marked.js](https://marked.js.org),
copies `*.html` files with `<html>` tag as they are. for the rest of `*.html`
files _ssg_ extracts their titles from `<h1>` tag, prepends `./.header.html`,
appends `./.footer.html`, copies everything to `<dst>` directory, and generates
`<dst>/sitemap.xml`. _ssg_ ignores `.*` files and file paths listed in
`./.ignore`.

## usage

watch `./src` directory and listen on port `1111`/`1112` (http/ws)

<pre>
$ <b>npx @rgzee/ssg watch <em>src</em> -p <em>1111</em> -w <em>1112</em></b>
listening http://192.168.1.1:1111
websocket ws://192.168.1.1:1112
watching /home/rgzee/src
</pre>

build from `./src` into `./dst` directory
<pre>
$ <b>npx @rgzee/ssg build <em>src</em> <em>dst</em></b>
$
</pre>
