from typing import Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymongo
import os
import json

import cornac

from explanation import get_explanation

MAX_RECOMMENDATIONS = 20

class User(BaseModel):
  id: str
  name: str

MONGO_HOST = os.environ.get("MONGO_HOST", "sommelier.vubzs.mongodb.net")
MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "sommelier")
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "sommelier")
client = pymongo.MongoClient(f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}/?retryWrites=true&w=majority")

db = client.sommelier

# Load CTR
ctr = cornac.models.CTR.load("../../data/CTR.pkl", trainable=False)
data = cornac.data.Reader().read("../../data/train_test_split/train_ratings_seen.csv", f"UIR", sep=",", skip_lines=1)
dataset = cornac.data.Dataset.from_uir(data)
ctr.fit(dataset)
ctr_item_ids = list(ctr.train_set.item_ids)

# Load MostPop
most_pop = cornac.models.MostPop.load("../../data/MostPop.pkl", trainable=False)
most_pop.fit(dataset)
most_pop_item_ids = list(most_pop.train_set.item_ids)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def hellow():
  return {"Hello": "World"}


@app.get("/users/{user_id}/recommendations")
def get_recommendations_for_user(user_id: str, q: Union[str, None] = None):
  idx = dataset.uid_map.get(user_id, None)
  if idx is None:
    item_idx_list, _ = most_pop.rank(0)
    item_id_list = [most_pop_item_ids[item_idx] for item_idx in item_idx_list[:MAX_RECOMMENDATIONS]]
    wine_list = db.wines.find({ "_id": { "$in": item_id_list}})
    wine_list = [w for w in wine_list]
    for w in wine_list:
      try:
        w["explanation"] = get_explanation(user_id, w)
      except Exception as e:
        print(e)
        pass
    return {
      "mode": "MostPop",
      "user_id": user_id,
      "recommendations": wine_list
    }
  else:
    item_idx_list, _ = ctr.rank(idx)
    item_id_list = [ctr_item_ids[item_idx] for item_idx in item_idx_list[:MAX_RECOMMENDATIONS]]
    wine_list = db.wines.find({ "_id": { "$in": item_id_list}})
    wine_list = [w for w in wine_list]
    for w in wine_list:
      try:
        w["explanation"] = get_explanation(user_id, w)
      except:
        pass
    return {
      "mode": "CTR",
      "user_id": user_id,
      "recommendations": wine_list
    }

@app.get("/users/{user_id}")
def get_user(user_id: str):
  users = db.users
  user = users.find_one({ "_id": user_id })
  if not user:
    raise HTTPException(status_code=404, detail="user does not exist")
  return {
    "id": user["_id"],
    "name": user["name"]
  }

@app.post("/users/")
def create_user(user: User):
  users = db.users
  if users.find_one({ "_id": user.id }):
    raise HTTPException(status_code=409, detail="user exists")
  user_id = users.insert_one({
    "_id": user.id,
    "name": user.name
  }).inserted_id
  new_user = users.find_one({ "_id": user_id })
  return {
    "id": new_user["_id"],
    "name": new_user["name"]
  }

@app.post("/wine-info/")
def load_wine_info():
  db.wines.delete_many({})

  with open("../../data/original/wine-info.json") as f:
    wine_infos = json.load(f)
    for w in wine_infos:
      w["_id"] = w["wine_id"]
      del w["wine_id"]
    db.wines.insert_many(wine_infos)
  
  return {
    "status": "OK"
  }

@app.post("/wine-style/")
def load_wine_style():
  db.wine_style.delete_many({})

  with open("../../data/wine_style.json") as f:
    wine_styles = json.load(f)
    db.wine_style.insert_many([{"_id": ws, "name": ws} for ws in wine_styles])
  
  return {
    "status": "OK"
  }

@app.post("/food/")
def load_food():
  db.food.delete_many({})

  with open("../../data/food_list.json") as f:
    food_list = json.load(f)
    db.food.insert_many([{"_id": food, "name": food} for food in food_list])
  
  return {
    "status": "OK"
  }

@app.get("/wines/{wine_id}")
def get_wine(wine_id: str):
  wine = db.wines.find_one({ "_id": wine_id })
  if not wine:
    raise HTTPException(status_code=404, detail="wine does not exist")
  return wine