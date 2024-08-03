import requests
from bs4 import BeautifulSoup


def fetch_news_from_api(api_url):
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        return None


def fetch_news_from_rss(rss_url):
    response = requests.get(rss_url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, features="xml")
        articles = soup.findAll("item")
        news_list = []
        for article in articles:
            news = {
                "title": article.title.text,
                "description": article.description.text,
                "link": article.link.text,
                "published": article.pubDate.text,
            }
            news_list.append(news)
        return news_list
    else:
        return None


def fetch_news_from_website(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        # This is a basic implementation and might need to be customized for each website
        articles = soup.find_all("article")
        news_list = []
        for article in articles:
            title = article.find("h2").text if article.find("h2") else "No title"
            description = (
                article.find("p").text if article.find("p") else "No description"
            )
            link = article.find("a")["href"] if article.find("a") else "#"
            news_list.append({"title": title, "description": description, "link": link})
        return news_list
    else:
        return None
