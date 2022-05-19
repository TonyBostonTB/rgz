# Foreign disk partitions on OpenBSD

<p class="f4 f3-m f3-l lh-title ni">&#8220;The <code>i</code>
partition is part of the pseudo disklabel that OpenBSD generates
for disks, so that there's always a disklabel even if it is in
memory (or "in-core", as the manual states).</p>

Other systems don't care about our disklabel as it's simply an
additional layer of partitioning/naming the disk. Instead, they see
MBR or GPT partition.

For example, when you go to install OpenBSD on a disk, it will add
any foreign partitions it finds to the disklabel starting at `i`,
but that's simply so OpenBSD itself can see and operate on those
areas of the disk outside of the bounds of GPT/MBR OpenBSD partition.

If you had two foreign partitions, they appear as `i` and `j`. But
note, if you create those partitions after OpenBSD, you have to add
them _manually_ to the disklabel, which can be very difficult as
there's no mechanism so sync this information.

So yeah, generally want to avoid that.

There's nothing inherently special about the letter `i` (or any
subsequent letter through), i.e. they're not reserved exclusively
for foreign partitions, if none are found you can use them however
you want.

The _fstype_ is perhaps a better indicator here, but, also just a
hint as to the purpose.&#8221;

---

<img src="/ref/brynet.jpeg" class="avatar">

**Bryan Steele**<br>
_OpenBSD Developer_<br>
[@canadianbryan](https://twitter.com/canadianbryan)<br>
[@brynet@bsd.network](https://bsd.network/@brynet)<br>
[brynet.biz.tm](http://brynet.biz.tm)

---

See also [disklabel(8)](https://man.openbsd.org/disklabel.8),
[OpenBSD FAQ - Disk Setup](https://www.openbsd.org/faq/faq14.html)
