---
title: Automated annotation
---

# Automating genome annotation

As you may appreciate after the last exercise, [Genome browsers and annotation]({{site.baseurl}}/modules/sequence-analysis/anotation/), manual annotation is a time consuming process. It is also prone to human error.
Automated genome annotation is the process of using computational tools and algorithms to predict and annotate genes, regulatory elements, and other features within a genome. The considerations are the same as if we were doing it by hand, but we can use computers to do the heavy lifting.

In this section we will run a popular tool for annotating bacterial genomes, and compare that with our manual annotation from the last exercise.

## Automated annotation of genome using Prokka 

Prokka is a popular and user-friendly software tool designed for the automated annotation of prokaryotic (bacterial and archaeal) genomes. Developed by Torsten Seemann, Prokka streamlines the genome annotation process by integrating various bioinformatics tools and databases. Here's an explanation of how Prokka works:

* **Input:** You provide Prokka with the genomic sequence of the prokaryotic organism you want to annotate. This can be in FASTA format.
* **Gene Prediction:** Prokka uses `Prodigal` to predict protein-coding genes and determine the coordinates of these genes on the genome.
* **Annotation:** Prokka searches for functional annotations by comparing the predicted proteins against its local reference databases, which include well-annotated sequences from other organisms. This step assigns putative functions to the predicted proteins.
* **Non-Coding RNA Identification:** The tool identifies tRNA and rRNA genes within the genome based on sequence motifs.
* **Output:** Prokka generates annotation files in the desired format (e.g., GenBank or GFF) that can be used for further analysis and visualization.

### Tips for using command-line

Installing `prokka`
```
conda create -y -n prokka prokka
conda activate prokka
```

Running `prokka`
```
prokka assembly.fasta
```

The important output files:

* PROKKA_11042022.gbk: Genbank format of the genome annotation
* PROKKA_11042022.gff: GFF format of the genome annotation

PROKKA keeps all the genbank records, one after the other, in a single file. *You will need to manually split the individual genbank records in the .gbk file.* You can find the different records by looking for the header. 

```
//
LOCUS       2                      10376 bp    DNA     linear       04-NOV-2022
DEFINITION  Genus species strain strain.
ACCESSION   
VERSION
```

### Exercise 1: Comparing Prokka output with our manual annotation

**Run Prokka on your original genome sequence.** 

You should use the assembled contigs we generated earlier, particularly the one generated with Unicycler. If you had a problem with generating an assembly with Unicycler. Here are some results I prepared earlier. 

* [long_assembly.fasta](/seq-analysis/long_assembly.fasta)
* [long_assembly.gfa](/seq-analysis/long_assembly.gfa)
* [unicycler.log](/seq-analysis/unicycler.log)

**Compare the prokka output with your manual annotation** 

*Remember to save your manual annotations first!*. `File` > `Save entry as...` > `Genbank Format`. 

This can be done using `Artemis`. Load up the manual annotation you have already prepared. See the `Read an Entry...` option under `File`. Each set of annotations can be toggled in top left. 

![Artemis with two tracks]({{site.baseurl}}/seq-analysis/art_compare.png)

**How did you annotation compare to the automated one?**

[Back to Programme]({{site.baseurl}}/modules/sequence-analysis/programme/).