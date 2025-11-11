---
title: Answers for Using tar and gzip
---

[Back to gzip exercise](/unix/using-gzip)

### Exercise 1: Creating files

**Create the some example file, as described above.** 

```bash
grep --help   > grep_help.txt
touch empty_file.txt
echo "This is some text" > sometext.txt
```

**What is `touch`? What does `touch` do if the file already exists?** 

Update the access and modification times of each FILE to the current time.
A FILE argument that does not exist is created empty, unless `-c` or `-h` is supplied.

see `man touch` for more information.

**From the example above, What does the `>` do for the grep output?**

The `>` redirects the standard output of the command to the specified file. `>` will overwrite the location, if the file already exists. `>>` Will append. 

**What does `echo` do?**

Echo the STRING(s) to standard output.

see `man echo` for more information.

**How can you view the contents of these files?**

`cat` is one way to view the contents of a file. `cat` will print the contents of a file to standard output. Try other options like `head`, `less`, `more`, `tail`, `nl`. You can also use a text editor like `vi` or `emacs`.

### Exercise 2: Using `gzip`

**With the information above, and whatever else you can find via the internet, compress the files you created in Exercise 1.**

```bash
gzip grep_help.txt
```

**Now reverse it by decompressing those files**

```bash
gunzip grep_help.txt.gz
```

OR 

```bash
gzip -d grep_help.txt.gz
```

**What is the difference in size of the compressed files and the original files?**

* grep_help.txt:  4042 bytes
* grep_help.txt.gz:  1580 bytes

**Can you compress one of the files while keeping the original (decompressed)?** 

```bash
gzip -k grep_help.txt
```

**What happens to the file extension after compressing with `gzip`?**

The file extension changes from `.txt` to `.txt.gz`. i.e. gz is appended to the end. 

**How can you view the contents of these files?**

```
zcat grep_help.txt.gz
```

**What is the difference between `|` and `>`?**

`|` is a pipe. It redirects the standard output of the command on the left to the standard input of the command on the right. 

`>` redirects the standard output of the command on the left to the specified file. `>` will overwrite the location, if the file already exists. `>>` Will append.

**Can you combine the steps in exercise 1 and 2, to create and compress a file in one step?**

This is difficult. Hint, use piping. 

```bash 
grep --help | gzip -c > grep_help.txt.gz
```

Did you notice that we needed to specify the `-c` flag for `gzip`? This is because `gzip` expects a file as input, not standard input. The `-c` flag tells `gzip` to read from standard input. Did you also notice that we needed to give the full file extension for the output file? This is because `gzip` will not automatically append the `.gz` extension when reading from standard input. Ask Nabil why. 

[Back to gzip exercise](/unix/using-gzip)

## Using tar

Don't forget to ask Arnie:

![Alt text](/unix/img/image-1.png)


### Exercise 3: Using `tar`

**With the information above, and whatever else you can find via the internet, bundle all the files you created in Exercise 1 into a tarball**

```bash
tar -cf my_files.tar grep_help.txt sometext.txt other_file.txt
```

Here's a breakdown of the command and its options:

* `tar`: This is the command itself, used to work with tar archives.
* `-c`: This option stands for "create." It tells tar to create a new archive.
* `-f my_files.tar`: This option is followed by the name of the archive file you want to create. In this case, "my_files.tar" is the name of the archive file.
* `grep_help.txt sometext.txt other_file.txt`: These are the names of the files you want to include in the archive. The tar command will add these three files to "my_files.tar."

You can look inside the archive with `-t`:

```bash
tar -tf my_files.tar 
```

**Now reverse it by extracting those files**

```bash
tar -xf my_files.tar 
```
Here's a breakdown of the command and its options:

* `tar`: This is the command itself, used to work with tar archives.
* `-x`: This option stands for "extract." It tells tar to extract the contents of the specified archive.
* `-f my_files.tar`: This option is followed by the name of the archive file you want to extract. In this case, "my_files.tar" is the name of the archive file from which you want to extract files.

**What is the difference in size of the `tar` file and the sum of the original files?**

* grep_help.txt + sometext.txt: 4060
* my_files.tar: 10240

Why is this? `tar` archives have a minimum size of 10240 bytes by default; see the GNU `tar` manual for details (but this is not GNU-specific). The result will still be bigger than sum of the file size, because file. tar stores metadata about file. Remember, `tar` will bundle files together, not compress them. 

**What is the difference in file name of the output file between directly compressing with `gzip` and using `tar`?**

`tar` will use whatever file name you have specified. It will not add additional file extensions. That is, you can make a `tarball` and not specify .tar as the file extension.

**What is the purpose of the `-v` flag in the `tar` command.**

`-v`: This option stands for "verbose." It instructs tar to operate in verbose mode, which means it will display the names of the files as they are extracted from the archive. It provides feedback about the extraction process.

**Can you combine the steps in exercise 2 and 3, to create an archive and compress it in one step?**

i.e. create a `.tar.gz` file in one step. 

```bash
tar -cvzf my_files.tar.gz grep_help.txt sometext.txt ref.fasta 
```

**Try running `zcat` on this file, what does `zcat` do?**

`zcat` is identical to `gunzip -c`. (On some systems, `zcat` may be installed as `gzcat` to preserve the original link to compress.) `zcat` uncompresses either a list of files on the command line or its standard input and writes the uncompressed data on standard output. `zcat` will uncompress files that have the correct magic number whether they have a .gz suffix or not.

This is what I see for the file I created:

```
jovyanusers>KJ802404.1 Escherichia coli isolate GN568 plasmid pNDM-EcoGN568, complete
 sequence
ATGGACCACCAGCTAGAAAGTATCGACGGAACAATCATGAGCAAGAGAACCAAAGACAAAGACCTGGAGA
AACTCGACGTAATCAAAGACTCACCGCAAATGAGCCTGTTTGAGATCATTGAATCTCCGGCCAAGAAAGA
CGACTACTCCAACACCATCGAGATCTACGATGCGCTGCCGAAGTACATTTGGGACCAAAAGCGTGAGCAT
GAAGATTTATCCAACGCTGTAGTGACACGACAATGCACCATCAGAGGCCAGCATTTCACGGTGAAGGTGA
AGCCAGCCATCATCGAGAAGGATGACGGAAGAACCGTGCTGATCTACGCGGGACAGCGAGAGGAAATCCT
TGAGGATGCTCTACGCAAGCTCGCAGTGAACGGGAAAGGCCATATCATCGAGGGCAAGGCTGGAGTCATG
TTCACTCTGTACGAACTCCAGAAAGAGCTCTCGAAGATGGGTCACGGTTACAACCTGAACGAAATCAAGG
AAGCAATCCAGGTTTGTCGTGGCGCAACACTCGAATGTATCAGTGATGACGGCGAAGCCTTCATCAGCTC
```

[Back to gzip exercise](/unix/using-gzip)

