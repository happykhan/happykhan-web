---
layout: page
---

# Common file formats (answers)

Answers for [File formats]({{site.baseurl}}/modules/sequencing/file-formats) exercise.


## Identify the file format?

| Hidden filename         | True filename          |
|-------------------------|------------------------|
| pKP1-NDM-1.taurus       | pKP1-NDM-1.bcf         |
| pKP1-NDM-1.leo          | pKP1-NDM-1.bed         |
| pKP1-NDM-1.aries        | pKP1-NDM-1.fasta       |
| pKP1-NDM-1.libra        | pKP1-NDM-1.gff         |
| pKP1-NDM-1_R1.capricorn | pKP1-NDM-1_R1.fasta.gz |
| pKP1-NDM-1_R1.virgo     | pKP1-NDM-1_R1.fastq.gz |
| pKP1-NDM-1_R2.scorpio   | pKP1-NDM-1_R2.fastq.gz |
| pKP1-NDM-1.cancer       | pKP1-NDM-1.sam         |
| pKP1-NDM-1.gemini       | pKP1-NDM-1.sorted.bam  |
| pKP1-NDM-1.pisces       | pKP1-NDM-1.vcf         |

## List other common file extensions people use?

| Format               | File extensions                                            |
|----------------------|--------------------------------------------------------|
| _FASTA_                |  .fasta, .fna, .fas, .fa     |
| _FASTQ_                |  .fastq  |
| _SAM (Sequence Alignment/Map)_ |   .sam  |
| _BAM (Binary Alignment/Map)_ |     .bam    |
| _VCF (Variant Call Format)_ |  .vcf  |
| _BCF (Binary Call Format)_ |  .bcf  |
| _BED (Browser Extensible Data)_ | .bed, .bedfile  |
| _GFF/GTF (General Feature Format/General Transfer Format)_ | .gff, .gtf, .gff3   |
| _FAST5_               | .fast5 |


## Can you define some general rules to determine the file format?

#### pKP1-NDM-1.aries
FASTA files start with a header line starting with '>', followed by the sequence data.

```
>KF992018.2 Klebsiella pneumoniae strain KP1 plasmid pKP1-NDM-1, complete sequence
GATAGGCTCAGATAAACAGACCTTACCCTCGCATCGAGAACCGCTTGCCCTCCAGCATCGAGAGACGGTG
```

#### pKP1-NDM-1.cancer
SAM files start with a header line starting with '@', followed by the sequence data. SAM format is fairly complicated, but there is detailed specification online, https://en.wikipedia.org/wiki/SAM_(file_format). 

```
@HD     VN:1.6  SO:unsorted     GO:query
@SQ     SN:KJ802404.1   LN:166750
@PG     ID:minimap2     PN:minimap2     VN:2.26-r1175   CL:minimap2 -ax sr ref.fasta pKP1-NDM-1_R1.fastq.gz pKP1-NDM-1_R2.fastq.gz
KF992018.2-55020        83      KJ802404.1      125388  60      150M    =      125339   -199    TATTGGAGCTGGGTTGGAGCTACTTAGCCAACTAATCGAAAATAATGGGAGTTGGAAATGTGTTAGTTGGTCAAAAGTTGGAATCGCCGGAGCGATTGGGGCTATAGGTGGCGGCTGGGCGTCAGGAGTTTTCAGACATGCCAGCTCCGG  GCGGGGGGGG1GGGGGCGCCCGGGGGGGCC8GG=8GGGGCGGGCGG=GCJGGGG=GCCGCGGGG=GGGG=GGGCCGCG8G8JJCGJC8GGGJJCJGJJGGGGGGJJJGGGJJGJCJJJJJJGJJGCGJJJJJGJJJJGGGGGGGGG=1CC NM:i:0   ms:i:300        AS:i:300        nn:i:0  tp:A:P  cm:i:17 s1:i:183       s2:i:0   de:f:0  rl:i:0
```

#### pKP1-NDM-1.gemini
BAM files start with a header line starting with '@', followed by the mapping data. This one is tricky, because it is a binary file in its own format. To figure this out, I did the following

```bash 
head pKP1-NDM-1.gemini 
zcat  pKP1-NDM-1.gemini | more 
conda env list 
conda activate week2 
samtools view pKP1-NDM-1.gemini | more 
```

The `zcat` output looked like a slightly garbled `bam` file, to work with `bam` files it is best to use `samtools view`. You make need to install `samtools` via `conda`, or use the `week2` environment (as above). 

The final output is the same as the `sam` file above, so the validation is the same as for the `sam` file.

#### pKP1-NDM-1.leo
This is a BED file. BED files, like quite a few formats, are a tabular (tab-delimited) table. 

A typical BED file contains the following columns:

