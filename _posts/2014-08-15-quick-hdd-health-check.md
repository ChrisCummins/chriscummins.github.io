---
title: Quick HDD Health Check
banner: /img/banners/17-mile-drive.jpg
---

Recently I have had to deal with two hardware disk failures in quick
succession, which has led to two changes:

1. A much increased pace of development on
   [emu](/2014/emu-by-example/) (more on that soon!).
2. Taking a more programmatic and astute approach to keeping on eye on
   system health.

In order to facilitate the second point, I adapted a simple one-liner
from this
[disk cloning with ddrescue](http://www.kossboss.com/linux---how-to-clone-a-disk-with-ddrescue---dnu-ddrescue-also-known-as-gddrescue---the-better-ddrescue-tool)
tutorial in order to provide a quick and simple overview of the health of hard drives:

```sh
for i in $(ls /dev/sd[a-z]); do echo "=== $i ==="; \
sudo smartctl -a $i | egrep --color=never -i \
"reallocated_sector|ata error|serial|model|user capacity"; \
sudo smartctl -H $i &>/dev/null || sudo smartctl -H $i; echo; done;
```

Example output for a system with 5 drives, the fourth of which
(`/dev/sdd`) is failing:

```
=== /dev/sda ===
Device Model:     WDC WD40EFRX-68WT0N0
Serial Number:    WD-XXXXXXXXXXXX
User Capacity:    4,000,787,030,016 bytes [4.00 TB]
  5 Reallocated_Sector_Ct   0x0033   200   200   140    Pre-fail  Always       -       0

=== /dev/sdb ===
Model Family:     Western Digital Caviar Green (AF)
Device Model:     WDC WD20EARS-00MVWB0
Serial Number:    WD-XXXXXXXXXXXX
User Capacity:    2,000,398,934,016 bytes [2.00 TB]
  5 Reallocated_Sector_Ct   0x0033   200   200   140    Pre-fail  Always       -       0

=== /dev/sdc ===
Model Family:     Western Digital Red (AF)
Device Model:     WDC WD20EFRX-68EUZN0
Serial Number:    WD-XXXXXXXXXXXX
User Capacity:    2,000,398,934,016 bytes [2.00 TB]
  5 Reallocated_Sector_Ct   0x0033   200   200   140    Pre-fail  Always       -       0

=== /dev/sdd ===
Model Family:     Western Digital Caviar Green (AF)
Device Model:     WDC WD20EARS-00MVWB0
Serial Number:    WD-XXXXXXXXXXXX
User Capacity:    2,000,398,934,016 bytes [2.00 TB]
  5 Reallocated_Sector_Ct   0x0033   200   200   140    Pre-fail  Always       -       0
smartctl 6.2 2013-07-26 r3841 [x86_64-linux-3.13.0-29-generic] (local build)
Copyright (C) 2002-13, Bruce Allen, Christian Franke, www.smartmontools.org

=== START OF READ SMART DATA SECTION ===
SMART overall-health self-assessment test result: FAILED!
Drive failure expected in less than 24 hours. SAVE ALL DATA.
Failed Attributes:
ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
  1 Raw_Read_Error_Rate     0x002f   020   020   051    Pre-fail  Always   FAILING_NOW 89263


=== /dev/sde ===
Model Family:     HP 250GB SATA disk VB0250EAVER
Device Model:     VB0250EAVER
Serial Number:    XXXXXXXX
User Capacity:    250,059,350,016 bytes [250 GB]
  5 Reallocated_Sector_Ct   0x0033   100   100   036    Pre-fail  Always       -       0
```

And here is the command in expanded form. Note that it runs the SMART
health check, and will show the output is the test fails.

```
for i in $(ls /dev/sd[a-z]); do
    echo "=== $i ==="
    sudo smartctl -a $i | egrep --color=never \
        -i "reallocated_sector|ata error|serial|model|user capacity"
    sudo smartctl -H $i &>/dev/null || sudo smartctl -H $i
    echo
done
```

Note also that this depends on the `smartctl` binary, which is
probably not included in most default distributions. In Debian, you
need to apt-get the `smartmontools` package:

```
sudo apt-get install smartmontools
```
