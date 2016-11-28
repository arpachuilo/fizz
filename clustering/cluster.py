#!python2

import json
import sys
import numpy as np
from kmodes import kmodes

syms = np.genfromtxt(sys.argv[1], dtype=str, delimiter=',')[:, 0]
X = np.genfromtxt(sys.argv[1], dtype=object, delimiter=',')[:, 3:]
X[:, 0] = X[:, 0].astype(float)

kmode = kmodes.KModes(n_clusters=int(sys.argv[2]), init='Huang', n_init=100, verbose=2)
clusters = kmode.fit_predict(X, categorical=[92])

# Print cluster centroids of the trained model.
print(kmode.cluster_centroids_)

# Print training statistics
print("Costs: {}".format(kmode.cost_))
print("Iterations: {}".format(kmode.n_iter_))

for s, c in zip(syms, clusters):
    print("Symbol: {}, cluster:{}".format(s, c))

# Load recipe data
with open(sys.argv[1].replace('csv', 'json')) as json_data:
    jsonData = json.load(json_data)

# NOTE: Assuming indicies are never messed with during all this
# Add cluster to json file
for s, c, j in zip(syms, clusters, jsonData):
    j['cluster'] = int(c)

# Dump to json file
outfile = open(sys.argv[1].replace('csv', 'json'), 'w')
outfile.write(json.dumps(jsonData, indent=4))
outfile.close()
