#!python2

# May need to 'chmod +x' this file
# Takes filename as first arguement

# Snippet to convert recipe JSON to CSV
import json
import csv
import sys

# Load recipe data
with open(sys.argv[1]) as json_data:
    jsonData = json.load(json_data)

# Mangle into new 2d array
csvData = []
csvData.append([])

# Create title header, cocktail glass, and served
csvData[0].append('title')
csvData[0].append('drinkware')
csvData[0].append('served')

# Loop over ingredients to create ingredient headers
for recipe in jsonData:
    for ingObj in recipe['ingredients']:
        # NOTE: Stripping commas just in case as well
        if ((str(ingObj['ingredient']).replace(',', '').lower() not in csvData[0])):
            csvData[0].append(str(ingObj['ingredient']).replace(',', '').lower())

# Second loop to establish each recipe row
for index, recipe in enumerate(jsonData):
    # Create array for recipe
    csvData.append([])

    # Add recipe title, cocktail glass, and served
    # NOTE: Stripping commas just in case as well
    csvData[index + 1].append(str(recipe['title']).replace(',', ''))
    csvData[index + 1].append(str(recipe['drinkware']).replace(',', '').lower())
    csvData[index + 1].append(str(recipe['served']).replace(',', '').lower())

    # Fill ingredients with 0s
    # NOTE: subtracting out the three oddballs
    for cell in range(0, len(csvData[0]) - 3):
        csvData[index + 1].append(0)

    # Fill existing ingredients with 1s
    for ingObj in recipe['ingredients']:
        i = csvData[0].index(str(ingObj['ingredient']).lower())
        csvData[index + 1][i] = 1

# Dump into csvData
with open(sys.argv[1].replace('json', 'csv'), 'wb') as f:
    writer = csv.writer(f)
    writer.writerows(csvData)
