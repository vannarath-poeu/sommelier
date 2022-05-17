import requests

r = requests.get("https://raw.githubusercontent.com/boivinalex/vivino-recommenderpy/master/sample_data/review_data_2020-06-21.csv")
with open("data/review-data.csv", "wb") as f:
  f.write(r.content)