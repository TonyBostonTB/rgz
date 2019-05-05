**WARNING**<br>
This shell script uses parts of OpenSSL/LibreSSL, which are intended for
testing purposes only. **You may loose your passwords.** Use it at your
own risk.

_Tested on [OpenBSD](/openbsd/) 6.3, 6.4, and 6.5_

# Manage passwords with openssl(1) and oathtool(1)

[pass](/bin/pass) is a password manager written in shell and powered
by [openssl(1)](https://man.openbsd.org/openssl.1) and
[oathtool(1)](http://www.nongnu.org/oath-toolkit/oathtool.1.html).

## Install

<pre>
# <b>pkg_add oath-toolkit</b>
...
oath-toolkit-2.6.2p0: ok
#
</pre>

Download and run `pass`. Assuming `./bin` is in `PATH`.

<pre>
$ <b>cd bin</b>
$ <b>ftp https://www.romanzolotarev.com/bin/pass</b>
$ <b>chmod +x pass</b>
$ <b>pass</b>
usage: export BASE_DIR=~/.pass
       export PRIVATE_KEY=~/.pass/.key
       export PUBLIC_KEY=~/.pass/.key.pub

       pass init
          | passphrase
          | add        id
          | import     id &lt;pass&gt;
          | show       id
          | export     id &lt;pass&gt;
          | ls        &lt;id&gt;
</pre>

## Initialization

Create a directory for your passwords and generate your key pair.
Generate a strong pass phrase. For example, with [diceware](/diceware.html).

<pre>
$ <b>pass init</b>
Generating public/private key pair.
New pass phrase:
Confirm:
Generating RSA private key, 2048 bit long modulus
..........................+++
..................+++
e is 65537 (0x10001)
writing RSA key
$ <b>ls -1 ~/.pass</b>
.key
.key.pub
$
</pre>

As result you get two files in `~/.pass` directory. These files are
your keys and they are protected with your master pass phrase.

**Important!** Backup those files, you won't be able to recover any
of your passwords without the private key. Also make sure you
remember your pass phrase, there is no way to recover it either.

## Change pass phrase

Change the master pass phrase for your private key.

<pre>
$ <b>pass passphrase</b>
Changing /home/username/.pass/.key pass phrase.
Current pass phrase:
New pass phrase:
Confirm:
Pass phrase changed.
$
</pre>

## Add a password

Add the first password.

Run the following command and enter your master pass phrase, then
type-in the password and hit Enter. In the second line type username
and in the third line type url. Press Enter and **CTRL-D** to save
the password.

<pre>
$ <b>pass add github</b>
Pass phrase
Press Enter and CTRL-D to complete.
<b>always mule boots jaguar agnostic singles dalmatian vixen
username: username
url: https://github.com</b>
$
</pre>

## Import a password

Instead of typing your passwords manually you can pipe [your favorite password
generator](/diceware.html) right into `pass`.

<pre>
$ <b>diceware | pass import twitter</b>
Enter pass phrase for /home/username/.pass/.key:
$
</pre>

## Edit the password

If you want to update your password run:

<pre>
$ <b>pass edit github</b>
Enter pass phrase for /home/username/.pass/.key:
</pre>

As soon as you enter the pass phrase `pass` opens `vi` with the
content of your password file. Let's enable [2FA at
GitHub](https://help.github.com/articles/providing-your-2fa-authentication-code/)
paste the TOTP seed from GitHub into the password file. For example:

```
totp: fx33dwhsbw7esrda
```

When you're done press `ZZ` to save and exit `vi`.

## Show the password

To show a password you can run:

<pre>
$ <b>pass show twitter</b>
pelican mule satchel headband yo-yo lemon luscious older
$
</pre>

But if a password file has a line staring with `totp:`, then `pass` shows
one time password in the second line.

<pre>
$ <b>pass show github</b>
Enter pass phrase for /home/username/.pass/.key:
always mule boots jaguar agnostic singles dalmatian vixen
122635
$
</pre>

## Export the password

If you want to see all lines of your password file, you can use `export`

<pre>
$ <b>pass export github</b>
Enter pass phrase for /home/username/.pass/.key:
always mule boots jaguar agnostic singles dalmatian vixen
username: username
url: https://github.com
$
</pre>

## List all passwords

To list all your passwords run:

<pre>
$ <b>pass ls</b>
github
twitter
$
</pre>

## Files

```
.pass
|-- .key           - RSA private key protected by pass phrase
|-- .key.pub       - RSA public key
|-- github         - tar archive of two files:
|   |-- github.key - AES key encrypted with RSA public key
|   `-- github.enc - text file encrypted with AES key
|-- github.sig     - signature of tar archive created with
|                    RSA private key
...
```

Every time you change your password file `pass` generates tar archive with
a new AES key and a new signature. `pass` verifies the signature every
time you show or export the password.

## Environment variables

To change path to the working directory or your keys, define
environment variables `BASE_DIR`, `PRIVATE_KEY`, `PUBLIC_KEY`. For example:

<pre>
$ <b>BASE_DIR=~/.pass \
PRIVATE_KEY=~/.pass/.key \
PUBLIC_KEY=~/.pass/.key.pub pass init</b>
...
</pre>

## Completions in Korn shell

If you run `pass` on OpenBSD you may want to add completions in
[ksh(1)](https://man.openbsd.org/ksh.1)&mdash;its default shell.
Add these functions to your `~/.profile`:

	update_complete_pass() {
	  pass_list=$(pass ls)
	  set -A complete_pass_edit -- $pass_list
	  set -A complete_pass_export -- $pass_list
	  set -A complete_pass_show -- $pass_list
	}
	update_complete_pass
	pass_edit() { pass edit "$1"; }
	pass_export() { pass export "$1" && update_complete_pass; }
	pass_show() { pass show "$1" && update_complete_pass; }

Now open a terminal or source `~/.profile` and try `pass`:

<pre>
$ <b>pass&lt;Tab&gt;</b>
init  passphrase  add  import  show  export  ls
$ <b>pass</b>
</pre>

Or most importantly try `pass_show`:

<pre>
$ <b>pass_show twit&lt;Tab&gt;</b>
twitch  twitter
$ <b>pass_show twit</b>
</pre>

## See also

[diceware](diceware.html), [random](random.html)
