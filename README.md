# Sommelier

Too many wines, too little time? Not sure what wine goes well with that delicious dish you whipped up?
Fret not, Sommelier is here to help recommend you wine for every occassion.

## Folder structure

This monorepo contains all parts needed to develop Sommelier. 
- API: REST apis built on top of FastAPI to provide backend for wine recommendation.
- APP: PWA based on React and Material UI to demonstrate a wine recommendation product.
- Jupyter: Exploratory work to develop models for recommendations.

(Transient folders)
- Data: central place to keep data gathered by scraper and used by Api and Notebooks.

## How to:
- Assumes docker is installed.
- Assumes knowledge of Makefile. If your system does not support Makefile, replace make command with the correspending commands.
1. run `make scraper-up` to download data.
2. run `make jupyterlab-up` to start notebook (Copy link printed in terminal)