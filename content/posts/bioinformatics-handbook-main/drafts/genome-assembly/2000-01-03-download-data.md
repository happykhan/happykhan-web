---
title: Preparing our data and environment
---


# Downloading simulated data 

*Reads are available at [https://zenodo.org/records/10018484](https://zenodo.org/records/10018484)*

You can directly download them with `wget` or similar. 

```
wget -O novel-pathogen-long-reads.v3.fastq.gz https://zenodo.org/records/10018484/files/novel-pathogen-long-reads.v3.fastq.gz?download=1
wget -O novel-pathogen_R1.fastq.gz https://zenodo.org/records/10018484/files/novel-pathogen_R1.fastq.gz?download=1
wget -O novel-pathogen_R2.fastq.gz https://zenodo.org/records/10018484/files/novel-pathogen_R2.fastq.gz?download=1
```

The files are compressed (.gz) FASTQ files. There are three files: 

* Short read R1 - [novel-pathogen_R1.fastq.gz](https://zenodo.org/records/10018484/files/novel-pathogen_R1.fastq.gz?download=1)
* Short read R2 - [novel-pathogen_R2.fastq.gz](https://zenodo.org/records/10018484/files/novel-pathogen_R2.fastq.gz?download=1) 
* Long reads - [novel-pathogen-long-reads.fastq.gz](https://zenodo.org/records/10018484/files/novel-pathogen-long-reads.v3.fastq.gz?download=1)


### Reminder: What is FASTQ

FASTQ format is a text-based format for storing both a biological sequence (usually nucleotide sequence) and its corresponding quality scores. Both the sequence letter and quality score are each encoded with a single ASCII character for brevity.

It was originally developed at the Wellcome Trust Sanger Institute to bundle a FASTA formatted sequence and its quality data, but has become the de facto standard for storing the output of high-throughput sequencing instruments.

### Reminder: What is `gzip` 

A GZ file is an archive file compressed by the standard GNU zip (gzip) compression algorithm. It typically contains a single compressed file but may also store multiple compressed files. gzip is primarily used on Unix operating systems for file compression.

[Back to Programme]({{site.baseurl}}/modules/sequence-analysis/programme/).


# Check environment, software, and tools ready for later exercises

We recommend installing command-line bioinformatics software through the package manager `conda`.

> If you are using a CLIMB-BIG-DATA notebook, this is already installed for you. You can skip this step.

`Conda` is an open source package management system and environment management system that runs on Windows, macOS, Linux and z/OS. `Conda` quickly installs, runs and updates packages and their dependencies. `Conda` easily creates, saves, loads and switches between environments on your local computer. It was created for `Python` programs, but it can package and distribute software for any language.

* The installation instructions for [macOSX can be found here](https://docs.conda.io/projects/conda/en/latest/user-guide/install/macos.html)
* The installation instructions for [Linux can be found here](https://docs.conda.io/projects/conda/en/latest/user-guide/install/linux.html)

Andrea has an extended guide here: [https://telatin.github.io/microbiome-bioinformatics/Install-Miniconda/](https://telatin.github.io/microbiome-bioinformatics/Install-Miniconda/). 

### Switching to `mamba` 

Conda has recently integrated a faster "solver" called `mamba`. You can enjoy the faster install times by setting `mamba` as the default solver. As shown below.

```
conda update -n base conda
conda install -n base conda-libmamba-solver
conda config --set solver libmamba
```

You need `conda` version 22.11 and above for this to work. 

###### In this course, you should use conda or containers (from week one) to manage your software

### Install the software for week 3 
Week three will need certain software, please install these packages for week for via conda/mamba. 

```
conda create -n week3 -c bioconda -c conda-forge prokka unicycler shovill
```

### Installing Artemis, Bandage and Mauve 

`Artemis`, `bandage` and `mauve` are software with a graphical interface you **should run on your local computer**. Follow the instructions at:

* [https://rrwick.github.io/Bandage/](https://rrwick.github.io/Bandage/)
* [https://darlinglab.org/mauve/user-guide/viewer.html](https://darlinglab.org/mauve/user-guide/viewer.html)
* [https://www.sanger.ac.uk/tool/artemis/](https://www.sanger.ac.uk/tool/artemis/)

## The following are tips and examples to help you complete the tasks above 

### Installing software via conda (shovill)
This an example of how to install `shovill` in it's own environment. This is an example if you are not clear on the syntax. If the tools above are working, you should be fine for further exercises. 

```
conda create -n shovill shovill -y -c bioconda
conda activate shovill
```

You can install more programs in a single environment, as below:
```
conda create -n myproject shovill samtools -y -c bioconda
conda activate myproject
```

You can add more software to an existing environment, as below:
```
conda activate myproject 
conda install blast -y 
```

### Tips on organising your projects long term

A quick aside, "how should I organise my projects?" in the long term. 

* Use `conda` for package management (https://docs.conda.io/en/latest/)
* `Jupyter` notebooks (offered via CLIMB-BIG-DATA but freely available for you to install on your own machine) for exploring data and plotting figures (https://jupyter.org/)

For Processing large datasets

* Use workflow languages (`nextflow`)
* [Bactopia](https://bactopia.github.io/) is a good all-included workflow to start


# Exercise 1: Preparing our data and installing our software 

*Data are available at [https://zenodo.org/records/10018484](https://zenodo.org/records/10018484)*

**Check that you have your own copy of the data for the mystery novel pathogen we will explore this week.** 

You can copy the data from `~/shared-team` or download it from Zenodo.

**Check that you have your own copy of the `additional_genomes_for_qc.zip` file.** 

You can copy the data from `~/shared-team` or download it from Zenodo.

**Check you can run each of the required software (try running each command with the help flag), if not install via conda** 

You may need to locate external instructions on installing these software packages e.g. via their github pages. Required software for you CLIMB-BIG-DATA notebook:

* `prokka` 
* `unicycler` 
* `shovill`
* `mlst`
* `quast`
* `abricate`
* `prodigal`
* `kraken2`
* `busco`

**Install graphical software on your local machine**

`Artemis`, `bandage` and `mauve` are software with a graphical interface you **should run on your local computer**. Follow the instructions at:

* [https://rrwick.github.io/Bandage/](https://rrwick.github.io/Bandage/)
* [https://darlinglab.org/mauve/user-guide/viewer.html](https://darlinglab.org/mauve/user-guide/viewer.html)
* [https://www.sanger.ac.uk/tool/artemis/](https://www.sanger.ac.uk/tool/artemis/)

_The information above will help you with all of these tasks, read it carefully. Check with the instructor if you are unsure._ 



[Back to Programme]({{site.baseurl}}/modules/sequence-analysis/programme/).