* Chromosome: The name of the chromosome or sequence where the feature is located.
* Start Position: The starting position of the feature on the chromosome, typically a 0-based coordinate.
* End Position: The ending position of the feature on the chromosome, also in 0-based coordinate.
* Name/ID: A user-defined name or identifier for the feature (optional).
* Score: A numeric value associated with the feature (optional).
* Strand: Indicates the strand of the DNA (either "+" for forward or "-" for reverse) where the feature is located (optional).

```
KJ802404.1      0       115     KF992018.2-51862/1      60      +
KJ802404.1      0       100     KF992018.2-50856/1      60      +
KJ802404.1      0       60      KF992018.2-41754/2      60      +
KJ802404.1      0       28      KF992018.2-40806/1      8       +
KJ802404.1      0       134     KF992018.2-40026/2      60      +
```

#### pKP1-NDM-1.libra
This is a GFF file. This is another tabular file format, but with a different structure to BED files. Much of the information is the same and it can be hard to tell the difference. 

A typical GFF file contains tab-delimited fields with specific information about genomic features. The fields in a GFF file are as follows:

* Sequence or Reference Identifier: The name of the chromosome or reference sequence where the feature is located.
* Source: The source of the feature's annotation data (e.g., a software tool or database).
* Feature Type: Describes the type of genomic feature (e.g., gene, exon, mRNA, CDS, etc.).
* Start Position: The starting position of the feature on the reference sequence (1-based).
* End Position: The ending position of the feature on the reference sequence (inclusive, 1-based).
* Score: A numeric value associated with the feature, which can represent confidence or significance (optional).
* Strand: Indicates the strand of the DNA where the feature is located (+ for forward strand, - for reverse strand, or . for unknown strand).
* Frame: Describes the reading frame of the feature (optional; typically used for coding sequences).

```
KJ802404.1      bed2gff KF992018.2-51862/1      1       115     60      +      .KF992018.2-51862/1;
KJ802404.1      bed2gff KF992018.2-50856/1      1       100     60      +      .KF992018.2-50856/1;
KJ802404.1      bed2gff KF992018.2-41754/2      1       60      60      +      .KF992018.2-41754/2;
```

#### pKP1-NDM-1.pisces
This is a VCF file. The `#` denote header lines, the `#CHROM` line is the header line for the data. The actual data, which are  variant calls, follows after and is tab-delimited. I don't remember the specifics of each file format if I haven't worked with them for a while. I would have to look up the VCF specification to remember the details, see https://en.wikipedia.org/wiki/Variant_Call_Format for details. 

```
##fileformat=VCFv4.2
##FILTER=<ID=PASS,Description="All filters passed">
##samtoolsVersion=1.9+htslib-1.9
##samtoolsCommand=samtools mpileup -g -B pKP1-NDM-1.sorted.bam
##contig=<ID=KJ802404.1,length=166750>
#CHROM  POS     ID      REF     ALT     QUAL    FILTER  INFO    FORMAT  pKP1-NDM-1.sorted.bam
KJ802404.1      1       .       N       A,<*>   0       .       DP=25;I16=0,0,17,0,0,0,921,54865,0,0,1020,61200,0,0,349,8157;QS=0,1,0;VDB=3.43287e-11;SGB=-0.690438;MQ0F=0      PL      255,51,0,255,51,255
KJ802404.1      2       .       N       T,<*>   0       .       DP=25;I16=0,0,17,0,0,0,912,53316,0,0,1020,61200,0,0,355,8311;QS=0,1,0;VDB=3.87166e-11;SGB=-0.690438;MQ0F=0      PL      255,51,0,255,51,255
KJ802404.1      3       .       N       G,<*>   0       .       DP=25;I16=0,0,17,0,0,0,859,47439,0,0,1020,61200,0,0,361,8477;QS=0,1,0;VDB=4.36512e-11;SGB=-0.690438;MQ0F=0      PL      255,51,0,255,51,255
```

#### pKP1-NDM-1_R1.capricorn
This is a binary file, a gzip file specifically, `zcat` will show us that it is a FASTA file as we saw before. The headers and the sequence length suggests it was a FASTQ file, but the quality scores are now removed. 

```
>KF992018.2-55020/1
CCGGAGCTGGCATGTCTGAAAACTCCTGACGCCCAGCCGCCACCTATAGCCCCAATCGCTCCGGCGATTCCAACTTTTGA
CCAACTAACACATTTCCAACTCCCATTATTTTCGATTAGTTGGCTAAGTAGCTCCAACCCAGCTCCAATA
>KF992018.2-55018/1
CAAGGCCCGGTCGGCTTTGGTGTACCTCCAACCAATTTTGGAGGCACTATGTCTAATTCAAATTTCGGCTTTCTAGCTCT
GGCCTTGCGCCAACGCCTGATCAAACGCTGGTCACTGATGCACTCTGTTCAACCGGAGTCTGTGTTGGAT
>KF992018.2-55016/1
AGCACCAGCAATACCGAAGAATAGGAAAGCCAGTATTGCCCCGGCCTTCAACCATACAAAAACACTTCTCACAATTATCC
TTCCTGCTTTACAAATGGGTCTCTGCCATCGAGAGGCTTTGAAAAAATAGCCCCCGGCTCAGACATCGCC
>KF992018.2-55014/1
AGTCGATGTCGCCATTGGTATAGCACCGAATTTGTCTGTAAAGGTGGAGAGTCATGACACCAGGGCAGTCCGCTCGAAGT
GCTTCAAACCTCTCTTGCCTGGTGGGGTACGTCGAGATAATGAACTCCTCGATACCAGCTTTGGCCGCGT
```

