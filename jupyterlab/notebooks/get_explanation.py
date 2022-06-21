
import sys
import numpy as np
import pandas as pd
import pickle


def get_explanation(raw_str_uid, raw_str_iid, wine_info=None,                   
                    num_top_cared_aspects=10, 
                    aspectK=4):
    ASPECTS=['tobacco','cherry','chocolate','vanilla','sweet','oak','raspberry','berries','acidity','fruit','pepper','plum','strawberry','value','tannins','finish','blackberry','citrus','apple','refreshing','earthy','complexity','spice','pear','crisp','honey','price','blackcurrant','body','lemon','leather','intensity','structure','smoke','aromas']

    ASPECTS_aroma=['tobacco','vanilla','oak','raspberry','pepper','plum','strawberry','cherry','raspberry','citrus','apple','pear','blackcurrant','lemon','smoke','aromas','leather','refreshing']

    ASPECTS_taste=['chocolate','sweet','fruit','berries','fruit','crisp','honey']
    ASPECTS_other=['acidity','value','tannins','finish','complexity','price','body''intensity','structure']
    if wine_info==None:
        wine_info=pd.read_csv("../../data/wine_info_all.csv")
        wine_info['Wine ID']=wine_info['Wine ID'].astype(str)
        wine_info.set_index("Wine ID", inplace=True)
        wine_info.fillna('na', inplace=True)
    country=wine_info.loc[ raw_str_iid]['country']
    style=wine_info.loc[ raw_str_iid]['style']
    if style=='na':
        style=wine_info.loc[ raw_str_iid]['Wine']
    #explain=EFM.load("EMF/EFM/2022-06-21_21-59-21-061287.pkl", trainable=False)
    
    U1,U2,V=pickle.load(open("../../data/U1.p", "rb")),pickle.load(open("../../data/U2.p", "rb")),pickle.load(open("../../data/V.p", "rb"))
    uidmap=pickle.load(open("../../data/uidmap.p", "rb"))
    iidmap=pickle.load(open("../../data/iidmap.p", "rb"))

    UIDX = uidmap[raw_str_uid]
    IIDX = iidmap[ raw_str_iid]
    num_top_cared_aspects = 10
    #aspectK=4
    #id_aspect_map = {v:k for k, v in evaluation_method.sentiment.aspect_id_map.items()}

    predicted_user_aspect_scores = np.dot(U1[UIDX], V.T)
    predicted_item_aspect_scores = np.dot(U2[IIDX], V.T)

    top_cared_aspect_ids = (-predicted_user_aspect_scores).argsort()[:num_top_cared_aspects]
    top_cared_aspects = [ASPECTS[aid] for aid in top_cared_aspect_ids]
    perform_well_aspect = top_cared_aspects[predicted_item_aspect_scores[top_cared_aspect_ids].argmax()]
    perform_poorly_aspect = top_cared_aspects[predicted_item_aspect_scores[top_cared_aspect_ids].argmin()]

    perform_well_aspects=[top_cared_aspects[j] for j in predicted_item_aspect_scores[top_cared_aspect_ids].argsort()[:aspectK]]
    perform_poorly_aspects= [top_cared_aspects[j] for j in predicted_item_aspect_scores[top_cared_aspect_ids].argsort()[-aspectK:]]

    aromas=[x for x in perform_well_aspects if x in ASPECTS_aroma]
    tastes=[x for x in perform_well_aspects if x in ASPECTS_taste]
    attributs=[x for x in perform_poorly_aspects if x in ASPECTS_other]

    explanation=f"This is a {style} from {country}, "

    if len(aromas)>0:
        explanation=explanation+f"You might interested in its aroma of {aromas[0]}"
        if len(tastes)>0:
            explanation=explanation+f" or its taste of {tastes[0]}"
    else:
        explanation=explanation+f"You might interested in its taste of {tastes[0]}"   
    if len(attributs)>0:
        explanation=explanation+f" ,despite a possible lack of {attributs[0]}"

    return explanation
    
if __name__=='__main__':
    print(get_explanation ('58534725','14372') )
    print(get_explanation ('58534725','79762') )
