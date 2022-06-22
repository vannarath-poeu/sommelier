
import sys
import numpy as np
import pickle

ASPECTS = ['tobacco','cherry','chocolate','vanilla','sweet','oak','raspberry','berries','acidity','fruit','pepper','plum','strawberry','value','tannins','finish','blackberry','citrus','apple','refreshing','earthy','complexity','spice','pear','crisp','honey','price','blackcurrant','body','lemon','leather','intensity','structure','smoke','aromas']
ASPECTS_aroma = ['tobacco','vanilla','oak','raspberry','pepper','plum','strawberry','cherry','raspberry','citrus','apple','pear','blackcurrant','lemon','smoke','aromas','leather','refreshing']
ASPECTS_taste = ['chocolate','sweet','fruit','berries','fruit','crisp','honey']
ASPECTS_other = ['acidity','value','tannins','finish','complexity','price','body''intensity','structure']

def get_explanation(
  user_id: str,
  wine,
  num_top_cared_aspects=10,
  aspectK=4
):
  item_id = wine["_id"]
  
  U1,U2,V=pickle.load(open("../../data/U1.p", "rb")),pickle.load(open("../../data/U2.p", "rb")),pickle.load(open("../../data/V.p", "rb"))
  uidmap=pickle.load(open("../../data/uidmap.p", "rb"))
  iidmap=pickle.load(open("../../data/iidmap.p", "rb"))

  U1_user = U1[uidmap[user_id]] if user_id in uidmap else np.ones((80, ))
  IIDX = iidmap[item_id]
  num_top_cared_aspects = 10

  predicted_user_aspect_scores = np.dot(U1_user, V.T)
  predicted_item_aspect_scores = np.dot(U2[IIDX], V.T)

  top_cared_aspect_ids = (-predicted_user_aspect_scores).argsort()[:num_top_cared_aspects]
  top_cared_aspects = [ASPECTS[aid] for aid in top_cared_aspect_ids]

  perform_well_aspects=[top_cared_aspects[j] for j in predicted_item_aspect_scores[top_cared_aspect_ids].argsort()[:aspectK]]
  perform_poorly_aspects= [top_cared_aspects[j] for j in predicted_item_aspect_scores[top_cared_aspect_ids].argsort()[-aspectK:]]

  aromas = [x for x in perform_well_aspects if x in ASPECTS_aroma]
  tastes = [x for x in perform_well_aspects if x in ASPECTS_taste]
  attributs = [x for x in perform_poorly_aspects if x in ASPECTS_other]

  style = wine.get("wine_style", None) or wine.get("wine_name", "new style")
  origin = wine.get("country_name", None) or wine.get("region_name", None) or wine.get("producer", "Unknown")
  explanation=f"This is a {style} from {origin}, "

  if len(aromas)>0:
      explanation=explanation+f"You might interested in its aroma of {aromas[0]}"
      if len(tastes)>0:
          explanation=explanation+f" or its taste of {tastes[0]}"
  else:
      explanation=explanation+f"You might interested in its taste of {tastes[0]}"   
  if len(attributs)>0:
      explanation=explanation+f", despite a possible lack of {attributs[0]}"

  return explanation

