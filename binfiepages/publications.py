import csv 
from collections import OrderedDict

all_papers = {'2017 and prior': []} 
for record in csv.DictReader(open('binfiepages/publications', encoding='utf-8'), dialect=csv.excel_tab):
    if record['skip'].upper() != 'YES':
        if record['preprint'].lower() == 'yes' or record['Publication'] in ['bioRxiv', 'medRxiv', 'preprints']:
            if all_papers.get('preprints'):
                all_papers['preprints'].append(record)
            else:
                all_papers['preprints'] = [record]
        else:
            try:
                if int(record['Year']) <= 2017:
                    all_papers['2017 and prior'].append(record)
                else:
                    if all_papers.get(record['Year']):
                        all_papers[record['Year']].append(record)
                    else:
                        all_papers[record['Year']] = [record] 
            except ValueError:
                print('Year is no good for ' + str(record))
            

output_file = open('content/pages/publications/index.mdx', 'w', encoding='utf-8')
output_file.write('---\n')
output_file.write('title: Publications\n')
output_file.write('slug: "/publications"\n')
output_file.write('---\n')

output_file.write('Here are all my publications. Click the title for a PDF download. Click the DOI link to go to the online version.\n')
output_file.write('See [my Google scholar](https://scholar.google.com/citations?hl=en&user=BpzrleYAAAAJ&view_op=list_works) for latest list\n')

if len(all_papers['preprints']) > 0:
    output_file.write('\n### Preprints\n')
    for pre in sorted(all_papers['preprints'], key=lambda k: k['Year'], reverse=True): 
        first_author = pre['Authors'].split(',')[0]
        if pre['pdfname']:
            title_pdf = f"[{pre['Title']}](/papers/{pre['pdfname']})"
        else:
            title_pdf = pre['Title']
        pub = pre['Publication']
        year = pre['Year']
        doi = pre['doi']
        output_file.write(f'- {first_author} et al. {title_pdf}. {pub} {year}')
        if doi:
            output_file.write(f' {doi}')
        output_file.write('\n')

output_file.write('\n### Peer reviewed publications\n')
for year, yearlist in sorted(all_papers.items(), reverse=True):
    if year != 'preprints':
        output_file.write(f'\n#### {year}\n')
        for pre in sorted(yearlist, key=lambda k: k['Year'], reverse=True): 
            first_author = pre['Authors'].split(',')[0]
            if pre['pdfname']:
                title_pdf = f"[{pre['Title']}](/papers/{pre['pdfname']})"
            else:
                title_pdf = pre['Title']
            pub = pre['Publication']
            year = pre['Year']
            doi = pre['doi']
            output_file.write(f'- {first_author} et al. {title_pdf}. {pub} {year}')
            if doi:
                output_file.write(f' {doi}')
            output_file.write('\n')

output_file.close()