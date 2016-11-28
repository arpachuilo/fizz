# Clustering for Fizz
These scripts carry out the clustering for our cocktails

#### Setup
Warning: this might not go so easily on windows
1. Get Python 2.7
2. Install (kmodes)[https://github.com/nicodv/kmodes]
  * `pip install kmodes`
3. Install unidecode
  * `pip install unidecode`
4. Install lxml
  * `pip install lxml`

### Usage
1. Run `python crawl.py`
2. Run `python convert.py [FILENAME.json]`
3. Remove header from [FILENAME.json]
4. Run `python cluster.py [FILENAME.json] [CLUSTER_COUNT]`

NOTE: Some hand cleaning had to be done . . .
