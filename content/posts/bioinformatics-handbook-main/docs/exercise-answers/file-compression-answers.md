---
layout: page
---

Answers to the questions in the [File Compression]({{site.baseurl}}/modules/sequencing/file-compression/).

### What is a file exension? 

A string of characters attached to a filename, usually preceded by a full stop and indicating the format of the file. e.g. my_reads.fastq.gz has the extension .gz, indicating that it is a gzip compressed file. Keep in mind that the file extension may not be a reliable indicator of the true file format.

### What are the file extensions for the following compression formats?

| Compression Format  |  Extensions |
|---|---|
|  ZIP | .zip  |
| Gzip   | .gz, .gzip  |
| 7-Zip     | .7z   |
| RAR     | .rar  |
| TAR     |  .tar  |
| Bzip2     | .bz2  |
| LZMA     | .xz, .lzma  |

### What programs could you use to compress and decompress the following formats?

_You can suggest programs for any operating system_

| Compression Format  |  Software |
|---|---|
|  ZIP |  unzip (unix), winzip (windows), native software  |
| Gzip   | tar, gunzip, gzip (unix)  |
| 7-Zip     |  7zip (windows) |
| RAR     | winRAR (windows)  |
| TAR     | tar (unix)  |
| Bzip2     | tar, bunzip2/bzip2 (unix)  |
| LZMA     | tar (unix)  |

### Which of these formats has the best compression ratio?

N.B The compression ratio is a measure of how effectively a compression algorithm reduces the size of data. It is typically expressed as a ratio or a percentage and represents the relationship between the original data size (before compression) and the compressed data size (after compression).

This is an open question. Depending on the data, different compression formats will have different compression ratios. From the list above, implementations of LZMA i.e. xz seems to be the best for FASTQ, although it is not commonly used. See [this review](https://linuxreviews.org/Comparison_of_Compression_Algorithms)

Other formats that perform well (but not listed above) are [dsrc2](https://academic.oup.com/bioinformatics/article/30/15/2213/2391485) (for Illumina fastq) and [zstd](https://en.wikipedia.org/wiki/Zstd)


###  What are considerations when choosing a compression format?

* Compression ratio
* Time to compress/decompress
* Software support
* Streaming support
* Compatibility with operating system(s)
* **Ease for all users involved**


### What is the difference between SAM and BAM formats?

BAM files contain the same information as SAM files, except they are in binary file format which is not readable by humans. On the other hand, BAM files are smaller and more efficient for software to work with than SAM files, saving time and reducing costs of computation and storage.

[Back to Programme]({{site.baseurl}}/modules/sequencing/week-2-programme/).
