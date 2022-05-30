If your computer **works with OpenBSD out-of-the-box**,<br>
submit your dmesg to
[_NYC_*BUG](http://dmesgd.nycbug.org/index.cgi?do=submit) and
[send me the link](/feedback.html).<br>
Don't forget to send dmesg to
[developers](https://www.openbsd.org/faq/faq4.html#SendDmesg).<br>

_Tested on various [OpenBSD](/openbsd/) releases. Check [my current setup](/setup.html)_

# OpenBSD compatible hardware

## [Lenovo ThinkPad X1 Carbon (5th Gen)](https://www.lenovo.com/us/en/laptops/thinkpad/thinkpad-x/ThinkPad-X1-Carbon-5th-Gen/p/22TP2TXX15G)

<img src="/hardware/lenovo-thinkpad-x1c5.png" class="w4">

<pre>
14" FHD/WQHD, 7th Gen Intel i5/i7, 1.13 kg

tested by  <a href="https://twitter.com/romanzolotarev/status/1019920973653569536">romanzolotarev</a> on 6.3 and 6.4
           <a href="https://jcs.org/2017/09/01/thinkpad_x1c">jcs</a> on 6.2-current (2017-12-14)

<b><s>fpr</s></b>        <a href="https://bsd.network/@kristapsdz/100391368292782019">patch for libfprint required</a>
<b>cam</b>        not tested
<b>wifi</b>       iwm(4) required
<b>lcd</b>        xbacklight(1)

<b>&#x2744;</b>          fan is off most of a time
           turns on, when CPU > 60&deg;C

ethernet (em), video, HDMI, headphones, mic, speakers,
keyboard backlight, mute, vol up/down,
touchpad, trackpoint, usb, usb-c, sd,
battery (9 hours), ZZZ, zzz
</pre>

## [ZOTAC CI527 Nano](https://www.zotac.com/us/product/mini_pcs/ci527-nano)

<pre>
<img src="/hardware/zotac-ci527nano.jpg" class="w4">

7th Gen Intel i3, passive cooling

tested by  <a href="https://twitter.com/romanzolotarev/status/909807608252551169">romanzolotarev</a> on 6.3 and 6.4

<b><s>zzz</s></b>        doesn't resume from suspend
<b>video</b>      S3 resume doesn't work, the rest is ok
<b>dp</b>         DisplayPort not tested
<b>usb-c</b>      not tested

<b>wifi</b>       iwm(4) required
<b>&#x2744;</b>          43&deg;C, fanless

ethernet (re/em), HDMI, headphones, mic,
usb, sd, ZZZ
</pre>

---

## FAQ

**What hardware is supported?**

OpenBSD runs on [a dozen of
platforms](https://www.openbsd.org/faq/faq1.html#Platforms), but
binary packages of popular programs are availble only for
[amd64](https://fastly.cdn.openbsd.org/pub/OpenBSD/snapshots/packages/amd64/)
and
[i386](https://fastly.cdn.openbsd.org/pub/OpenBSD/snapshots/packages/i386/).

**What platform to choose for Intel&reg; 64-bit processors?**

[OpenBSD amd64](https://www.openbsd.org/amd64.html). For example, it runs
on Core&trade; i3, i5, i7.

**What about 8th Generation Intel&reg; Core&trade; processors?**

[OpenBSD amd64](https://www.openbsd.org/amd64.html) works well, but
these computers are not well supported yet. For example, they have
an issue with suspend/resume.

**Can I run OpenBSD on MacBook?**

Probably. I heard some models are compatible.

I've tried few times to install OpenBSD on my [MacBooks](/macbook/),
but it was a bit of a fiasco (thanks to Nvidia and Broadcom). That's
why I bought new computers, just to run this wonderful operating
system.

**Any known issues?**

For Intel network devices (LAN and WiFi) OpenBSD downloads and
install firmware on its first boot.

[Only few wireless
chipsets](https://man.openbsd.org/?query=wireless&apropos=1) are
supported.<br> NVIDIA&reg; video chipsets, and USB3 audio are not
supported.

Bluetooth doesn't work because, well, [it has been
removed](https://marc.info/?l=openbsd-cvs&m=140511572108715&w=2).

"I'm not very familiar, but the implementation had too many issues
for it to be salvageable, it was treated like a network protocol
which turned out to be the wrong design. Commit message suggests
it also simply didn't work: <a
href="https://marc.info/?l=openbsd-cvs&m=140511572108715&w=2">marc.info?l=openbsd-cvs...</a>"<br>&mdash;
[Bryan Steele](https://twitter.com/canadianbryan/status/984782198887911425 "13 Apr 2018")
(@canadianbryan)
