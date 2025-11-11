---
title: Revisting sequence file formats
---

## Revisting sequence file formats
In this session, we will revisit the different file formats used to store sequencing data. We will also discuss the different ways of representing errors or uncertainty in sequencing data.

### Representing nucleotides 
During sequencing, the nucleotide bases in a DNA or RNA sample (library) are determined by the sequencer. For each fragment in the library, a sequence is generated, also called a read, which is simply a succession of nucleotides. The sequence of a read is represented by a string of letters, where each letter represents a nucleotide base. The most common nucleotide bases are adenine (A), cytosine (C), guanine (G), and thymine (T). In RNA, thymine is replaced by uracil (U). 

Sequencing instruments may also give ambiguous signals, which are represented by the letters R, Y, S, W, K, M, B, D, H, V, and N. This convention was set by the International Union of Pure and Applied Chemistry (IUPAC) in 1985. These letters represent the following combinations of nucleotides:

| IUPAC nucleotide code | Base                |
|-----------------------|---------------------|
| A                     | Adenine             |
| C                     | Cytosine            |
| G                     | Guanine             |
| T (or U)              | Thymine (or Uracil) |
| R                     | A or G              |
| Y                     | C or T              |
| S                     | G or C              |
| W                     | A or T              |
| K                     | G or T              |
| M                     | A or C              |
| B                     | C or G or T         |
| D                     | A or G or T         |
| H                     | A or C or T         |
| V                     | A or C or G         |
| N                     | any base            |
| . or -                | gap                 |

> N means the base could not be determined. This is different from a gap, which means the base is not present in the sequence.

Read [Johnson 2010](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2865858/) for more details. 

### Exercise 1: Nucleotides
 
**Convert the following sequences to all possible combinations**

```
ATGRCTAYCGTG
```

```
ATGNATC-GTG
```

**Write psuedocode or a program to check if a sequence is valid according the the IUPAC nucleotide code.**

This is difficult. 

[Answers to exercises](/seq-data/sequence-data-answers)

[Next step: File formats]({{site.baseurl}}/modules/sequencing/file-formats)

[Back to Programme]({{site.baseurl}}/modules/sequencing/week-2-programme/).
