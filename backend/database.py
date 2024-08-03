from pymongo import MongoClient, ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

database_uri = os.getenv("MONGODB_URI")
user = os.getenv("MONGODB_USER")
password = os.getenv("MONGODB_PASSWORD")

uri = f"mongodb+srv://{user}:{password}@{database_uri}/?retryWrites=true&w=majority&appName=Dev"

client = MongoClient(uri, server_api=ServerApi("1"))
db = client["news_aggregator"]


def connect_to_db():
    try:
        client.admin.command("ping")
        return db
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


# ... (rest of the database.py content)


def save_user_preferences(user_id, preferences):
    db.users.update_one(
        {"_id": user_id}, {"$set": {"preferences": preferences}}, upsert=True
    )


def get_user_preferences(user_id):
    user = db.users.find_one({"_id": user_id})
    return user["preferences"] if user else None
