---
title: Understanding file compression
---

Bioinformatics data can be large, sequenced reads for a single bacterial isolate maybe several hundred megabytes, while metagenomic datasets will be much larger. An Illumina NextSeq 550 can produce up to 120 Gigabase pairs per run (~120 Gigabytes of data). To minimize the footprint of these data, most sequenced data is compressed in one way or another and this what you will usually encounter. 

In this module, we will cover the some basics on file compression, understand the different formats you may encounter and practice one of the most common formats (gzip). 

!!! tip Warning
    You should avoid working with uncompressed sequenced read data (i.e FASTQ or SAM). It is a waste of disk space and will slow down your analysis. Some bioinformatics tools you will encounter will force you to use uncompressed files, and this is a sign they are poorly written. 

## What is file compression?
File compression is the process of reducing the size of one or more files or folders to save disk space or reduce the time required for file transfer. Compression algorithms remove redundancy and encode data more efficiently. File compression is a right field of study in computer science and technical details of file compression [can be found here](/seq-data/compression.pdf)

Here is a table of common compression formats and their descriptions:

| Compression Format   | Description                                               | Commonly Used On         |
|----------------------|-----------------------------------------------------------|---------------------------|
| ZIP                  | Uses ZIP compression algorithm; highly compatible        | Multiple platforms       |
| Gzip           | Uses DEFLATE algorithm; commonly in Unix-like systems   | Unix-like systems        |
| 7-Zip           | Open-source with high compression ratios                | Windows, various platforms |
| RAR                  | Often used for large files and supports multiple methods | Multiple platforms       |
| TAR                  | Groups files/directories (not compression by itself)    | Multiple platforms       |
| Bzip2          | Uses Burrows-Wheeler Transform; good compression ratios  | Multiple platforms       |
| LZMA            | Known for high compression ratios                        | Linux and software distribution |
| Compressed Archive Formats | Native archive formats         | Respective platforms      |

## Exercise questions 

**What is a file extension?**
**What are the file extensions for the following compression formats?**

  * Zip
  * Gzip 
  * 7-Zip
  * RAR
  * TAR
  * BZIP2
  * LZMA

**What programs could you use to compress and decompress the following formats (These programs can be for any operating system)?**

  * Zip
  * Gzip 
  * 7-Zip
  * RAR
  * TAR
  * BZIP2
  * LZMA

**Which of these formats has the best compression ratio?**

**What are considerations when choosing a compression format?**

**What is the difference between SAM and BAM formats?**

Watch [Compression: Crash Course Computer Science #21](https://youtu.be/OtDxDvCpPL4?si=AMBN09cTGLyRx_ql) for a light introduction on file compression (in general). 

[Answers to exercise questions](/exercise-answers/file-compression-answers)
