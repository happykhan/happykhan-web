---
title: Compare hybrid and short-read-only assemblies
---

# What is a 'good' genome assembly?

Think carefully about the aim of genome assembly and the process used to generate data. You can review **[Hybrid and short-read-only assembly of sequenced reads]({{site.baseurl}}/modules/sequence-analysis/genome-assembly/)** and reflect what was shown in week 2. 

Our ultimate goal is to reconstruct the original genome sequence, but to do this we have sheared, amplified the DNA and read off short sequences. There are errors introduced at each step. At the time of writing, there is no reliable method of automatically generating a perfect and complete genome sequence. We must make do with what we have, and be able to assess if the genome assembly is 'good enough' for our purposes.

In this section we will look at some of the tools available to assess the quality of genome assemblies, and compare our hybrid and short-read-only assemblies. This has two purposes:

* Help familiarise you with metrics and tools you can use to assess genome assembly quality.
* Show you the difference read length can play in genome assembly. 

## Assessing genome assembly quality

There are many tools available to assess genome assembly quality. We will look at some of the most common ones.

### Contiguity

This measures how contiguous the assembled genome is. You can look at metrics like the `N50` and `L50`, which indicate the length of the longest contig and the number of contigs needed to cover a certain percentage of the genome. Higher `N50` and lower `L50` values are generally better. How can we assess contiguity?