##### pKP1-NDM-1.scorpio 
This is a compressed (gzipped) FASTQ file. We need `zcat` or similar to handle the file compression. You may have noticed the `/2` at the end of each header. This is a convention that tells us this is the mate pair (R2) of a paired-end read. This convention is not always enforced, so I would ask the person who gave me the file to confirm.  We will delve more into FASTQ format in the next section, so I will not give a full explantion here.

```
@KF992018.2-55020/2
CTATGTCCAATACCGACCCGACGGGTGAATTTGCGTTTGTTGGTGCAGGTATTGGCGCTGGGTTGGAGCTACTTAGCCAA
CTAATCGAAAATAATGGGAGTTGGAAATGTGTTAGTTGGTCAAAAGTTGGAATCGCCGGAGCGATTGGGG
+
1CCGGGGGGCGGGJCJJJJ1JJJGJJGJJJGJ1CGJGJGCJC=GJC1CJGCGGCJ(=JGJGJJG1=GGJGGGGGGGGGGG
C88GCGGCGCC=CGGC8GGGG=JCJJ1GGGGGGGG=GCCGGGGGG=GGGGCGG1GCGGGGGGGGGCGCG8
@KF992018.2-55018/2
ATATTGCCAGCCAGGTAGGAAAGCAGGGTAACAACAGCGCTGTGTTCCAACACAGACTCCGGTTGAACAGAGTGCATCAG
TGACCAGCGTTTGATCAGGCGTTGGCGCAAGGCCAGAGCTAGAAAGCCGAAATTTGAATTAGACATAGTG
+
CCCCGGGGGGCGGGJJJJJJ(JJJCJGJG18JJJJJGJCCJGG=JJJCJGGJJGG=CJJCJJ8GGJCJGC=CGGC=CGCG
CGGCCGCGGCGG=GCGGCG=GGC=CJCCGGCGCGCGGGGCGGGGCGGGCG(GCCGGGCGGGCGGGGCGCC
```

#### pKP1-NDM-1.taurus
This is a compressed VCF file, i.e. a bcf file. We can view the contents with `zcat` or similar. 
We can also use `bcftools view` or `bcftools query` (the same way we do with SAM/BAM). After this point, we handle this the same way as a vcf file (see above). 

```bash
KJ802404.1      147292  .       N       A,<*>   0       .       DP=74;I16=0,0,38,11,0,0,2697,164485,0,0,2880,169920,0,0,907,20489;QS=0,1,0;VDB=0.977868;SGB=-0.693147;MQSB=0.99742;MQ0F=0       PL      255,148,0,255,148,255
KJ802404.1      147293  .       N       T,<*>   0       .       DP=75;I16=0,0,38,11,0,0,2794,173756,0,0,2880,169920,0,0,900,20296;QS=0,1,0;VDB=0.975609;SGB=-0.693147;MQSB=0.99742;MQ0F=0       PL      255,148,0,255,148,255
```

#### pKP1-NDM-1.virgo
This is a compressed FASTQ file. We can view the contents with `zcat` or similar. You may have noticed the `/1` at the end of each header. This is a convention that tells us this is the first read pair (R1) of a paired-end read. This convention is not always enforced, so I would ask the person who gave me the file to confirm. We will delve more into FASTQ format in the next section, so I will not give a full explantion here.

```bash
@KF992018.2-55020/1
CCGGAGCTGGCATGTCTGAAAACTCCTGACGCCCAGCCGCCACCTATAGCCCCAATCGCTCCGGCGATTCCAACTTTTGA
CCAACTAACACATTTCCAACTCCCATTATTTTCGATTAGTTGGCTAAGTAGCTCCAACCCAGCTCCAATA
+
CC1=GGGGGGGGGJJJJGJJJJJGCGJJGJJJJJJCJGJJGGGJJJGGGGGGJJGJCJJGGG8CJGCJJ8G8GCGCCGGG
=GGGG=GGGGCGCCG=GGGGJCG=GGCGGGCGGGG8=GG8CCGGGGGGGCCCGCGGGGG1GGGGGGGGCG
```

> As you get more familiar with data from a specific organism or datatype, you maybe able to identify the type of data simply by the file size. For example, for what I do, a 300MB file is likely to be a FASTQ file, while a 1MB file is likely to be a VCF file. 

Back to [File formats]({{site.baseurl}}/modules/sequencing/file-formats) exercise.

[Back to Programme]({{site.baseurl}}/modules/sequencing/week-2-programme/).
