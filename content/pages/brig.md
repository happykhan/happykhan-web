---
layout: post
title: About BRIG
---

The BLAST Ring Image Generator (BRIG) is a little Java program for
visualizing prokaryote genomes. BRIG is a cross-platform
(Windows/Mac/Unix) application that can display circular comparisons
between a large number of genomes, with a focus on handling draft genome
assembly data.

**The application is freely available
at**: http://sourceforge.net/projects/brig

[Click here to see a wonderful
gallery](%7Cfilename%7C../brig-in-action.rst) of all the figures others
have made with BRIG. If *you* have any questions or comments, post them
on [BRIG's SourceForge page](http://sourceforge.net/projects/brig/).

Features:

  - Images show similarity between a central reference sequence and
    other sequences as concentric rings.
  - BRIG will perform all BLAST comparisons and file parsing
    automatically via a simple GUI.
  - Contig boundaries and read coverage can be displayed for draft
    genomes; customized graphs and annotations can be displayed.
  - Using a user-defined set of genes as input, BRIG can display gene
    presence, absence, truncation or sequence variation in a set of
    complete genomes, draft genomes or even raw, unassembled sequence
    data.
  - BRIG also accepts SAM-formatted read-mapping files enabling genomic
    regions present in unassembled sequence data from multiple samples
    to be compared simultaneously

**Please cite the BRIG paper** if BRIG is used to generate figures for
publications:

  - NF Alikhan, NK Petty, NL Ben Zakour, SA Beatson (2011) [BLAST Ring
    Image Generator (BRIG): simple prokaryote genome
    comparisons](http://www.biomedcentral.com/1471-2164/12/402), *BMC
    Genomics*, 12:402. PMID:
    [21824423](http://www.ncbi.nlm.nih.gov/pubmed/21824423)

With BRIG anyone can make pictures like these in a matter of minutes.
BRIG is [available here](http://brig.sourceforge.net/) under the GPL3
licence. I've written the program to use
[CGView](http://wishart.biology.ualberta.ca/cgview/) for the image
rendering and
[BLAST](http://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=Download)
for the genome comparisons. The source code is available on
[GitHub](https://gith).

![BRIG example output image of a simulated draft E. coli O157:H7 genome.
The figure show BLAST comparisons of 28 other published (E. coli and
Salmonella) genomes against the simulated draft
genome.](%7Cfilename%7C/images/WholeGenomeComparisonBRIG.jpg)

![BRIG image showing the presence, absence and variation of individual
genes from the E. coli O157:H7 str. Sakai Locus of Enterocyte Effacement
(LEE) in related pathogens and E. coli K12, a non-pathogenic strain of
E. coli known to lack the LEE
region.](%7Cfilename%7C/images/ReadsvsVirGenesBRIG.jpg)
