from selenium import webdriver
from bs4 import BeautifulSoup
import json
import time
import random
import os
import re

# PARAMS
USER_PAGINATE_TIMES = 1000
MAX_USER_RATING_ROUNDS = 5

# Driver
def set_driver_settings():
    options = webdriver.ChromeOptions()
    options.add_argument('--ignore-certificate-errors')
    return options

def get_driver():
    driver = webdriver.Chrome(options=set_driver_settings())
    return driver

# Scrape user
def download_user_links(driver):
    for _ in range(USER_PAGINATE_TIMES):
        show_more_button = driver.find_elements_by_class_name(
            'text-block.text-center.country-rankings-show-more.semi')[-1]
        driver.execute_script("arguments[0].click();", show_more_button)
        time.sleep(random.uniform(0, 5))

    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'lxml')

    user_links = soup.find_all('span', class_='user-name header-smaller bold')
    user_links = [u.find('a', class_='link-muted')['href'] for u in user_links]

    with open("user_links.json", "w") as f:
        json.dump(list(set(user_links)), f, indent=2)

def scrape_users(driver):
  driver.get('https://www.vivino.com/users/johan.po/rankings')

  time.sleep(20)
  # use this time to log in manually - the list of all user links is not visible if not logged in
  download_user_links(driver)

# Scrape wine ratings
def ensure_path(path):
  if not os.path.exists(path):
    os.mkdir(path)

def expand_show_more(driver):
  show_more_button_visible = True
  current_round = 0
  while show_more_button_visible and current_round < MAX_USER_RATING_ROUNDS:
    show_more_button = driver.find_elements_by_class_name('show-more')[-1].find_element_by_class_name('btn')
    if 'hidden' not in show_more_button.get_attribute('class'):
      driver.execute_script("arguments[0].click();", show_more_button)
      time.sleep(random.uniform(0, 4))
    else:
      show_more_button_visible = False
    current_round += 1

def calculate_rating(element):
    # a 100-pct icon means a full star in the rating
    full_stars = element.find_all('i', class_='icon-100-pct')
    nr_full_stars = len(full_stars)

    # a 50-pct icon means a half star in the rating
    half_stars = element.find_all('i', class_='icon-50-pct')
    nr_half_stars = len(half_stars)

    rating = nr_full_stars + 0.5 * nr_half_stars
    return rating


# extract all the relevant information from each wine review
def grab_review_data(review, user_id):
  date_info = review.find('a', class_='link-muted bold inflate')
  review_date = date_info['title']

  rating_element = review.find('span', class_='rating rating-xs text-inline-block')
  rating = calculate_rating(rating_element)

  vintage = review.find('div', class_='activity-wine-card')['data-year']

  wine_info = review.find('div', class_='wine-info')

  wine_name = wine_info.find('a', class_='link-muted bold').text
  wine_url = wine_info.find('a', class_='link-muted bold')['href']
  wine_id = str(wine_url).split("/w/")[-1]
  wine_id = wine_id.split("?")[0]

  try:
    review_text = review.find(
    'p', class_='tasting-note text-larger').text
  except AttributeError:
    review_text = None

  try:
    producer = wine_info.find('span', class_='text-small').find('a', class_='link-muted').text
  except AttributeError:
    producer = None

  try:
    region_info = wine_info.find('div', 'text-mini link-muted semi').find_all('a')
    region_name = region_info[0].text
    country_name = region_info[1].text
  except AttributeError:
    region_name = None
    country_name = None

  average_rating = review.find('span', class_='header-large text-block').text.strip()
  nr_ratings = review.find('span', class_='text-micro text-block').find('div', class_='row-no-gutter').text
  nr_ratings = [l for l in nr_ratings.splitlines() if l][0]

  review_info = {
    'wine_id': wine_id,
    'user_id': user_id,
    'rating': rating,
    'review_date': review_date,
    'review_text': review_text,
    'vintage': vintage,
  }

  wine_info = {
    'wine_id': wine_id,
    'wine_url': wine_url,
    'wine_name': wine_name,
    'producer': producer,
    'region_name': region_name,
    'country_name': country_name,
    'average_rating': average_rating,
    'nr_ratings': nr_ratings,
  }

  return review_info, wine_info


def grab_user_id(soup):
    # grab the user name and ID
    user_info = soup.find(
        'div', class_='user-header__image-container__wrapper').find('div')['data-react-props']
    user_info_json = json.loads(user_info)
    user_id = user_info_json['user']['id']
    return user_id


