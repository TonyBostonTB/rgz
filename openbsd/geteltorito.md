_Tested on [OpenBSD](/openbsd/) 6.3_

# Make bootable image with geteltorito(1) and dd(1)


For example, make a bootable USB disk to update BIOS on ThinkPad X1
Carbon 6th gen with [ISO provided by
Lenovo](https://support.lenovo.com/us/en/).

Download _BIOS Update 1.30 06 Sep 2018_ and verify the checksum:

<pre>
$ <b>ftp -V https://download.lenovo.com/pccbbs/mobiles/n23ur11w.iso</b>
n23ur11w.iso 100% |**************************| 21868 KB    00:16
$ <b>sha256 n23ur11w.iso</b>
SHA256 (n23ur11w.iso) = e308a5...
</pre>

Install
[geteltorito(1)](http://freshmeat.sourceforge.net/projects/geteltorito)
and convert the ISO to El Torito boot image.

<pre>
$ <b>doas pkg_add geteltorito</b>
$ <b>geteltorito -o bios.img n23ur11w.iso</b>
Booting catalog starts at sector: 20
Manufacturer of CD: NERO BURNING ROM VER 12
Image architecture: x86
Boot media type is: harddisk
El Torito image starts at sector 27 and has 43008 sector(s) of 512 Bytes
$ <b>sha256 bios.img</b>
SHA256 (bios.img) = c6a11b...
$
</pre>

Plug in a USB drive:

<pre>
$ <b>dmesg | grep removable | tail -n1</b>
sd3 at scsibus5 targ 1 lun 0: &lt;Vendor, Model, 1.11&gt;
SCSI3 0/direct removable serial.12345678901234567890987654
</pre>

In this case it appears as _sd3_.

Copy the image (replace `/dev/rsdXc` with your drive).  For example,
for `sd3` that would be <code>/dev/r<b>sd3</b>c</code>, where `r`
means _raw_ and `c` is a whole device.  **All data on `sdX` will
be erased!**

<pre>
# <b>dd if=bios.img of=/dev/rsdXc bs=1m</b>
21+0 records in
21+0 records out
22020096 bytes transferred in 2.201 secs (10002851 bytes/sec)
#
</pre>

Check the content of the drive:

<pre>
# <b>disklabel sdX</b>
# /dev/rsd3c:
type: SCSI
disk: SCSI disk
label: XXXXXXXXXXXXXXX
duid: 0000000000000000
flags:
bytes/sector: 512
sectors/track: 63
tracks/cylinder: 255
sectors/cylinder: 16065
cylinders: 1945
total sectors: 31260672
boundstart: 0
boundend: 31260672
drivedata: 0

16 partitions:
#                size           offset  fstype [fsize bsize   cpg]
  c:         31260672                0  unused
  i:            42976               32   MSDOS
# <b>mkdir ./sdXi</b>
# <b>mount /dev/sdXi ./sdXi</b>
# <b>cd /mnt/sdXi</b>
# <b>find .</b>
.
./System Volume Information
./System Volume Information/WPSettings.dat
./System Volume Information/IndexerVolumeGuid
./EFI
./EFI/Boot
./EFI/Boot/BootX64.efi
./FLASH
./FLASH/406E8.PAT
./FLASH/806E9.PAT
./FLASH/806EA.PAT
./FLASH/BCP.EVS
./FLASH/NoDCCheck_BootX64.efi
./FLASH/README.TXT
./FLASH/SHELLFLASH.EFI
./FLASH/N23ET55W
./FLASH/N23ET55W/$0AN2300.FL1
./FLASH/N23ET55W/$0AN2300.FL2
#
</pre>

Reboot and flash the BIOS.

---

**Thanks** to Mikko Nyman for testing and Peter Hessler for [the
pointer](https://twitter.com/phessler/status/950647948043485185).
