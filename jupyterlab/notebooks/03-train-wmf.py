# Import libraries

import os
import sys
import itertools

import datetime
import scipy.sparse as sp
import numpy as np
import pandas as pd
#import seaborn as sns
import matplotlib.pyplot as plt
import zipfile
from adjustText import adjust_text
from collections import defaultdict
from time import sleep
from tqdm.notebook import tqdm

import cornac
from cornac.utils import cache
from cornac.datasets import movielens
from cornac.eval_methods import RatioSplit, StratifiedSplit, CrossValidation
from cornac.models import MF, NMF, WMF, BPR, BaselineOnly, NeuMF, CDL
from cornac.hyperopt import Discrete, Continuous
from cornac.hyperopt import GridSearch, RandomSearch

print(f"System version: {sys.version}")
print(f"Cornac version: {cornac.__version__}")

VERBOSE = True

# Define use of SEED
USE_SEED = True  # True = repeatable, no parallelisation

if USE_SEED:
    SEED = 42
else:
    SEED = None
    
# Load training data
df_train = pd.read_csv('../../data/train_ratings_seen.csv')
df_probe = pd.read_csv('../../data/test_ratings_unseen.csv')
df_all = pd.concat([df_train, df_probe])
dataset_all = cornac.data.Dataset.from_uir(df_all.itertuples(index=False))

# Display some parameters
n_users = df_all['user_id'].nunique()
n_items = df_all['item_id'].nunique()

print(f'Number of users: {n_users:,}')
print(f'Number of items: {n_items:,}')
print(f'Shape of full matrix: {cornac.data.Dataset.from_uir(df_all.itertuples(index=False)).matrix.shape}')

# Sparsity
total_possible_rankings = n_users * n_items
sparsity = 1 - df_all.shape[0]/total_possible_rankings
print(f'Sparsity of matrix: {100*sparsity:0.3f}%')
print()

# Define model
K = 50
n_iterations = 5000

# Evaluation method
stratified_split = StratifiedSplit(
    data=list(df_all.itertuples(index=False, name=None)),
    group_by='user',
    fmt ="UIR",
    test_size=0.2,
    rating_threshold=3.5,
    exclude_unknowns=True,
    verbose=VERBOSE,
    seed=SEED,
)

# WMF model
wmf = cornac.models.WMF(
    k=K,
    lambda_u=0.1, 
    lambda_v=1.0, 
    learning_rate=0.001,
    max_iter=n_iterations,
    verbose=VERBOSE, 
    seed=SEED, 
    name=f'WMF(K={K})'
)

# Define models to try
models = [
    wmf,
]

# Define metrics
metrics = [
    cornac.metrics.RMSE(),
    cornac.metrics.FMeasure(k=20),
    cornac.metrics.AUC(),
    cornac.metrics.MRR(),
    cornac.metrics.NCRR(k=20),
    cornac.metrics.NDCG(k=20),
    cornac.metrics.Recall(k=20)
]

print('Starting training of model')

model_experiment = cornac.Experiment(
    eval_method=stratified_split, 
    models=models, 
    metrics=metrics,
    user_based=True,
    save_dir='cornac_experiments',
)

model_experiment.run()

