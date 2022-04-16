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

    # Article from ESPN's dedicated F1 page
    url = "https://www.espn.com/f1/"
    link_prefix = "https://www.espn.com"
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')
    espn_title = soup.find('h1', class_='contentItem__title--story').text
    results_link = soup.find('section', class_='contentFeed').find('section').find('section').find('a')['href']
    espn_link = link_prefix + results_link

    # Store data in dictionary
    formula1_data = {
        "f1_title": f1_title,
        "f1_link": f1_link,
        "espn_title": espn_title,
        "espn_link": espn_link,
   }

    # Close the browser after scraping
    browser.quit()

    # Return results
    return formula1_data