---
layout: page
---
Answers to the questions in the [Revisting sequence file formats]({{site.baseurl}}/modules/sequencing/sequence-data/).

**Convert the following sequences to all possible combinations**

```
ATGRCTAYCGTG
```

* ATGACTACCGTG
* ATGGCTACCGTG
* ATGACTATCGTG
* ATGGCTATCGTG

```
ATGNATC-GTG
```

* ATGAATC-GTG
* ATGTATC-GTG
* ATGGATC-GTG
* ATGCATC-GTG


**Write psuedocode or a program to check if a sequence is valid according the the IUPAC nucleotide code.**

A psuedocode solution:

```
sequence = "ATGRCXTAYCGTG"
true_count = 0
For each character in the sequence:
    For each base in ATGCNACGTURYSWKMBDHVN
        If character == base:
            true_count add 1

If true_count == length of sequence:
    return True
Else:
    return False
```

N.B Pseudocode is a way to describe the logical steps a computer program should take without getting into the specifics of a particular programming language. It's a high-level description of the algorithm or logic you want to implement. Pseudocode uses plain language and simple structures to outline the sequence of operations and decisions in a program.

A Python solution using regular expressions:

```python
import re

def is_valid_nucleotide_sequence(sequence):
    pattern = r'^[ATGCNACGTURYSWKMBDHVN]*$'
    return bool(re.match(pattern, sequence))

# Example usage:
sequence = "ATGRCXTAYCGTG"
if is_valid_nucleotide_sequence(sequence):
    print("The sequence is valid.")
else:
    print("The sequence contains invalid characters.")
```


![Relevant xkcd](image.png)