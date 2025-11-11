---
title: Answeres for Practical - Genome assembly QC
---
### Theory questions

#### What is N50?

N50 is a statistical metric used to evaluate the contiguity or the degree of fragmentation in a set of sequences, such as in genome assemblies or sequence data. It is commonly used in genomics to assess the quality of an assembly, especially in the context of DNA sequencing.

N50 represents the length at which 50% of the entire assembly is contained in contigs or scaffolds of equal or greater length. In other words, it's a measure of the assembly's contiguity, and it indicates the median size of the contigs or scaffolds in the assembly. The larger the N50 value, the more contiguous and complete the assembly is considered.

To calculate the N50, you would typically:

1. Arrange the contigs or scaffolds in descending order of size (from largest to smallest).
2. Calculate the total length of all contigs or scaffolds in the assembly.
3. Find the length at which the cumulative sum of the contigs or scaffolds equals or surpasses 50% of the total length.

#### What is GC Content?

GC content, or Guanine-Cytosine content, is a fundamental and important concept in molecular biology and genomics. It refers to the proportion or percentage of the nitrogenous bases guanine (G) and cytosine (C) within a DNA or RNA molecule in a given sequence or genome. In DNA, the four nitrogenous bases are adenine (A), thymine (T), guanine (G), and cytosine (C). GC content is determined by calculating the ratio of the combined number of guanine (G) and cytosine (C) bases to the total number of bases (A, T, G, and C) in a DNA sequence, and then expressing it as a percentage:

*GC Content (%) = Number of G + C bases / Total number of bases × 100*

For example, in a DNA sequence with 30 G and C bases and a total of 100 bases (including A and T), the GC content would be:

*GC content (%) = (30 / 100) × 100 = 30%*

GC content can vary significantly between different species and even within the genomes of the same species. It has important biological implications, as it can influence the stability of DNA, gene expression, and the efficiency of processes like DNA replication and transcription. GC content is often used in bacterial and microbial taxonomy as a characteristic for species identification. Different species can have distinct GC content ranges. 

#### What is "Genome Coverage"?

Genome coverage, in genomics, refers to the extent to which a sequencing dataset or reads from a sequencing experiment effectively spans and represents the entire genome of an organism. It is a measure of how well the 
sequencing data covers or maps to the genomic regions of interest. 

**Read Mapping:** To determine genome coverage, sequencing reads (e.g., from Illumina, PacBio, or Oxford Nanopore sequencing) are aligned or mapped to a reference genome. The reference genome serves as a template for identifying the positions of each read in the genome.

**Average Coverage:** Genome coverage is often summarized by calculating the average coverage, which is the mean coverage depth across the entire genome. It provides an overall estimate of the sequencing depth achieved for the genome, but remember that coverage often fluctuates across the genome.

#### How does BUSCO measure completeness?

BUSCO (Benchmarking Universal Single-Copy Orthologs) measures the completeness of a genome assembly or annotation by evaluating the presence of a predefined set of single-copy orthologous genes that are expected to be present in the genome of the organism under investigation. These orthologous genes are highly conserved across a wide range of species, and their presence in the genome serves as a reliable indicator of completeness. BUSCO maintains a reference database containing the sequences of these selected benchmark genes. This database is used to compare against the genes found in the genome assembly.

BUSCO provides completeness metrics based on the results of this comparison. These metrics include:

* Complete: Genes that are found in the genome assembly and match the reference database.
* Duplicated: Genes that are found in the genome assembly but appear more than once, indicating potential duplication.
* Fragmented: Genes that are found in the genome assembly but are only partially represented or have missing regions.
* Missing: Genes that are not found in the genome assembly.

#### How does aligning to a reference genome help assess completeness?

Basically, identification of gaps and missing regions: When you align your sequencing data to a reference genome, areas where your data fails to map or align effectively can indicate gaps or missing regions in your assembly. If a region is not represented in your assembly, reads from your data won't align to that region in the reference genome.

#### How does Kraken help assess contamination?

Kraken is a bioinformatics tool that can help assess contamination in metagenomic or microbiome sequencing datasets by classifying sequencing reads and identifying the sources of potential contamination. Here's how Kraken helps assess contamination:

Kraken performs taxonomic sequence classification by assigning taxonomic labels (species, genera, etc.) to each sequencing read based on the sequences found in a reference database of known microbial genomes. The reference database contains the genetic information of various microorganisms, and Kraken uses this information for classification. As such, Kraken can identify potential contaminants by classifying reads that match taxonomic lineages not expected to be present in the sample. If the sample is believed to contain a specific set of microorganisms, any reads classified under taxonomic lineages outside of that expected set could indicate contamination.

> Kraken is optimised for Illumina sequenced reads. 

How does Kraken work? Kraken employs a k-mer-based approach to classify reads. K-mers are short, fixed-length sequences extracted from the input reads. Kraken then matches these k-mers against the k-mers in the reference database. The taxonomic label assigned to a read is determined by the majority vote of the k-mers it contains.
