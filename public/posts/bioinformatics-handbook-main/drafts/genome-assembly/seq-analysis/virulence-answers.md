---
layout: page
---

# Answers to Detecting virulence factors

## Theory questions

**What is the difference between the contents of the VFDB and CARD databases**

* VFDB primarily focuses on virulence factors, which are molecules or traits possessed by pathogens that enable them to cause disease in their hosts. 
* CARD is primarily focused on antibiotic resistance, which is the ability of microorganisms to resist the effects of antimicrobial agents (antibiotics).

**What does FimTyper base its typing on? Why is this useful to know?**

FimTyper is based on identifying and characterizing specific fimbrial or pilus gene clusters in bacterial genomes. These gene clusters are responsible for the production of fimbrial or pilus structures. Fimbriae and pili play a crucial role in the pathogenicity and virulence of many bacteria. Different types of fimbriae can be associated with different levels of adhesion to host cells or specific tissues, leading to variations in virulence. Identifying the fimbrial or pilus type helps in understanding the pathogenic potential of a bacterial strain.


**What does PlasmidFinder base its typing on? Why is this useful to know?**

PlasmidFinder is based on identifying specific replicon sequences or replicon types associated with plasmids. A replicon is a DNA sequence within a plasmid that is responsible for plasmid replication. PlasmidFinder uses a reference database of known replicon sequences to compare with the genomic data of the bacterium under investigation. It matches the genomic sequences to the reference replicons to determine the plasmid type.

* Plasmids often carry antibiotic resistance genes, which can be transferred between bacteria
* Plasmids can also carry virulence factors, which can be transferred between bacteria
* Plasmids of the same incompatibility group are unable to coexist in the same bacterium. Understanding incompatibility groups can shed light on plasmid coexistence and competition.


**What is a prophage?**

A prophage is a term used in virology and microbiology to describe a phage (bacteriophage or bacterial virus) genome that has become integrated into the DNA of a bacterial host. Prophages are dormant or latent forms of phages, and they are essentially viral DNA that resides within the genome of the host bacterium. 

## Practical questions 

_If the number of different tools presented here are overwhelming, try to focus on using `abricate` and work through the questions below_

**Try running your chosen sequence through `abricate` with the different databases.**

**Can you locate the `abricate` results in `Artemis`?**

**Refer back to the automated annotation we made using `prokka` - Does this annotation agree with the `abricate` results?**

**How many prophages are predicted in the [PHASTER example](https://phaster.ca/submissions/NC_000913)**

**Try at least three of the other suggested tools. What can you find?**


[Back to Detecting virulence factors]({{site.baseurl}}/modules/sequence-analysis/virulence)


[Back to Programme]({{site.baseurl}}/modules/sequence-analysis/programme/).