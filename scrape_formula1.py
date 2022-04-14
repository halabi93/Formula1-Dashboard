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

### OUR CODE HERE
    # Proof of Concept
    url = "https://www.formula1.com/"
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')
    results_title = soup.find_all('p', class_='f1--title')
    news_title = results_title[0].text
    results_link = soup.find_all('a', class_='f1-cc')[0]["href"]
    news_link = url + results_link









    formula1_data = {
        "news_title": news_title,
        "news_link": news_link,
    }






    # Close the browser after scraping
    browser.quit()

    # Return results
    return formula1_data