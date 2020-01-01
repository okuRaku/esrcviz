# esrcviz - Gource visualization of ESRC tend/sow history

Input is a csv file provided.  This script will translate that csv into a [log file](https://github.com/acaudwell/Gource/wiki/Custom-Log-Format) that Gource can parse and visualize.

Input format sample:
```csv
InitialSeedDate,ActivityDate,EntryType,System,Pilot,class,regionName,age
1/1/2001,10/18/2019 21:21,tender,J000004,pilot1,C5,E-R00006,2
1/1/2001,10/18/2019 21:25,tender,J000003,pilot1,C6,F-R00003,3
1/1/2001,10/18/2019 21:32,tender,J000002,pilot2,C4,D-R00006,2
1/1/2001,10/18/2019 21:32,tender,J000001,pilot3,C2,B-R00003,37
1/1/2001,10/21/2019 7:18,sower,J000000,pilot4,C2,B-R00001,0
```

Output format sample:

```csv
1275543595|andrew|A|src/main.cpp|FF0000
```

Proposed translation:
* timestamp: ActivityDate converted to epoch
* author: Pilot
* type: Sowing will be considered an Add, Tending a Modify, and Agent will be considered Delete
* file: regionName/system
* color: By wormhole class: ![#e9967a](https://placehold.it/15/e9967a/000000?text=+) `C1 #E9967A`; ![#FA8072](https://placehold.it/15/FA8072/000000?text=+) `C2 #FA8072`; ![#FF6347](https://placehold.it/15/FF6347/000000?text=+) `C3 #FF6347`; ![#FF4500](https://placehold.it/15/FF4500/000000?text=+) `C4 #FF4500`; ![#FF0000](https://placehold.it/15/FF0000/000000?text=+) `C5 #FF0000`; ![#DC143C](https://placehold.it/15/DC143C/000000?text=+) `C6 #DC143C`

Regarding cache expiration, current preference is to use the below settings to allow Gource to hide any 'file' (cache) that isn't touched in an amount of time that should correspond to 30 real time days.

```
-i, --file-idle-time SECONDS
            Time in seconds files remain idle before they are removed or 0
            for no limit.
```

Gource config file is part of the repo - run with ```gource outfile.log --load-config gource.cfg``` (edit config to taste)
