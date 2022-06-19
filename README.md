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
1. Follow README.md in scraper folder to get data.
2. run `make jupyterlab-up` to start notebook (Copy link printed in terminal).
3. run `make api-up` to start fastapi. This will be used to serve model predictions.
4. run `make app-up` to start React app. This will be used as the front-end for user interactions. Note: the first run is extremely slow while packages are being installed.

(Optional): the above commands have a down version where you replace the `-up` with `-down` to destroy the dockers. This should be used when drastic changes are made and cache needs to be destroyed.