_tested on [macos](/macos/) 10.13 with homebrew 1.7_

# manage packages with brew(1)

[homebrew](https://brew.sh/) is a package manager for macos.

## install

<pre>
$ <b>cd /tmp</b>
$ <b>curl -so install \
  https://raw.githubusercontent.com/Homebrew/install/master/install</b>
$ <b>less install</b>
...
$ <b>/usr/bin/ruby install</b>
...
$
</pre>

## install a package

install a program with `brew install`, for example, [entr(1)](http://entrproject.org):
<pre>
$ <b>brew install entr</b>
==> Downloading https://.../entr-4.1.high_sierra.bottle
################################################ 100.0%
==> Pouring entr-4.1.high_sierra.bottle.tar.gz
&#x1F37A;  /usr/local/Cellar/entr/4.1: 7 files, 40.7KB
$
</pre>

## uninstall a package

<pre>
$ <b>brew uninstall entr</b>
Uninstalling /usr/local/Cellar/entr/4.1... (7 files, 40.7KB)
$
</pre>

## clean up

<pre>
$ <b>brew cleanup</b>
...
==> This operation has freed approximatelly 130.2MB of disk space.
==> Removing cached downloads
...
==> This operation has freed approximatelly 91.2MB of disk space.
$
</pre>

## uninstall

<pre>
$ <b>cd /tmp</b>
$ <b>curl -so uninstall \
  https://raw.githubusercontent.com/Homebrew/install/master/uninstall</b>
$ <b>vis uninstall</b>
...
$ <b>/usr/bin/ruby uninstall --help</b>
...
$
</pre>
