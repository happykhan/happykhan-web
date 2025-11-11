---
title: Quality control criteria for genome assemblies
---

Go back to [A framework for quality control](01-qc-framework.md)

Quality control processes for genome assemblies aim to answer "*Does the genome assembly look like an intact genome from the organism I am expecting?*" The criteria Contiguity, Completeness, Contamination, Correctness assess this in different ways. 

The ultimate goal of genome assembly is to reconstruct the original genome sequence, but to do this we have sheared, amplified the DNA and read off short sequences. There are errors introduced at each step. At the time of writing, there is no reliable method of automatically generating a perfect and complete genome sequence. We must make do with what we have, and be able to assess if the genome assembly is 'good enough' for our purposes.

There are many tools available to assess genome assembly quality. We will look at some of the most common ones. 

## Contiguity (Genome assembly)
As mentioned above, we are aiming, but not expecting, a complete single genome (chromosome) sequence. Contiguity measures how contiguous the assembled genome is, the less fragements the better. You can look at metrics like the `N50` and `L50`, which indicate the length of the longest contig and the number of contigs needed to cover a certain percentage of the genome. Higher `N50` and lower `L50` values are generally better. How can we assess contiguity?

* Less contigs, Longer contigs
* N50, average contig length, number of contigs etc.
* Try [QUAST](https://quast.sourceforge.net/quast.html)

!!! tip "What is a contig?"
    A "contig" (short for contiguous sequence) is a set of overlapping DNA segments that together represent a consensus region of DNA. In the context of genome assembly, contigs are created by piecing together shorter sequences, called reads, that have been obtained from sequencing technology.

**Running QUAST on command line**

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

## Completeness (Genome assembly)
Genome completeness refers to the extent to which a sequenced genome accurately represents the full genetic material of an organism. It is a measure of how thoroughly the genome has been sequenced and assembled, reflecting the presence of all expected genes, sequences, and structural elements.You can assess genome completeness by comparing your assembly to a reference genome, if available. You can also assess genomes via the number of essential genes for that organism. How can we assess completeness?

* Compare to reference genome (How to find a reference genome? Start with [web BLAST](https://blast.ncbi.nlm.nih.gov/Blast.cgi))
* Use QUAST to compare to reference genome via different metrics, or align the two genomes and inspect via [Mauve](https://darlinglab.org/mauve/mauve.html) or [Artemis](https://www.sanger.ac.uk/tool/artemis/).
* Assume a genome should have single copy essential genes:
    * [MLST](https://github.com/tseemann/mlst) intact?
    * [BUSCO](https://busco.ezlab.org/) panel
    * [CheckM](https://ecogenomics.github.io/CheckM) panel

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

## Contamination (Genome assembly)
Contamination in genome assembly refers to the presence of extraneous DNA sequences from sources other than the target organism in the final assembled genome. These unwanted sequences can originate from various sources and can significantly compromise the accuracy and reliability of the genome assembly. Some common reasons for contamination in sequencing data include:

* Sample Cross-Contamination
* Contaminated Reagents and Kits
* Environmental Contamination
* Human Contamination
* Cross-Talking in Multiplexed Sequencing
* Lab Equipment Contamination
* Library Preparation and PCR Artifacts
* Sample Mix-Up

We can use Kraken2 in the same way that we used it for sequence reads. 

**Using Kraken2**
Here is some example code to run Kraken2.

```
conda activate my_env 
conda install -y kraken2 
kraken2 du -h -d1 /shared/public/db/kraken2
kraken2 --threads 8 --db /shared/public/db/kraken2/k2_standard_08gb/ --output long.hits.txt --report long.report.txt  --use-names long_assembly.fasta
```

## Correctness (Genome assembly)

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

## BONUS: Circumstantial (Genome assembly)

These are not direct evidence of a good genome, but can be reassuring. Here are some circumstanial evidence of a good genome:

* **GC Content:** Verify that the GC content of your assembly matches the expected GC content for the species. Significant deviations could indicate contamination or assembly errors.
* **Repeat Content:** Assess the presence and handling of specific repetitive elements. High levels of repeats may lead to fragmented assemblies or misassemblies.
* **Quality of Reads:** Examine the quality of the raw sequencing reads to ensure that they are of high quality, with minimal errors or biases.
* **Coverage Depth:** Evaluate the coverage depth across the genome. Uniform coverage indicates a more reliable assembly.
* **Visualization:** Use genome visualization tools like Artemis, IGV, or Tablet to visually inspect the assembly and confirm its quality.

Remember that the quality of your bacterial genome assembly may also depend on the sequencing technology used, the software and parameters employed for assembly, and the quality of the source DNA. Careful evaluation and validation of your assembly are essential for accurate results.


Let's apply these criteria to some sample data in [Practical - Genome assembly QC](/quality-control/50-assembly-qc-exercise). 