* Less contigs, Longer contigs
* N50, average contig length, number of contigs etc.
* Try [QUAST](https://quast.sourceforge.net/quast.html)

**Running QUAST**

```bash
quast.py assembly.fasta
```

QUAST offers various options and parameters to customize the analysis and output. You can specify different options to generate specific reports or change the output format. For example, you can use the -o flag to specify a different output directory, or use -R to provide a reference genome for alignment if available.

Here's an example of a more customized command:

```bash
quast.py -o custom_output_folder -R reference.fasta -g gene_annotation.gff assembly.fasta
```

This command specifies a custom output folder, uses a reference genome for alignment, and provides a gene annotation file for additional analysis.

Please refer to the QUAST documentation for a full list of available options and their descriptions. The specific options and settings you use may depend on your analysis goals and the characteristics of your data.

### Completeness
You can assess genome completeness by comparing your assembly to a reference genome if available. How can we assess completeness?

* Compare to reference genome (How to find a reference genome? Start with [web BLAST](https://blast.ncbi.nlm.nih.gov/Blast.cgi))
* Use QUAST to compare to reference genome via different metrics, or align the two genomes and inspect via [Mauve](https://darlinglab.org/mauve/mauve.html) or [Artemis](https://www.sanger.ac.uk/tool/artemis/).
* Assume a genome should have single copy essential genes:
    * [MLST](https://github.com/tseemann/mlst) intact?
    * [BUSCO](https://busco.ezlab.org/) panel
    * [CheckM](https://ecogenomics.github.io/CheckM) panel

> You may have trouble with installing BUSCO and CheckM (the databases are quite large). You can screen your data with web resources like Galaxy. Try [https://usegalaxy.eu/](https://usegalaxy.eu/)


**Running BUSCO**

Here is some example code to run BUSCO on our example data.

```
conda activate week2 
conda install -c conda-forge -c bioconda busco=5.5.0
busco --list-datasets
wget https://mmbdtp.github.io/seq-analysis/long_assembly.fasta
busco -i long_assembly.fasta  --out assembly-busco  --mode genome -l bacteria_odb10
cat assembly-busco/short_summary.specific.bacteria_odb10.test-busco.txt
```


### Correctness

Assess the accuracy of your assembly by checking for misassemblies, such as structural errors, inversions, or translocations. Visualization tools like Artemis or Bandage can help identify such issues. Effectively we are trying to assess, is the genome assembly what we expect? How can we assess correctness?

* Assembly free from errors
* Mis-joins
* Collapsed repeats
* Duplication artefacts 
* False SNPs, InDels
* Comparison to Other Assemblies: If other assemblies of the same species are available, compare your assembly to them to identify any discrepancies. Ideally to well known reference genome.
* Map original reads back to assembled contigs
* Evaluation of Plasmids: If the bacterium has plasmids, confirm that they are correctly assembled and identify their sequences.
* Structural rearrangement tools - [Socru](https://github.com/quadram-institute-bioscience/socru)
* Try looking at the graph in [Bandage](https://rrwick.github.io/Bandage/)

**Try using Mauve or Artemis for this step**

### Contamination 

Some common reasons for contamination in sequencing data include:

* Sample Cross-Contamination
* Contaminated Reagents and Kits
* Environmental Contamination
* Human Contamination
* Cross-Talking in Multiplexed Sequencing
* Lab Equipment Contamination
* Library Preparation and PCR Artifacts
* Sample Mix-Up

Check for contamination with tools like [Kraken/Bracken](https://ccb.jhu.edu/software/bracken/)

**Using Kraken2**

Here is some example code to run Kraken2 on our example data.

```
conda activate week2 
conda install -y kraken2 
kraken2 du -h -d1 /shared/public/db/kraken2
kraken2 --threads 8 --db /shared/public/db/kraken2/k2_standard_08gb/ --output long.hits.txt --report long.report.txt  --use-names long_assembly.fasta
```


### Circumstantial 

These are not direct evidence of a good genome, but can be reassuring.

What are some circumstanial evidence of a good genome?

* **GC Content:** Verify that the GC content of your assembly matches the expected GC content for the species. Significant deviations could indicate contamination or assembly errors.
* **Repeat Content:** Assess the presence and handling of repetitive elements. High levels of repeats may lead to fragmented assemblies or misassemblies.
* **Quality of Reads:** Examine the quality of the raw sequencing reads to ensure that they are of high quality, with minimal errors or biases.
* **Coverage Depth:** Evaluate the coverage depth across the genome. Uniform coverage indicates a more reliable assembly.
* **Visualization:** Use genome visualization tools like Artemis, IGV, or Tablet to visually inspect the assembly and confirm its quality.

Remember that the quality of your bacterial genome assembly may also depend on the sequencing technology used, the software and parameters employed for assembly, and the quality of the source DNA. Careful evaluation and validation of your assembly are essential for accurate results.

# Comparing hybrid and short-read-only assemblies

We previously discussed the importance of read length on genome assembly. You can review **[Hybrid and short-read-only assembly of sequenced reads]({{site.baseurl}}/modules/sequence-analysis/genome-assembly/)** and reflect what was shown in week 2. With that in mind, we will now compare our hybrid and short-read-only assemblies.

## Example data

If you have a problem with generating an assembly with Shovill (from the previous section). Here are some results I prepared earlier. 

* [contigs.fa](/seq-analysis/contigs.fa)
* [contigs.gfa](/seq-analysis/contigs.gfa)
* [shovill.corrections](/seq-analysis/shovill.corrections)
* [shovill.log](/seq-analysis/shovill.log)

If you have a problem with generating an assembly with Unicycler (from the previous section). Here are some results I prepared earlier. 

* [long_assembly.fasta](/seq-analysis/long_assembly.fasta)
* [long_assembly.gfa](/seq-analysis/long_assembly.gfa)
* [unicycler.log](/seq-analysis/unicycler.log)


## Exercise 1: Assessing genome assembly quality 

Many tools are available that assess sequence quality through read alignment, k-mer counting, gene finding, and other methods. Your exercise now is to compare and contrast the hybrid and short-read-only assemblies we prepared earlier using methods testing for Contiguity, Correctness, Completeness & Contamination (see above).

### Theory questions

**What is N50?**

**What is GC Content?** 

**What is "Genome Coverage"?** 

**How does BUSCO measure completeness?** 

**How does aligning to a reference genome help assess completeness?**

**How does using Kraken help assess contamination?**

### Practical questions

**What is the difference in N50, number of contigs, and L50 between the hybrid and short-read-only assemblies?**

**What is the difference in completeness between the hybrid and short-read-only assemblies?**

**Which assembly graph looks better between the hybrid and short-read-only assemblies (use Bandage)?**

**Try other tools and test for Contiguity, Correctness, Completeness & Contamination**

_You can try these different options on your own, or work in groups, or divide the different criteria between yourselves_ 

[Answers to exercises](/seq-analysis/genome-assembly-qc-answers/)


[Back to Programme]({{site.baseurl}}/modules/sequence-analysis/programme/).