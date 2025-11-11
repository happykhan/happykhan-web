---
title: Genome browsers and annotation
---

# Using a genome browser to look at contigs of our genomic data

Sometime the best way to understand data is to visualise it, and a common way of visualising and exploring genome assemblies is with a genome browser. A genome browser is a powerful tool in genomics and bioinformatics that provides a visual interface for exploring and analyzing genomic data. In this section, we will use genome browers to look at our assemblies and we will try to annotate some of genes. This manual curation may seem like a lot of work, but this is really how the first microbial genomes were annotated and explored! 

You should use the assembled contigs we generated earlier, particularly the one generated with Unicycler.

If you had a problem with generating an assembly with Unicycler. Here are some results I prepared earlier. 

* [long_assembly.fasta](/seq-analysis/long_assembly.fasta)
* [long_assembly.gfa](/seq-analysis/long_assembly.gfa)
* [unicycler.log](/seq-analysis/unicycler.log)

If you have having difficulty with the amount of sequence information, try the next few exercises with this short sequence "small_contigs.fasta". If you feel more confident you may try the "mystery pathogenicity island" - both of these are taken from the long read assembly above. 

* [small_contig.fasta](/seq-analysis/small_contigs.fasta)
* [mystery_island.fasta](/seq-analysis/mystery_island.fasta)

There a number of genome browsers available, we will use [Artemis](https://www.sanger.ac.uk/tool/artemis/). For ease of use, you can split the assembly FASTA file (Use the hybrid assembly for this) into seperate files. The FASTA file may look like this:

```
>1
TGATAGCAGCT...
>2 
AGCAGCTAGCA...
```

You can open `Artemis` like any other graphical program. From the command line you can run it with:

```
art my_assembly.fasta
```

You should try the smaller sequence from your assembly first. 

![Artemis with one tracks]({{site.baseurl}}/seq-analysis/artemis.png)

By default you will see 6 tracks. One for each frame (3 forward, 3 reverse). The black ticks are termination codons. A close up of the seqeunce is shown in the bottom panel. 

Try annotating the sequence by clicking and dragging on one of the tracks. `Right Click` > `Create` > `Feature from base range`. You can annotate any string of bases as whatever you like. 

## CDS prediction for genome contigs

Let's try annotating some coding sequences (CDS). Genes that code for proteins comprise open reading frames (ORFs) consisting of a series of codons that specify the amino acid sequence of the protein that the gene encodes. The ORF begins with an initiation codon - usually (but not always) ATG - and ends with a termination codon: TAA, TAG or TGA. Searching a DNA sequence for ORFs that begin with an ATG and end with a termination triplet is therefore one way of looking for genes. The analysis is complicated by the fact that each DNA sequence has six reading frames, three in one direction and three in the reverse direction on the complementary strain. 

> Remember: A double-stranded DNA molecule has six reading frames. Both strands are read in the 5′→3′ direction. Each strand has three reading frames, depending on which nucleotide is chosen as the starting position.  

Thus, **we know that the genes will appear between termination codons.** But does that mean that every ORF encodes a gene? No. One thing to keep in mind is that sequences that *look* like genes will occur randomly. Consider a completely random `ATGC` sequence (with a GC content of 50%), in this case each of the three termination codons - `TAA`, `TAG` and `TGA` - will appear, on average, once every 4^3 = 64 bp. 

If the GC content is > 50% then the termination codons, being AT-rich, will occur less frequently but one will still be expected every 100–200 bp. As such, ORFs that include a genuine gene should be longer than this. Most genes are longer than 50 codons: the average lengths are 317 codons for *Escherichia coli*, 483 codons for *Saccharomyces cerevisiae*, and approximately 450 codons for humans. That is not to say that genes with short sequences do not exist, but keeping these rules in mind will help us identify valid genes.  

This simple method of scanning for ORFS in a genome sequence is more complicated for eukaryotic DNA, where genes are often split by introns.  

![Artemis with one tracks]({{site.baseurl}}/seq-analysis/artemis.png)

Some tips for using Artemis:
* There is a graph of GC% under the `Graph` menu
* There is an option (`Right click`) in `Artemis` to show potential start codons as well. 

When you create a feature, you can select the `Key` which is the type of feature created. There are many standard ones to pick from:

* CDS - Coding sequence
* tRNA
* rRNA
* misc_feature
* ... many more

Try doing a few by hand, but there are automated tools that will predict CDS. One such web based tool is [https://www.ncbi.nlm.nih.gov/orffinder/](https://www.ncbi.nlm.nih.gov/orffinder/). Command line offerings include: 

* [GLIMMER](http://ccb.jhu.edu/software/glimmer/index.shtml)
* [GeneMark](http://exon.gatech.edu/GeneMark/)
* [Prodigal](https://github.com/hyattpd/Prodigal) (my favourite)

[Back to Programme]({{site.baseurl}}/modules/sequence-analysis/programme/).

## Manually annotate a sequence using web based homology searches

Using a combination of different tools, try to assign a function to the genes you have predicted. What can you say about the genome regions? There are web-based tools for you to use such as: 

* Web BLAST - [https://blast.ncbi.nlm.nih.gov/Blast.cgi](https://blast.ncbi.nlm.nih.gov/Blast.cgi)
* [https://www.ebi.ac.uk/Tools/hmmer/](https://www.ebi.ac.uk/Tools/hmmer/)
* [InterPro- https://www.ebi.ac.uk/interpro/](https://www.ebi.ac.uk/interpro/)

Try to save your findings in `Artemis` by editing the different features. You may want to use fields like `/note`, `/gene`, or `/product`. Be sure to save your work, common file formats are `EMBL` or `GenBank` or `GFF`.

# Exercise 1: Genome annotation

## Theory questions

**What does CDS stand for?**

**What approaches you can use to guide gene annotation?**

**What file formats can you use to save your annotations?**

**Why do we focus on putative genes longer than 50 codons?**

## Practical questions

**Open the chosen sequence in Artemis and spend some time marking genes you think are valid. Try to do at least 5.**

**How do your gene predictions compare to an automated tool? (use `orffinder`)**

**Use the web based tools to try to assign a function to the genes you have predicted.**

**Try installing `prodigal` and running it on your sequence.**

[Answers to exercises](/seq-analysis/annotation-answers/)


[Back to Programme]({{site.baseurl}}/modules/sequence-analysis/programme/).


