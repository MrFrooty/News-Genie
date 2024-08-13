# news_fetcher.py

from gemini_utils import generate_content
import logging
import json
import urllib.parse

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def fetch_news(topic, user_context):
    categories = ", ".join(user_context.get("categories", []))
    news_outlets = ", ".join(user_context.get("news_outlets", []))

    system_context = f"""
    Objective: Provide a summary of the five most recent and relevant news topics based on the user's input and account preferences (if available). The summary should be tailored to the user's interests, covering specific topics and news sources, and should maintain a professional yet relaxed tone. All information must be verifiable, cited, and factual.

    Instructions:
    1. Select the five most recent and relevant news topics related to the user's input and preferences (if available).
    2. Ensure all news selected is current (within the last week) and from credible sources that can be cited.
    3. Always return summaries for exactly five news topics.
    4. Maintain a professional yet relaxed tone in the response.
    5. Provide concise and clear summaries of the news topics.
    6. Every piece of news must include a citation from a credible source.
    7. Include the name of the news source and the publication date in the format "Month Day, Year" (e.g., "September 23, 2024").
    8. Do not include any news older than one week.
    9. Fact-check all information before including it in the summary.
    10. If there are not enough recent, relevant news items, inform the user that there is limited recent news on the topic.
    11. Format the response as a JSON object with the structure: [["1", "News Title", "News Description", "Source (including formatted publication date)"], ...].

    User Context:
    Preferred categories: {categories}
    Preferred news outlets: {news_outlets}
    """
    logger.info(f"Fetching news for topic: {topic}")
    logger.info(f"User context: {user_context}")

    prompt = f"""Topic: {topic}

    Please provide the five most recent and relevant news items related to this topic in the following JSON format:
    [
        ["1", "News Title", "News Description", "Source (including publication date in the format 'Month Day, Year')"],
        ["2", "News Title", "News Description", "Source (including publication date in the format 'Month Day, Year')"],
        ...
    ]

    Ensure all news items are from the past week and factually accurate. If there are not enough recent news items, please indicate this in your response.
    """

    full_prompt = f"{system_context}\n\n{prompt}"

    response = generate_content(full_prompt)

    try:
        news_items = json.loads(response)

        for item in news_items:
            google_search_url = (
                f"https://www.google.com/search?q={urllib.parse.quote(item[1])}"
            )
            item.append(google_search_url)

        return json.dumps(news_items)
    except json.JSONDecodeError:
        logger.error("Failed to parse news response as JSON")
        return json.dumps([])
