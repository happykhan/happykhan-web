---
layout: page
---


**Assemble the genome of our novel pathogen using short reads only** 

If you have a problem with this process. Here are some results I prepared earlier. 

* [contigs.fa](/seq-analysis/contigs.fa)
* [contigs.gfa](/seq-analysis/contigs.gfa)
* [shovill.corrections](/seq-analysis/shovill.corrections)
* [shovill.log](/seq-analysis/shovill.log)


**Assemble the genome of  our novel pathogen using both long and short reads (as a hybrid assembly)**

If you had a problem with generating an assembly with Unicycler. Here are some results I prepared earlier. 

* [long_assembly.fasta](/seq-analysis/long_assembly.fasta)
* [long_assembly.gfa](/seq-analysis/long_assembly.gfa)
* [unicycler.log](/seq-analysis/unicycler.log)



_We will compare the results of these assemblies in the next exercise_

**Define "Read 1" and "Read 2" in the context of paired-end sequencing. What is the direction of extension for each?**

Read 1 (Forward Read):

* Read 1 is often referred to as the "forward read."
* It extends from the "Read 1 Adapter" in the 5' to 3' direction.
* In paired-end sequencing, it represents the sequence information obtained from one end of the DNA fragment.
* The extension direction of Read 1 is along the forward DNA strand, meaning it reads the DNA sequence starting from the 5' end and extending towards the 3' end of the DNA fragment.

Read 2 (Reverse Read):

* Read 2 is often referred to as the "reverse read."
* It extends from the "Read 2 Adapter" in the 5' to 3' direction.
* In paired-end sequencing, it represents the sequence information obtained from the other end of the same DNA fragment as Read 1.
* The extension direction of Read 2 is along the reverse DNA strand, meaning it reads the DNA sequence starting from the 5' end and extending towards the 3' end of the DNA fragment, which is opposite to the direction of Read 1.

**Explain the term "homopolymers" and why they are difficult to read accurately in sequencing.**

Homopolymers are sequences of DNA or RNA in which the same nucleotide is repeated consecutively multiple times. For example, a stretch of adenine (A) bases or thymine (T) bases repeated multiple times would be considered a homopolymer. Homopolymers are common in genomic sequences and can range in length from a few bases to many hundreds of bases.

Homopolymers can be challenging to read accurately in sequencing for several reasons:

* **Signal Interference**: During sequencing, the detection of individual nucleotides is based on signals from the incorporation of fluorescently labeled nucleotides. In homopolymeric regions, where the same nucleotide repeats, it can be difficult for the sequencing instrument to accurately distinguish between each incorporation event. This can result in overlapping or ambiguous signals, making it challenging to determine the exact number of repeated nucleotides.

* **Phasing Errors**: In the presence of homopolymers, the sequencing instrument can experience "phasing errors." Phasing errors occur when the signal from one nucleotide carries over into the signal for the next nucleotide in the homopolymer sequence. This can lead to inaccuracies in base calling and result in incorrect base assignments.


**Why is it important for read lengths to span repeated sequences in the genome during assembly?**

It's important for read lengths to span repeated sequences in the genome during assembly for reasons such as :

* **Resolution of Repeats**: Repeated sequences are segments of DNA that occur more than once in the genome. When read lengths span these repeats, it becomes possible to accurately distinguish between different instances of the repeat. Short reads that do not span the full length of the repeat can lead to incorrect assembly by merging different copies of the repeat into a single contig, resulting in a fragmented and inaccurate genome assembly.

* **Chimera Prevention**: Failure to span repeated sequences can result in chimeric assemblies. A chimeric assembly occurs when sequences from different regions of the genome are incorrectly joined together. Longer reads that traverse the entire length of a repeat help prevent these errors, ensuring that the sequences are correctly separated and assembled.


**What issues do some sequencing platforms encounter when dealing with GC-rich or AT-rich DNA sequences?**

Regions that are AT-rich or GC-rich are similarly difficult because they respond poorly to the amplification protocols required by some platforms. Palindromic sequences or hairpin structures are difficult to denature, making such regions challenging for sequencing tools that include a denaturation step.

[Back to Programme]({{site.baseurl}}/modules/sequence-analysis/programme/).