def mine_review_data(user_link, driver):
  user_link = 'https://www.vivino.com/' + user_link

  driver.get(user_link)
  time.sleep(4)

  page_source = driver.page_source
  soup = BeautifulSoup(page_source, 'lxml')

  try:
    user_id = grab_user_id(soup)
  except:
    # Skip users
    return {}

  if os.path.exists(f"review_data/{str(user_id)}.json"):
    print('already scraped this person')
    return {}

  print("scraping for user: ", user_id)
  expand_show_more(driver)
  page_source = driver.page_source
  soup = BeautifulSoup(page_source, 'lxml')
  reviews_selector = soup.find_all('div', class_='user-activity-item')
  # Must rate at least 5 items
  if len(reviews_selector) >= 5:
    all_review_info = []
    all_wine_info = {}
    for r in reviews_selector:
      review_info, wine_info = grab_review_data(r, user_id)
      all_review_info.append(review_info)
      all_wine_info[wine_info["wine_id"]] = wine_info

    # write the scraped data to a json file
    filename = 'review_data/' + str(user_id) + '.json'
    with open(filename, 'w') as outfile:
      json.dump(all_review_info, outfile)
    return all_wine_info
  return {}

def scrape_wine_ratings(driver):
  driver.get('https://www.vivino.com/users/johan.po/rankings')

  time.sleep(20)
  # use this time to log in manually - the list of all user links is not visible if not logged in

  ensure_path("review_data")
  ensure_path("wine_data")

  with open("user_links.json", 'r') as f:
    user_links = json.load(f)
  
  all_wine_info = {}

  filename = 'wine_data/wine.json'
  if os.path.exists(filename):
    with open(filename, 'r') as f:
      all_wine_info = json.load(f)

  unique_user_links = list(user_links)
  for u in unique_user_links:
    wine_info = mine_review_data(u, driver)
    for w_id, w_info in wine_info.items():
      all_wine_info[w_id] = w_info
    time.sleep(random.uniform(0, 3))

    print("Total wines: ", len(all_wine_info))
        
    # write the scraped data to a json file
    filename = 'wine_data/wine.json'
    with open(filename, 'w') as outfile:
      json.dump(all_wine_info, outfile)

# Scrape wine info
def mine_additional_info(wine_info, driver):
  wine_link = 'https://www.vivino.com/' + wine_info["wine_url"]

  # Wait for page to fully load
  driver.get(wine_link)
  time.sleep(random.uniform(1, 2))

  # Get scroll height
  scroll_height = 0

  for _ in range(25):
    # Scroll down to bottom
    scroll_height = scroll_height + 400
    driver.execute_script(f"window.scrollTo(0, {scroll_height});")

    # Wait to load page
    time.sleep(random.uniform(0.1, 0.2))

  page_source = driver.page_source
  soup = BeautifulSoup(page_source, 'lxml')

  print("scraping for wine: ", wine_info["wine_id"])

  bottle_shot = soup.find("picture", class_="bottleShot")
  bottle_img = bottle_shot.find("img")

  food_pairings = []
  try:
    food_pairings_a = soup.find_all("a", class_=re.compile("foodPairing__imageContainer"))
    for food_pair_a in food_pairings_a:
      food_pairing_divs = food_pair_a.find_all("div")
      food_pairings.append(str(food_pairing_divs[1].text)) 
  except:
    # Ignore if no food pairing
    pass
  
  wine_style = None
  try:
    wine_fact_table = soup.find("table", class_=re.compile("wineFacts__wineFacts"))
    wine_fact_rows = wine_fact_table.find_all("tr")
    for row in wine_fact_rows:
      label = row.find("span", class_=re.compile("wineFacts__headerLabel")).text
      if label != "Wine style":
        continue
      wine_style = str(row.find("td").find("a").text)
  except:
    # Ignore if no food pairing
    pass
  
  additional_info = {
    'wine_image_url': bottle_img["src"],
    'food_pairings': food_pairings,
    'wine_style': wine_style,
  }

  return additional_info

def scrape_wine_info(driver):
  driver.get('https://www.vivino.com/users/johan.po/rankings')

  wine_file = 'wine_data/wine.json'

  # No login needed
  time.sleep(2)
  # use this time to log in manually - the list of all user links is not visible if not logged in

  with open(wine_file, 'r') as f:
    wine_dic = json.load(f)
  wine_info_list = []
  for _, wine_info in wine_dic.items():
    try:
      additional_info = mine_additional_info(wine_info, driver)
      for a_info_key, a_info in additional_info.items():
        wine_info[a_info_key] = a_info
      wine_info_list.append(wine_info)
      time.sleep(random.uniform(0, 1.5))
    except:
      wine_info_list.append(wine_info)
      print("Unable to scrape for wine: ", wine_info["wine_id"])
        
  # write the scraped data to a json file
  filename = wine_file.replace("wine.json", "wine-info.json")
  with open(filename, 'w') as outfile:
    json.dump(wine_info_list, outfile)

if __name__ == "__main__":
  driver = get_driver()

  scrape_users(driver)
  scrape_wine_ratings(driver)
  scrape_wine_info(driver)

  driver.close()