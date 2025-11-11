---
title: Exploring file formats
---

While we talk about file "formats" for sequencing data these are not the same as file formats for propperity programs such as MS Word or binary file formats. These are simply text files with a particular structure. This means that you can open these files and read them as plain text even if the file extension is `.fastq`, `.fasta` and so on. 

## Common file formats

Here are some common genomics sequence file formats, some of which we have mentioned already;. 

| Format               | Description                                            |
|----------------------|--------------------------------------------------------|
| _FASTA_                | A text-based format for representing nucleotide or protein sequences. Each sequence is represented by a header line starting with '>', followed by the sequence data.       |
| _FASTQ_                | A format for representing both nucleotide sequences and their corresponding quality scores. Each record contains a sequence and quality scores in a readable text format.        |
| _SAM (Sequence Alignment/Map)_ | A tab-delimited text format for storing sequence alignment data, often used for mapping short reads to a reference genome.      |
| _BAM (Binary Alignment/Map)_ | A binary version of the SAM format, which is more compact and efficient for large datasets. Used for storing sequence alignment data.        |
| _VCF (Variant Call Format)_ | A text-based format for representing genetic variations, including single nucleotide polymorphisms (SNPs), insertions, deletions, and structural variants.        |
| _BCF (Binary Call Format)_ |  A binary version of the VCF format, which is more compact and efficient for large datasets.        |
| _BED (Browser Extensible Data)_ | A text-based format for representing genomic intervals, such as regions of interest, gene annotations, and functional elements.        |
| _GFF/GTF (General Feature Format/General Transfer Format)_ | Text-based formats for representing genomic features, including genes, exons, and other structural elements. GFF is often used in older annotations, while GTF is commonly used in more recent annotations.   |
| _FAST5_               | A format used by Oxford Nanopore Technologies (ONT) for storing raw sequencing data produced by their nanopore sequencing platforms. |


### Exercise: Exploring file formats

The post-doc is on holiday, and you have been given a directory of mysterious sequence data files. You need to figure out what file format each file is in.

```bash
user:~/file-formats$ ls -lag 
total 68837
drwxr-xr-x 2 users       10 Oct 18 13:47 .
drwxr-xr-x 3 users        1 Oct 18 13:29 ..
-rw-r--r-- 1 users   141566 Oct 18 13:32 pKP1-NDM-1.aries
-rw-r--r-- 1 users 24137926 Oct 18 13:32 pKP1-NDM-1.cancer
-rw-r--r-- 1 users  4170743 Oct 18 13:32 pKP1-NDM-1.gemini
-rw-r--r-- 1 users  2598233 Oct 18 13:32 pKP1-NDM-1.leo
-rw-r--r-- 1 users  4239662 Oct 18 13:32 pKP1-NDM-1.libra
-rw-r--r-- 1 users 24539958 Oct 18 13:32 pKP1-NDM-1.pisces
-rw-r--r-- 1 users  1316209 Oct 18 13:32 pKP1-NDM-1_R1.capricorn
-rw-r--r-- 1 users  2728498 Oct 18 13:32 pKP1-NDM-1.scorpio
-rw-r--r-- 1 users  3966215 Oct 18 13:42 pKP1-NDM-1.taurus
-rw-r--r-- 1 users  2647629 Oct 18 13:32 pKP1-NDM-1.virgo
```

You can download a tarball of all the files from [Zenodo](https://zenodo.org/records/10018484/files/file-format-mystery.tar.gz?download=1). In general, example files should be in [https://zenodo.org/records/10018484](https://zenodo.org/records/10018484).

For each of the files in the tarball, can you:

* Copy these files to your home directory. 
* Identify the file format?
* List the common file extensions people use for the file formats you find?
* Can you define some general rules to differeniate the file format?

Hint: Use common linux commands, such as `head`, `tail`, `less`, `cat`, `zcat` and so on. In case something gets stuck use CTRL-C or CTRL-Z. Ctrl+C is used to forcefully terminate a process, while Ctrl+Z is used to suspend a process and move it to the background, where it can be resumed or managed later. Remember that you can use pipes into `less` or `more` to make it easier to read the output of commands.

**What is this data?** This is simulated reads of a plasmid that carries _blaNDM_ genes, descibed here [https://doi.org/10.1128/aac.00368-16](https://doi.org/10.1128/aac.00368-16). _blaNDM_ genes confer carbapenem resistance and have been identified on transferable plasmids belonging to different incompatibility (Inc) groups. I chose a plasmid because it would create small files and would be easy to work with.

[Answers for this exercise](/exercise-answers/file-formats-answers).
