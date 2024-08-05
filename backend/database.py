# database.py

import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
import json
from dotenv import load_dotenv
from colorama import init, Fore, Style

init(autoreset=True)
load_dotenv()

firebase_config = json.loads(os.getenv("FIREBASE_CONFIG"))


def connect_to_firebase():
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(firebase_config)
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        print(
            f"{Fore.GREEN}{Style.BRIGHT}Successfully connected to Firebase!{Style.RESET_ALL}"
        )
        return db
    except Exception as e:
        print(
            f"{Fore.RED}{Style.BRIGHT}Failed to connect to Firebase: {e}{Style.RESET_ALL}"
        )
        return None


def create_user(email, password):
    try:
        user = auth.create_user(email=email, password=password)
        return user.uid
    except auth.EmailAlreadyExistsError:
        return None


def get_user_by_email(email):
    try:
        user = auth.get_user_by_email(email)
        return user.uid
    except auth.UserNotFoundError:
        return None


def save_user_preferences(user_id, preferences):
    db = firestore.client()
    db.collection("users").document(user_id).set(
        {"preferences": preferences}, merge=True
    )


def get_user_preferences(user_id):
    db = firestore.client()
    user_doc = db.collection("users").document(user_id).get()
    if user_doc.exists:
        return user_doc.to_dict().get("preferences")
    return None
