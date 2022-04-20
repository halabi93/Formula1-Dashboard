from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import time
import requests
from webdriver_manager.chrome import ChromeDriverManager

def scrape_info():
    # Set up Splinter
    executable_path = {'executable_path': ChromeDriverManager().install()}
    browser = Browser('chrome', **executable_path, headless=False)

    # Article from F1 website
    url = "https://www.formula1.com/"
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')
    result_title = soup.find_all('p', class_='f1--title')
    f1_title = result_title[0].text
    results_link = soup.find_all('a', class_='f1-cc')[0]["href"]
    f1_link = url + results_link

    # Bonus Article from formula 1 website
    result_title = soup.find('div', class_='f1-race-hub--latest').find("div").find("fieldset").find("div").find("div").find("a")["href"]
    f1_bonus = "https://www.formula1.com" + result_title
    bonus_title = soup.find('div', class_='f1-race-hub--latest').find("div").find("fieldset").find("div").find("div").find("a").find("p", class_ = "f1--s").text


    # Article from ESPN's dedicated F1 page
    url = "https://www.espn.com/f1/"
    link_prefix = "https://www.espn.com"
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')
    espn_title = soup.find('h1', class_='contentItem__title--story').text
    results_link = soup.find('section', class_='contentFeed').find('section').find('section').find('a')['href']
    espn_link = link_prefix + results_link

    # Article from motorsport.com dedicated F1 page
    url = "https://www.motorsport.com/f1/news/"
    link_prefix = "https://www.motorsport.com/"
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')
    motorsport_title = soup.find_all('a', class_='ms-item_link')[0]["title"]
    results_link = soup.find_all('a', class_='ms-item_link')[0]["href"]
    motorsport_link = link_prefix + results_link

    # Store data in dictionary
    formula1_data = {
        "f1_title": f1_title,
        "f1_link": f1_link,
        "espn_title": espn_title,
        "espn_link": espn_link,
        "bonus_title": bonus_title,        
        "f1_bonus": f1_bonus,
        "motorsport_title": motorsport_title,
        "motorsport_link": motorsport_link
   }

    # Close the browser after scraping
    browser.quit()

    # Return results
    return formula1_data