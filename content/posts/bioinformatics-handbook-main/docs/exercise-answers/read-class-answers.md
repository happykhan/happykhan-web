---
title: Answers for read classification
---
Answers for [Practical - Read classification of our sequenced data](/quality-control/10-read-classification)

The easiest way to compare all the samples at once is to look at the "Comparison" tab in Pavian. I increased the number of rows it showed to 100 (by default it showed only 15) and I sorted the taxa by the "Max" column. I also showed both the total raed ccount and proportion as a percentage. Hopefully, you were able to find this view as well. I am showing the results at the Genus level for simplicity but the results do go all the way down to the species level. 

![alt text](/quality-control/img/pavian-answers.png)

![alt text](/quality-control/img/pavian-answers2.png)


**Which species were each sample supposed to be?**

* Sample 1: *E. coli* 
* Sample 2: *Campylobacter coli*
* Sample 3: *Campylobacter coli*

**Are there indiciations of contamination?** 

Yes, for all samples. It's actually really bad for Sample 1 from all three labs - there's hardly any reads at all, and over half of those are assigned as Human! 

Human reads were also detected across the board. 

If you look at samples 3 and 8 at the species level, you will see a minority of reads assigned to other *Campylobacter* species i.e. *C. jejuni*. At the levels we see here, this does not immediately mean cross contamination with a *C. jejuni*. Consider that some genomic regions are shared between many different organisms and it possible that reads maybe falsely assigned. Classification tool can still make these mistakes, even if you used a simulated dataset from a *C. coli* genome of perfect reads.

I should point out that, therefore, we do not expect 100% of reads to be assigned to our expected species. Your threshold will depend on the lab. Generally, I am happy with > 95%, I start with worry with 80-90%, and I start thinking about rejecting the sample if the proportion is < 80%. 

**If there is contamination, what are the top three (in terms of abundance) other species identified?**

* *Homo sapiens*
* *Staphylcoccus*
* *Salmonella*

**For each sample, how many reads were unclassified?**

Just to do something different, I pulled this from the Krona plots. 

![alt text](/quality-control/img/krona-unclass.png)

* Lab 1 - Sample 1: 177
* Lab 1 - Sample 3: 5069 
* Lab 1 - Sample 4: 2132

**Consider the typical genome size for each species, and calculate whether the samples have enough coverage for genome assembly**.

The Pavian Results Overview has all the numbers in one place. *Campylobacter* genomes are about 1.6 megabase pairs, while *E. coli* are around 5 megabase pairs. These were run on an Illumina NextSeq and the average read length is 150 base pairs. 

![alt text](/quality-control/img/pavian-reads.png)

| Sample         | Coverage   |
|----------------|------------|
| Lab-2-Sample-3 | 24.803625  |
| Lab-3-Sample-3 | 34.094625  |
| Lab-1-Sample-3 | 12.1142813 |
| Lab-1-Sample-8 | 20.1844688 |
| Lab-2-Sample-8 | 22.9482188 |
| Lab-3-Sample-8 | 0.89484375 |
| Lab-3-Sample-1 | 4.70415    |
| Lab-1-Sample-1 | 4.38327    |
| Lab-2-Sample-1 | 0          |

Looking at just the genome coverage and thinking about yield. Lab-3-Sample-3 is the only one I would feel OK with. Lab-2-Sample-3, Lab-1-Sample-8, Lab-2-Sample-8 I would be cautious. 

**What are some possible sources of contamination (if any)? You can simply speculate.**

* Cross-contamination between samples on the sample plate. 
* Contamination from lab handling.
* Carry over on the sequencing instrument.
* "Index hopping". 
* Contamination from reagents and kits. 