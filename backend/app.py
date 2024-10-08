# app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import logging
import sys
import json
from datetime import timedelta
from database import (
    connect_to_firebase,
    create_user,
    get_user_by_email,
    save_user_preferences,
    get_user_preferences,
    get_user_by_id,
    delete_all_users,
)
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    verify_jwt_in_request,
    unset_jwt_cookies,
)
from werkzeug.security import check_password_hash
from news_analyzer import summarize_news, generate_headlines
from news_fetcher import fetch_news

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
port = os.getenv("PORT")

db = connect_to_firebase()

if db is None:
    raise Exception("Failed to connect to Firebase.")


def get_user_context():
    try:
        verify_jwt_in_request(optional=True)
        current_user = get_jwt_identity()
        if current_user:
            preferences = get_user_preferences(current_user)
            categories = preferences.get("categories", [])
            news_outlets = preferences.get("news_outlets", [])
            context = {"categories": categories, "news_outlets": news_outlets}
            logger.info(f"User context retrieved: {context}")
            return context
        else:
            logger.info("No user context available (user not authenticated)")
    except Exception as e:
        logger.error(f"Error retrieving user context: {str(e)}")
    return {"categories": [], "news_outlets": []}


@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("first_name")

    if not email or not password or not first_name:
        return jsonify({"error": "Email, password, and first name are required"}), 400

    user_id = create_user(email, password, first_name)
    if user_id is None:
        return jsonify({"error": "Email already exists"}), 400

    save_user_preferences(user_id, {"categories": [], "news_outlets": []})
    return jsonify({"message": "User registered successfully"}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = get_user_by_email(email)
    if user is None:
        return jsonify({"error": "Invalid email or password"}), 401

    if not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    expires = timedelta(hours=1)
    access_token = create_access_token(identity=user["uid"], expires_delta=expires)
    return jsonify(access_token=access_token, first_name=user["first_name"]), 200


@app.route("/api/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"message": "Successfully logged out"})
    unset_jwt_cookies(response)
    return response, 200


@app.route("/api/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user_data = get_user_by_id(current_user)
    if user_data:
        return jsonify(user_data), 200
    return jsonify({"error": "User not found"}), 404


@app.route("/api/preferences", methods=["PUT"])
@jwt_required()
def update_preferences():
    current_user = get_jwt_identity()
    data = request.json
    preferences = {
        "categories": data.get("categories", []),
        "news_outlets": data.get("news_outlets", []),
    }
    save_user_preferences(current_user, preferences)
    return jsonify({"message": "Preferences updated successfully"}), 200


@app.route("/api/summarize_news", methods=["POST"])
def summarize_news_route():
    data = request.json
    article_text = data.get("article_text", "")
    summary = summarize_news(article_text)
    return jsonify({"summary": summary})


@app.route("/api/generate_headlines", methods=["POST"])
def generate_headlines_route():
    data = request.json
    topic = data.get("topic", "")
    user_context = get_user_context()
    logger.info(f"Generating headlines for topic: {topic}")
    logger.info(f"User context used: {user_context}")
    headlines = generate_headlines(topic, user_context)
    return jsonify({"headlines": headlines})


@app.route("/api/fetch_news", methods=["POST"])
def fetch_news_route():
    data = request.json
    topic = data.get("topic", "")
    user_context = get_user_context()
    logger.info(f"Fetching news for topic: {topic}")
    logger.info(f"User context used: {user_context}")
    news_items = fetch_news(topic, user_context)
    return jsonify({"news_items": json.loads(news_items)})


@app.route("/api/delete_all_users", methods=["POST"])
def delete_all_users_route():
    try:
        delete_all_users()
        return jsonify({"message": "All users deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete users: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", port))
    app.run(host="0.0.0.0", port=port, debug=True)
