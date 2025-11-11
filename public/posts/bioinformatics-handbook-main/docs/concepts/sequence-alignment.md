---
title: Local vs global alignment 
---

The Smith-Waterman and Needleman-Wunsch algorithms are both used for sequence alignment in bioinformatics, specifically for comparing and aligning sequences of amino acids or nucleotides (e.g., protein or DNA sequences). While they serve a similar purpose, there are key differences between the two algorithms.

**Smith-Waterman:** This algorithm is used for *local sequence alignment*. It aims to find the best alignment of subsequences within the input sequences. It is ideal for identifying regions of similarity or homology between sequences, allowing for gaps and mismatches within the alignment.

**Needleman-Wunsch:** This algorithm is used for *global sequence alignment*. It finds the best alignment of the entire input sequences, extending from the beginning to the end. Needleman-Wunsch is used when you want to compare entire sequences and ensure that all positions are considered, even if it means introducing gaps.

### Scoring and Penalties

**Smith-Waterman:** In local alignment, Smith-Waterman uses a scoring system that assigns positive scores for matches and negative scores for mismatches and gap penalties. This allows for flexible alignments that might include gaps and mismatches while maximizing the similarity of aligned regions.

**Needleman-Wunsch:** In global alignment, Needleman-Wunsch also uses a scoring system for matches and mismatches but typically employs a gap penalty that discourages the introduction of gaps. This results in a global alignment that attempts to minimize gaps across the entire sequences.

### Purpose

**Smith-Waterman:** This algorithm is often used when you want to identify local regions of similarity or find local homologies within sequences. For example, it is useful for identifying conserved domains or functional motifs in proteins.

**Needleman-Wunsch:** This algorithm is employed when you want to perform a global comparison of entire sequences. It is useful for determining the overall similarity between sequences and finding evolutionary relationships.

## What is BLOSUM 

BLOSUM stands for "BLOcks SUbstitution Matrix," and it is a term commonly used in the field of bioinformatics and computational biology. BLOSUM matrices are used in sequence alignment, a fundamental task in bioinformatics, to assess the similarity between two sequences of amino acids or nucleotides, typically for protein or DNA sequence comparisons.

The BLOSUM matrices are used to calculate a score for aligning two sequences based on the observed frequencies of substitutions between different amino acids or nucleotides within a set of related sequences, often referred to as a "block" or a "family" of sequences. These matrices help determine the likelihood of specific substitutions occurring between amino acids or nucleotides within related sequences.
