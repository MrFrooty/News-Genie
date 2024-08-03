from pymongo import MongoClient
import os
from dotenv import load_dotenv
from colorama import init, Fore, Style

init(autoreset=True)
load_dotenv()

database_uri = os.getenv("MONGODB_URI")
user = os.getenv("MONGODB_USER")
password = os.getenv("MONGODB_PASSWORD")

uri = f"mongodb+srv://{user}:{password}@{database_uri}/?retryWrites=true&w=majority&appName=Dev"

client = MongoClient(uri)
db = client["news_aggregator"]


def connect_to_db():
    try:
        client.admin.command("ping")
        print(
            f"{Fore.GREEN}{Style.BRIGHT}Successfully connected to the database!{Style.RESET_ALL}"
        )
        return db
    except Exception as e:
        print(
            f"{Fore.RED}{Style.BRIGHT}Failed to connect to the database: {e}{Style.RESET_ALL}"
        )
        return None


# ... (rest of the database.py content)


def save_user_preferences(user_id, preferences):
    db.users.update_one(
        {"_id": user_id}, {"$set": {"preferences": preferences}}, upsert=True
    )


def get_user_preferences(user_id):
    user = db.users.find_one({"_id": user_id})
    return user["preferences"] if user else None
