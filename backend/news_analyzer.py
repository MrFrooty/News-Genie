# news_analyzer.py

from gemini_utils import generate_content
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def analyze_sentiment(text):
    prompt = f"Analyze the sentiment of the following text and respond with either 'positive', 'negative', or 'neutral':\n\n{text}"
    response = generate_content(prompt)
    return response.strip().lower()


def analyze_relevance(text, user_preferences):
    categories = ", ".join(user_preferences)
    prompt = f"Given the user's preferred news categories: {categories}, determine if the following text is relevant. Respond with 'relevant' or 'not relevant':\n\n{text}"
    response = generate_content(prompt)
    return response.strip().lower() == "relevant"


def categorize_article(text):
    prompt = f"Categorize the following news article into one or more of these categories: World News, Politics, Business, Technology, Health, Science, Environment, Sports, Entertainment, Lifestyle, Education, Fashion, Food, Travel, Economy. List only the categories, separated by commas:\n\n{text}"
    response = generate_content(prompt)
    return [category.strip() for category in response.split(",")]


def summarize_news(article_text):
    system_context = """
    Objective: Provide a concise summary of the given news article in 3-4 sentences.
    Instructions:
    1. Identify the main points of the article.
    2. Summarize the key information in a clear and concise manner.
    3. Maintain a neutral tone.
    4. Ensure the summary is self-contained and understandable without additional context.
    """
    print("\n--- System Context ---")
    print(system_context)
    print("--- End of System Context ---\n")

    prompt = f"{system_context}\n\nArticle:\n{article_text}\n\nSummary:"
    return generate_content(prompt)


def generate_headlines(topic, user_context=""):
    system_context = f"""
    Objective: Generate 5 catchy news headlines about the given topic, considering user preferences if available.
    Instructions:
    1. Create headlines that are attention-grabbing and informative.
    2. Ensure headlines are relevant to the topic and user preferences (if provided).
    3. Use a mix of styles: questions, numbers, how-to, and declarative statements.
    4. Keep headlines concise, ideally under 10 words each.
    5. Maintain a tone that's engaging yet professional.
    User Context: {user_context}
    """
    logger.info(f"Generating headlines for topic: {topic}")
    logger.info(f"User context: {user_context}")

    prompt = f"Topic: {topic}\n\nHeadlines:"

    full_prompt = f"{system_context}\n\n{prompt}"

    response = generate_content(full_prompt)
    headlines = [
        headline.strip() for headline in response.split("\n") if headline.strip()
    ]
    return headlines[:5]
