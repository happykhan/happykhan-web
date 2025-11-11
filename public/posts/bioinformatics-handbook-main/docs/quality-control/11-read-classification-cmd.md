---
title: Practical - Read classification (command-line)
---

One of the things to help us understand what's in our data is to classify the reads using Kraken2. We can use Kraken2 to classify reads against a database of known sequences. This is a quick way to get an idea of what is in our data.

Kraken 2 is a bioinformatics tool and software platform designed for the taxonomic classification of DNA sequences in metagenomic data. Metagenomics involves the study of genetic material collected from environmental samples, such as soil, water, or clinical specimens, to understand the microbial diversity present in these samples. Kraken 2 is a popular tool in this field, as it allows researchers to assign taxonomic labels to the sequences, helping them identify the microorganisms present in the samples.

!!! warning 
    These instructions were originally designed for CLIMB-BIG-DATA, they may still be instructive, but your environment may differ. 

## Installing Kraken2 and Krona
We will need the following software:

* `kraken2` - a taxonomic profiler for metagenomics data
* `krona` - an interactive visualiser for the output of Kraken2
* `krakentools` - some useful scripts for manipulating Kraken2 output
* `taxpasta` - a useful tool for converting and merging Kraken2 outputs into other formats like Excel

```bash
conda install -y kraken2 krona krakentools 
```

Krona reminds us to run `ktUpdateTaxonomy.sh` before it can be used.

```bash
ktUpdateTaxonomy.sh
```
You can test kraken2 was installed correctly by running it with no command-line options.

```bash
kraken2
```

## Kraken2 databases 
Pre-computed Kraken2 databases are available on the `/shared/public` file system within CLIMB-BIG-DATA. These databases are downloaded from Ben Langmad's publicly available Kraken2 indexes page. These datasets are updated monthly and we will keep the latest versions available.

The `/shared/public` area is designed to store frequently used, important databases for the microbial genomics community. We are just getting started building this resource so please contact us with suggestions for other databases you would like to see here.

We can take a look at the databases that are available, and their sizes:

```
du -h -d1 /shared/public/db/kraken2

7.5G    /shared/public/db/kraken2/k2_pluspf_08gb
9.1G    /shared/public/db/kraken2/k2_minusb
556M    /shared/public/db/kraken2/k2_viral
69G /shared/public/db/kraken2/k2_pluspf
7.5G    /shared/public/db/kraken2/k2_standard_08gb
15G /shared/public/db/kraken2/k2_pluspf_16gb
65G /shared/public/db/kraken2/k2_standard
15G /shared/public/db/kraken2/k2_standard_16gb
264G    /shared/public/db/kraken2/downloads
7.6G    /shared/public/db/kraken2/k2_pluspfp_08gb
15G /shared/public/db/kraken2/k2_pluspfp_16gb
145G    /shared/public/db/kraken2/k2_pluspfp
619G    /shared/public/db/kraken2
```

We can run Kraken2 directly within this JupyterHub notebook which is running in a container. A standard container has 8 CPu cores and 64Gb of memory. Kraken2 doesn't run well unless the database fits into memory, so we can use one of the smaller databases for now such a k2_standard_16gb which contains archaea, bacteria, viral, plasmid, human and UniVec_Core sequences from RefSeq, but subsampled down to a 16Gb database. This will be fast, but we trade off specificity and sensitivity against bigger databases.

```bash
kraken2 --threads 8 --db /shared/public/db/kraken2/k2_standard_08gb/ --output dtp2-2.hits.txt --report dtp2-2.report.txt  --use-names  ~/shared-team/week2/sequence-data/DTP-2-2_S10_L001_R1_001.fastq.gz

Loading database information... done.
155338 sequences (23.46 Mbp) processed in 0.636s (14643.6 Kseq/m, 2211.19 Mbp/m).
  140136 sequences classified (90.21%)
  15202 sequences unclassified (9.79%)
```

The dtp2-2.report.txt  gives a human-readable output from Kraken2.

```
cat dtp2-2.report.txt  
```

It's easier to look at Kraken2 results visually using a Krona plot:

```
ktImportTaxonomy -t 5 -m 3 dtp2-2.report.txt   -o KronaReport.html

   [ WARNING ]  Score column already in use; not reading scores.
Loading taxonomy...
Importing dtp2-2.report.txt...
Writing KronaReport.html...
```

We can look at the Krona report directly within the browser by using the file navigator to the left - open up the KronaReport.html within the shared-team directory where we are working. Click around the Krona report to see what is in there.

With the `extract_kraken_reads.py` script in krakentools we can quite easily extract a set of reads that we are interested in for further exploration: perhaps to use a more specific method like BLAST against a large protein database, or to extract for de novo assembly.

```
extract_kraken_reads.py -k dtp2-2.hits.txt  -s ~/shared-team/week2/sequence-data/DTP-2-2_S10_L001_R1_001.fastq.gz -r dtp2-2.report.txt -t 70863 -o whatisthis.fasta --include-children
```

```
PROGRAM START TIME: 10-31-2023 16:59:32
>> STEP 0: PARSING REPORT FILE dtp1.report.txt
        2 taxonomy IDs to parse
>> STEP 1: PARSING KRAKEN FILE FOR READIDS dtp1.hits.txt
        0.16 million reads processed
        121338 read IDs saved
>> STEP 2: READING SEQUENCE FILES AND WRITING READS
        121338 read IDs found (0.16 mill reads processed)
        121338 reads printed to file
        Generated file: whatisthis.fasta
PROGRAM END TIME: 10-31-2023 16:59:37
```

