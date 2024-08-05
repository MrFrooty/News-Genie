# app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from database import (
    connect_to_firebase,
    create_user,
    get_user_by_email,
    save_user_preferences,
    get_user_preferences,
)
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from google.generativeai import GenerativeModel
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

db = connect_to_firebase()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = GenerativeModel("gemini-pro")

if db is None:
    raise Exception("Failed to connect to Firebase.")


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user_id = create_user(email, password)
    if user_id is None:
        return jsonify({"error": "Email already exists"}), 400

    save_user_preferences(user_id, {"categories": [], "news_outlets": []})
    return jsonify({"message": "User registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user_id = get_user_by_email(email)
    if user_id is None:
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user_id)
    return jsonify(access_token=access_token), 200


@app.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    preferences = get_user_preferences(current_user)
    return jsonify(preferences), 200


@app.route("/preferences", methods=["PUT"])
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


@app.route("/summarize_news", methods=["POST"])
def summarize_news():
    data = request.json
    article_text = data.get("article_text", "")

    prompt = f"Summarize the following news article in 3-4 sentences:\n\n{article_text}"
    response = model.generate_content(prompt)

    return jsonify({"summary": response.text})


@app.route("/generate_headlines", methods=["POST"])
def generate_headlines():
    data = request.json
    topic = data.get("topic", "")

    prompt = f"Generate 5 catchy news headlines about {topic}"
    response = model.generate_content(prompt)

    headlines = response.text.split("\n")
    return jsonify({"headlines": headlines})


if __name__ == "__main__":
    app.run(debug=True)
