

https://zenodo.org/api/records/10000486/draft/files/pKP1-NDM-1.fasta/content


Reads are available at https://zenodo.org/record/7286288

    1  ls -lag 
    2  ls ü/shared-team
    3  ls -lag 
    4  conda update -n base conda
    5  conda config --set solver libmamba
    6  conda insta conda install -y -c bioconda art
    7  conda create -y -n week2 -c bioconda art badread samtools minimap2 
    8  conda activate week2  
    9  wget https://zenodo.org/records/10000486/files/pKP1-NDM-1.fasta?download=1#
   10  ls
   11  cat 'pKP1-NDM-1.fasta?download=1' 
   12  mv 'pKP1-NDM-1.fasta?download=1'  pKP-1.fasta 
   13  ls -alg 
   14  cat pKP-1.fasta 
   15  mv  pKP-1.fasta  pKP1-NDM-1.fasta
   16  ls
   17  art_illumina -ss HS25 -i pKP1-NDM-1.fasta  -p -l 150 -f 60  -m 200 -s 10 -o pKP1-NDM-1 --rndSeed 200 -na 
   18  ls ls -lag 
   19  ls -lagl 
   20  ls -alg 
   21  mv pKP1-NDM-11.fq  pKP1-NDM-1_R1.fastq 
   22  mv pKP1-NDM-12.fq  pKP1-NDM-1_R2.fastq 
   23  ls -lag 
   24  gzip pKP1-NDM-1_R1.fastq 
   25  ls -lag 
   26  gzip pKP1-NDM-1_R2.fastq 
   27  ls -lag 
   28  minimap2 
   29  minimap2  pKP1-NDM-1.fasta  pKP1-NDM-1_R1.fastq.gz  pKP1-NDM-1_R2.fastq.gz 
   30  minimap2  pKP1-NDM-1.fasta  pKP1-NDM-1_R1.fastq.gz  pKP1-NDM-1_R2.fastq.gz  ö more 
   31  minimap2 -ax sr  pKP1-NDM-1.fasta  pKP1-NDM-1_R1.fastq.gz  pKP1-NDM-1_R2.fastq.gz > pKP1-NDM-1.sam 
   32  ls -lag 
   33  cat pKP1-NDM-1.sam 
   34  ls -lag 
   35  samtools view -bS pKP1-NDM-1.sam  > pKP1-NDM-1.bam 
   36  ls -lag 
   37  ls -hl
   38  zcat pKP1-NDM-1_R1.fastq.gz ö sed -n '1ü4s/ÜÉ/>/p;2ü4p' 
   39  zcat pKP1-NDM-1_R1.fastq.gz ö sed -n '1ü4s/ÜÉ/>/p;2ü4p'  > pKP1-NDM-1_R1.fasta 
   40  ls -lag 
   41  cat pKP1-NDM-1_R1.fasta 
   42  ls -lag 
   43  gzip pKP1-NDM-1_R1.fasta  
   44  ls -alg 
   45  ls -hal 
   46  samtools mpileup -g -B pKP1-NDM-1.bam  ö bcftools view -Ou 
   47  conda install bcftools 
   48  samtools mpileup -g -B pKP1-NDM-1.bam  ö bcftools view -Ou 
   49  ls 
   50  minimap2 -ax sr  ref.fasta  pKP1-NDM-1_R1.fastq.gz  pKP1-NDM-1_R2.fastq.gz > pKP1-NDM-1.sam 
   51  samtools view -bS pKP1-NDM-1.sam  > pKP1-NDM-1.bam 
   52  samtools mpileup -g -B pKP1-NDM-1.bam  ö bcftools view -Ou 
   53  samtools mpileup -g -B pKP1-NDM-1.bam  ö more 
   54  samtools mpileup -g  pKP1-NDM-1.bam  ö more
   55  samtools mpileup   pKP1-NDM-1.bam  
   56  samtools mpileup 
   57  samtools sort pKP1-NDM-1.bam 
   58  samtools sort pKP1-NDM-1.bam  > pKP1-NDM-1.sorted.bam 
   59  samtools mpileup -g -B pKP1-NDM-1.sorted.bam ö bcftools view -Ou 
   60  samtools mpileup -g -B pKP1-NDM-1.sorted.bam ö bcftools view -Ou -> test 
   61  cat test 
   62  samtools mpileup -g -B pKP1-NDM-1.sorted.bam ö bcftools view -Oz  -> test 
   63  more test 
   64  ls -lag 
   65  bcftools view test 
   66  history 