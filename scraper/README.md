# Wine Scraper

Scraper cannot be dockerized as it involves loggin in. Hence, to run scraper:

1. Navigate to scraper folder
2. Run `python3 -m venv env` to set up virtual env
3. Run `source env/bin/activate` to activate virtual env
4. Run `pip install -r requirements.txt` to install dependencies
5. Download chromedriver (https://chromedriver.chromium.org/downloads) and place in `env/bin`
6. Run `python3 scraper.py` to scrape.
7. Quickly log in and wait ... 