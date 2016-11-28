from lxml import html
from unidecode import unidecode
import json
import re
import requests

baseUrl = 'https://en.wikipedia.org'

def hasNumbers(inputString):
    return any(char.isdigit() for char in inputString)

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

def extract(url):
    page = requests.get(baseUrl + url)
    tree = html.fromstring(page.content)

    cocktail = {}

    # Store link
    cocktail['link'] = unidecode(baseUrl + url)

    # Store title
    cocktail['title'] = unidecode(tree.xpath('//*[@id="firstHeading"]/text()')[0]).replace(' (cocktail)', '')

    # Store picture
    # NOTE: Not all have images . . . also some are trickier to get
    pictureUrl = tree.xpath('//*[@id="mw-content-text"]/table[1]/tr[2]/td/a/img/@src')
    if len(pictureUrl) == 0:
        pictureUrl = tree.xpath('//*[@id="mw-content-text"]/table[2]/tr[2]/td/a/img/@src')
        print pictureUrl
    cocktail['picture'] = pictureUrl[0] if len(pictureUrl) > 0 else ''

    # Store drinkware
    cocktail['drinkware'] = unidecode(tree.xpath('normalize-space(//th[contains(., "drinkware")]/following-sibling::td)'))

    # Store served
    cocktail['served'] = unidecode(tree.xpath('normalize-space(//th[contains(., "Served")]/following-sibling::td)'))

    # Store directions
    cocktail['directions'] = unidecode(tree.xpath('normalize-space(//th[contains(., "Preparation")]/following-sibling::td)'))

    # Store ingredients
    # NOTE: This does make some assumptions about the dirty format of the data
    cocktail['ingredients'] = []
    for e in tree.xpath('//th[contains(., "ingredients")]/following-sibling::td/ul/descendant::li'):
        iString = "".join(e.xpath('descendant-or-self::text()'))
        splitString = iString.split(' ')
        splitString = [unidecode(s) for s in splitString]
        splitString = [s for s in splitString if '(' not in s and ')' not in s]

        ingredient = {}
        ingredient['ingredient'] = ''
        ingredient['amount'] = ''
        ingredient['unit'] = ''
        if is_number(splitString[0]):
            ingredient['amount'] = splitString[0]
            ingredient['unit'] = splitString[1]
            ingredient['ingredient'] = ' '.join(splitString[2:])
        else:
            ingredient['ingredient'] = ' '.join(splitString)

        cocktail['ingredients'].append(ingredient)
    return cocktail


# Grab base page
page = requests.get(baseUrl + '/wiki/List_of_IBA_official_cocktails')
tree = html.fromstring(page.content)

# Grab drink hrefs
cocktailUrls = tree.xpath('//*[@id="mw-content-text"]/div[4]/ul/descendant::*/@href')
cocktailUrls.extend(tree.xpath('//*[@id="mw-content-text"]/div[6]/ul/descendant::*/@href'))
cocktailUrls.extend(tree.xpath('//*[@id="mw-content-text"]/div[8]/ul/descendant::*/@href'))


# Extract cocktail information
cocktails = []
for fragment in cocktailUrls:
    cocktails.append(extract(fragment))

# Dump to json file
with open('test.json', 'w') as outfile:
    json.dump(cocktails, outfile, indent=4, sort_keys=True)
