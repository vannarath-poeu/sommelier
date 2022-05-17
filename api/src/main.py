from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def hellow():
  return {"Hello": "World"}


@app.get("/users/{user_id}/recommendations")
def get_recommendations_for_user(user_id: int, q: Union[str, None] = None):
  return {
    "user_id": user_id,
    "recommendations": [
      {
        "name": "Clos de Tafall 2017",
      },
      {
        "name": "Montessu 2017",
      },
      {
        "name": "Malbec 2017",
      },
      {
        "name": "Cabernet Franc (Small Lot) 2013",
      },
      {
        "name": "Cormì Corvina - Merlot 2015",
      }
    ]
  }