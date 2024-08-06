# news_fetcher.py

from gemini_utils import generate_content
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def fetch_news(topic, user_context=""):
    system_context = f"""
    Objective: Provide a summary of the biggest news topics based on the user's input and account preferences (if available). The summary should be tailored to the user's interests, covering specific topics and news sources, and should maintain a professional yet relaxed tone. All information must be verifiable and cited.
    Instructions:
    1. Select the five biggest news topics that are currently trending and relevant to the user's input and preferences (if available).
    2. Ensure the news selected is current and from credible sources that can be cited.
    3. Always return summaries for exactly five news topics.
    4. Maintain a professional yet relaxed tone in the response.
    5. Engage the user with concise and clear summaries of the news topics.
    6. Every piece of news must include a citation from a credible source.
    7. Include the name of the news source and, if applicable, a link to the original article.
    User Context: {user_context}
    """
    logger.info(f"Fetching news for topic: {topic}")
    logger.info(f"User context: {user_context}")

    prompt = f"Topic: {topic}\n\n:"

    full_prompt = f"{system_context}\n\n{prompt}"

    return generate_content(full_prompt)
