---
title: Quality control criteria for sequenced reads
---
When working with genomic data, try not to get overwhelmed with the myriad of tools that assess these categories in one way or another. Instead, keep this list in mind and pick an approach that assesses each criterion. The exact specifics of which tools and what thresholds and metrics you employ is dependant on your specific question. We will go over some of the regularly used tools for typical usage. 

Go back to [A framework for quality control](01-qc-framework.md)

## Yield (Sequence reads)
*Do I have enough sequenced reads for my work?* We assume that in whole genome sequencing that the selection of DNA is random, such that with enough sequencing we should see representation of every position in the genome. In order to have confidence of the base called in that position, we *over*sample to have a number of reads from the same position to form a consensus. There are two main reasons why we oversample:

* The selection of DNA is *not* actually random. Some regions of the genome can prove problematic for some sequencing technologies, or some regions tend to be favoured by some technologies. If you plot the true read coverage across a genome, you will often see coverage variation across the genome - and in some regions the depth of coverage can be too low. For this reason, oversampling allows us to overcome any regions that may potentially drop out. 
* Sequencing technologies can not perfectly read individual bases. For a number of reasons which depend on the specific instrument, there will be erroneous bases introduced in individual reads. Luckily, for most instances, the error is random so by having additional reads of the same location we can correct errors in individual reads by looking for a consensus base call. 

Assuming that the DNA selection is random (which it isn't), we can do a quick calculation of the average coverage across a genome. We need to know the length of the original genome (G), the number of reads (N), and the average read length (L) to calculate the coverage which is: 

```
N x L / G 
```

Basically, the total number of bases divided by the length of the genome.

!!! Exercise
    Try this yourself, for a bacterial genome of 5 megabase pairs (5,000,000 bp) and an average read length of 150 bases. How many reads do you need to have 30 times coverage?

There are more comprehensive ways to calculate genome coverage, but this is an easy place to start. The answer, by the way, is one million reads. 

!!! Exercise
    If our sequencing platform has 20 gigabase pairs (20,000,000,000 bp) yield per sequencing run, how many isolates could we sequence; given the values in the exercise above? 

The answer is 133 isolates. So what yield should you aim for? The answer is what you hate to hear - it depends. It depends on your organism, and on your use case. As long as you do not hold me accountable I will tell you that in my work, I have gone as low as FIVE times coverage for analyses with read mapping, which is where individual reads are aligned to a reference; and as low as TWENTY times coverage to produce reasonable genome assemblies. However, for genome assemblies and most use cases I have encountered I would recommend genome coverage between 40 to 100. 

## Contamination (Sequence reads)

*Are the sequenced reads from the organism I am expecting?* We usually have an idea of what organism has been sequenced in each sample, we may know this in terms of the species, or we may have more refined information in terms of the seqeunce type, serotype, lineage or clade. This information is often from other molecular tests, or from the culturing protocol (e.g. selective media). We thus assume that the vast majority of sequenced reads of the sample should be consistent with this prior information. 

The simplest approach is to align or map the sequenced reads to a reference genome of the expected organism. This would entail:

* Fetch a reference genome from [Genbank](https://www.ncbi.nlm.nih.gov/genbank/)
* Map the sequenced reads to that reference
* Assess how many reads mapped to the reference and how many did not. 

I prefer [minimap2](https://github.com/lh3/minimap2) as my read mapper of choice, as it's fast and had different modes to work with any sequencing technology (PacBio, ONT, Illumina). Bowtie2 is another good option. There are many read mappers and everyone has their favourite. 

!!! tip 
    It's very easy to get bogged down trying to pick the "best" tool. In cases such as this, where it is a simple check of my data, I reach for something that is appropriate, reliable, fast and familiar. 

Another easy way to check this is to use a tool that provides taxonomic classification of the sequenced reads. These tools usually compare sequenced reads to a database of known reference genomes and use this information to assign the taxonomy for each read. These numbers are then summarised into an overall breakdown of the abundance of each detected taxon. Again, there are many tools to perform this analysis. I reach for [Kraken2](https://ccb.jhu.edu/software/kraken2/), particularly for Illumina data. It is appropriate, reliable, fast and familiar. 

We will look at some alternative approaches to detecting contamination in the section "Contamination (Genome assembly)". For now, let's apply what we have learnt so far. 

Go to [Practical - Read classification of our sequenced data](10-read-classification.md)

## Condition (Sequence reads)

Unlike criteria like Yield and Contamination, Condition looks at the intrinsic quality of the sequencing data. We are checking for errors introduced in the sequencing process, which include poor overall sequence read quality, shorter read length than expected, or introduced artefacts like unexpected constructs like adapter content. Luckily, sequencing instruments provide a quality score for each base sequenced along with the base itself, and many instruments provide detailed reporting as well. I find the reports from Illumina platforms very useful i.e. output from [bcl2fastq](https://support.illumina.com/content/dam/illumina-support/documents/documentation/software_documentation/bcl2fastq/bcl2fastq_letterbooklet_15038058brpmi.pdf). 

Here are a list of considerations for assessing the overall condition of sequenced reads: 

* Total number of sequences and average sequence length
* GC content
* Base by base sequence Quality across the length of the reads 
* The proportion of each nucleotide (A, T, C, G) at each position across all reads to detect any unexpected patterns or biases.
* The percentage of ambiguous base calls (N) at each position in the reads.
* Sequence Duplication
* Overrepresented Sequences: sequences that appear more frequently than expected, which can indicate contamination or other anomalies.
* Adapter Content

The specifics on how base qualities are presented to you (in FASTQ files) and what these values specifically mean is covered in [Dealing with sequence read data - What is a FASTQ?](/concepts/fastq-in-detail). For now, we will use look at some example data using FASTQC to learn more about the consideration above. 

Go to [Practical - Quality control for short reads](20-short-read-qc.md)

Go back to [A framework for quality control](01-qc-framework.md)
