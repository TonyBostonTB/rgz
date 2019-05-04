**DISCLAIMER**<br>
I'm just a happy customer of _OpenBSD Amsterdam_.
[Mischa Peters](https://twitter.com/mischapeters) runs the place.
He donates &euro;10 for every VM per year to
[OpenBSD Foundation](https://www.openbsdfoundation.org).

_Tested on [OpenBSD](/openbsd/) 6.3 and 6.4_

# Deploy VM on OpenBSD Amsterdam

[OpenBSD in Amsterdam](https://openbsd.amsterdam?rz) is running dedicated
[vmd(8)](https://man.openbsd.org/vmd.8) servers to host opinionated
VMs.

Send your name, email address, hostname, username, and [public SSH
key](/ssh.html) to OpenBSDAms via [contact
form](https://openbsd.amsterdam/contact.html?rz),
[Twitter](https://twitter.com/OpenBSDAms), or
[Mastodon](https://bsd.network/@OpenBSDAms), before you pay.

For example:

```
Roman Zolotarev
hi@romanzolotarev.com
www.romanzolotarev.com
romanzolotarev
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIqh7BmO...
```

Please allow few hours for your VM to be started. You'll get a IPv4
and IPv6 address as soon as your VM is deployed. Login to the
VM (assuming your private SSH key is in its default location):

<pre>
$ <b>ssh <em>username@XXX.XXX.XXX.XXX</em></b>
OpenBSD 6.4-current (GENERIC) #358: Sat Oct 20 01:44:18 MDT 2018

Welcome to OpenBSD: The proactively secure Unix-like operating system.

Please use the sendbug(1) utility to report bugs in the system.
Before reporting a bug, please try to reproduce it with the latest
version of the code.  With bug reports, please try to ensure that
enough information to reproduce the problem is enclosed, and if a
known fix for it exists, include that as well.

$
</pre>

Get the password from `~/.ssh/authorized_keys` and switch to `root`.

<pre>
$ <b>awk '{print$NF}' .ssh/authorized_keys</b>
<em>XXXXXXXXXXXXXXXXXXXXXXXXXX</em>
$ <b>su -</b>
password:
#
</pre>

Add your _username_ to `/etc/doas.conf`:

<pre>
# <b>echo 'permit <em>username</em>' > /etc/doas.conf</b>
#
</pre>

Edit `/etc/ssh/sshd_config`:

<pre>
PermitRootLogin no
PasswordAuthentication no
</pre>

Verify the new config and restart `sshd`:

<pre>
# <b>sshd -t</b>
# <b>rcctl restart sshd</b>
sshd(ok)
sshd(ok)
#
</pre>

It has been reported by some users that IPv6 needs `-soii` in order
to work properly.  In that case you can edit `/etc/hostname.vio0`:

	dhcp
	inet6 2a03:6000:9xxx::xxx 64 -soii

When you don't want the IPv4 address to be provided by dhcpd you
can change `/etc/hostname.vio0` to:

	inet 46.23.xx.xx 255.255.255.0
	inet6 2a03:6000:9xxx::xxx 64 -soii

When you do, make sure to edit `/etc/mygate`:

	46.23.xx.1
	2a03:6000:9xxx::1

Reinitialize the network:

<pre>
# <b>sh /etc/netstart vio0</b>
#
</pre>

Add to your crontab:

<pre>
# <b>crontab -e</b>
</pre>

These are workarounds for <a
href="https://openbsd.amsterdam/known.html">known issues</a>.
Replace `46.23.88.1` with your default gateway from `/etc/mygate`.

<pre>
*/15 * * * * /usr/sbin/rdate pool.ntp.org > /dev/null
*/5 * * * * /sbin/ping -c3 <em>46.23.88.1</em> > /dev/null
</pre>

Update `/etc/pf.conf`, test, and load it:

<pre>
# <b>echo 'pass in quick proto { icmp, icmp6 } all' >> /etc/pf.conf</b>
# <b>pfctl -nf /etc/pf.conf</b>
# <b>pfctl -f /etc/pf.conf</b>
# <b>pfctl -sr</b>
block return all
pass all flags S/SA
block return in on ! lo0 proto tcp from any to any port 6000:6010
block return out log proto tcp all user = 55
block return out log proto udp all user = 55
pass in quick proto icmp all
pass in quick proto ipv6-icmp all
#
</pre>

Check [6.4 errata](https://www.openbsd.org/errata64.html) and apply
available patches.

<pre>
# <b>syspatch</b>
...
Relinking to create unique kernel... done.
# <b>reboot</b>
Connection to XXX.XXX.XXX.XXX closed.
</pre>

Now you may want [to setup a web server](/openbsd/httpd.html).

---

**Thanks** to
[Mischa Peters](https://twitter.com/mischapeters) for reading drafts of this,
to [Mike Larkin](https://twitter.com/mlarkin2012),
[Bryan Steele](https://twitter.com/canadianbryan),
[h3artbl33d](https://twitter.com/h3artbl33d), and
[Jeff Neitzel](https://twitter.com/v6shell) for tips and hints.
