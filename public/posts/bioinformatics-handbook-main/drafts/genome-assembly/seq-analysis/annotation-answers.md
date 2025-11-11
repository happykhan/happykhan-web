---
layout: page
---

# Answers to Genome browsers and annotation

[Back to Genome browsers and annotation]({{site.baseurl}}/modules/sequence-analysis/anotation/).

# Exercise 1: Genome annotation

## Theory questions

#### What does CDS stand for?

CDS stands for "Coding Sequence." It refers to the part of a gene that contains the information needed to produce a functional protein or functional RNA molecule. In the context of genomics and molecular biology, the coding sequence is the region of a gene that is transcribed and translated into the final protein product or a functional non-coding RNA. The CDS includes the start codon, the coding region that specifies the amino acid sequence of the protein, and the stop codon that signals the termination of translation.

#### What approaches you can use to guide gene annotation?

There are several approaches and sources of information that you can use to guide gene annotation (for a bacterial genome):

* **Homology-Based Approaches**:
   * **Sequence Similarity**: Compare the genome of interest with well-annotated reference genomes to identify homologous genes. Tools like `BLAST` and `HMMER` can be used for sequence similarity searches.
   * **Orthology**: Identify orthologous genes by finding genes in the target genome that share a common ancestor with known genes in other species. Orthology can provide functional insights.

* **Experimental Data**:
   * **RNA-Seq Data**: Use RNA-Seq experiments to identify transcribed regions and infer the presence of genes. This data can help determine exon-intron boundaries and transcript structures.
   * **Proteomics Data**: Mass spectrometry and proteomics data can help confirm the presence and expression of proteins, guiding gene annotation.
   * **Functional Assays**: Experimental data on gene function, such as knockout studies, can directly inform the annotation of genes.

* **Ab Initio Predictions**:
   * **Gene Prediction Software**: Utilize computational tools and algorithms (e.g., GeneMark, Augustus, Glimmer) to predict genes based on sequence features, such as open reading frames (ORFs), splice sites, and promoter regions. These predictions serve as a starting point for annotation.

* **Functional Annotation**:
   - **Functional Domains**: Identify known functional domains within proteins using databases like `Pfam` or `InterPro`. These domains can provide clues about the function of unannotated genes.
   - **Gene Ontology (GO) Terms**: Assign Gene Ontology terms to genes based on their predicted or known functions. GO terms describe gene product properties and are useful for functional annotation.

Combining multiple approaches and data sources is often the most effective way to achieve accurate and comprehensive gene annotation.

#### What file formats can you use to save your genome annotations?

Genome annotations can be saved in various file formats that are widely recognized and compatible with different bioinformatics and genomics tools. The choice of file format may depend on the specific application, tools, and databases you plan to use. Here are some common file formats for saving genome annotations:

* **GFF (General Feature Format)**: GFF and GTF (General Transfer Format) are text-based formats used to represent genomic features, including genes, transcripts, exons, and more. They are widely accepted in genomics and can include detailed annotations.
* **GenBank**: Developed by the National Center for Biotechnology Information (NCBI), GenBank format is commonly used for storing sequences and associated annotations. GenBank files often include detailed information about genes, proteins, and other genomic features.
* **EMBL (European Molecular Biology Laboratory)**: EMBL format is similar to GenBank and is used for storing sequence data along with annotations.
* **FASTA with Feature Tables**: A standard FASTA sequence file can include an associated feature table or annotation file that describes the genomic features present in the sequences.

#### Why do we focus on putative genes longer than 50 codons?

There are many reasons, here are two I could think of: 

* Applying a minimum length threshold helps reduce the chances of identifying spurious ORFs. Short ORFs may occur by chance in genomic sequences due to the presence of stop codons and start codons within non-coding regions. Longer ORFs are more likely to be statistically significant.
* Longer genes are more likely to encode functional proteins or functional non-coding RNAs. In many organisms, short open reading frames (ORFs) may not produce biologically relevant proteins or functional RNAs. A minimum length threshold, like 50 codons, is often applied to prioritize the identification of genes with the potential for a significant biological role.

## Practical questions

#### Open the chosen sequence in Artemis and spend some time marking genes you think are valid. Try to do at least 5.

#### How do your gene predictions compare to an automated tool? (use `orffinder`)

#### Use the web based tools to try to assign a function to the genes you have predicted.

#### Try installing `prodigal` and running it on your sequence.

[Back to Programme]({{site.baseurl}}/modules/sequence-analysis/programme/).
