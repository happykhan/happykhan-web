---
title: Practical - Quality control for long reads
---

In case of long reads, we can check sequence quality with [Nanoplot](https://github.com/wdecoster/NanoPlot/). It provides basic statistics with nice plots for a fast quality control overview.

**What is this data?**
PacBio HiFi reads were provided by [PacBio - GIAB sample HG002](https://www.pacb.com/smrt-science/smrt-resources/datasets/) and was downsampled using [seqtk](https://github.com/lh3/seqtk). This is whole genome shotgun sequencing of human DNA.


**If you are not using a CLIMB-BIG-DATA notebook, you will need to download the data.**
```
wget -O m64011_190830_220126.Q20.subsample.fastq.gz https://zenodo.org/records/5730295/files/m64011_190830_220126.Q20.subsample.fastq.gz?download=1
```

### Exercise 1: Run Nanoplot and FASTQC

```
NanoPlot --fastq m64011_190830_220126.Q20.subsample.fastq.gz  --plots  kde hex  dot --N50
```

**What do each of the parameters (of the command above) mean?**

**Inspect the generated HTML file**

**What is the median read quality, mean read quality and read N50?**

**Looking at "Read lengths vs Average read quality plot using dots plot". Did you notice something unusual with the Qscore? Can you explain it?** 

**Repeat this with FASTQC**

[Answers](/seq-data/long-read-qc-answers) to these questions are available.

### Citation

Some of this material was adapted from:

* Bérénice Batut, Maria Doyle, Alexandre Cormier, Anthony Bretaudeau, Laura Leroi, Erwan Corre, Stéphanie Robin, Erasmus+ Programme, Cameron Hyde, Quality Control (Galaxy Training Materials). https://training.galaxyproject.org/training-material/topics/sequence-analysis/tutorials/quality-control/tutorial.html Online; accessed Wed Oct 18 2023
* Hiltemann, Saskia, Rasche, Helena et al., 2023 Galaxy Training: A Powerful Framework for Teaching! PLOS Computational Biology 10.1371/journal.pcbi.1010752
