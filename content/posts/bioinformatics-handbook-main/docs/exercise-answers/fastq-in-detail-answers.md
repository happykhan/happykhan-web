---
title: FASTQ in detail answers
---

Answers for exercise in [FASTQ in detail](/concepts/fastq-in-detail)

**For the FASTQ header line below, what is the run ID, the indexes used and name of the instrument?**

```
@M00970:337:000000000-BR5KF:1:1102:17745:1557 1:N:0:CGCAGAAC+ACAGAGTT
```

* Run ID is `337`.
* Indexes used are `CGCAGAAC` and `ACAGAGTT`.
* Name of the instrument is `M00970`.


**Which ASCII character corresponds to the worst Phred score for Illumina 1.8+?**

The worst Phred score is the smallest one, so 0. For Illumina 1.8+, it corresponds to the ! character.

**What is the Phred quality score of the 3rd nucleotide of the following sequence?**

```
@M00970: .... 
GTGCCAGCCGCCGCGGTAGTCCGACGTGGC
+ 
GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
```

The 3rd nucleotide of the 1st sequence has a ASCII character `G`, which correspond to a score of 38.

**What is the accuracy of this 3rd nucleotide?**

The corresponding nucleotide G has an accuracy of almost 99.99%
