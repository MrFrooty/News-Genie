import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-pro")


def analyze_sentiment(text):
    prompt = f"Analyze the sentiment of the following text and respond with either 'positive', 'negative', or 'neutral':\n\n{text}"
    response = model.generate_content(prompt)
    return response.text.strip().lower()


def analyze_relevance(text, user_preferences):
    categories = ", ".join(user_preferences)
    prompt = f"Given the user's preferred news categories: {categories}, determine if the following text is relevant. Respond with 'relevant' or 'not relevant':\n\n{text}"
    response = model.generate_content(prompt)
    return response.text.strip().lower() == "relevant"


def categorize_article(text):
    prompt = f"Categorize the following news article into one or more of these categories: World News, Politics, Business, Technology, Health, Science, Environment, Sports, Entertainment, Lifestyle, Education, Fashion, Food, Travel, Economy. List only the categories, separated by commas:\n\n{text}"
    response = model.generate_content(prompt)
    return [category.strip() for category in response.text.split(",")]
