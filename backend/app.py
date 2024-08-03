from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from database import connect_to_db
from colorama import init, Fore, Style
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.security import generate_password_hash, check_password_hash
from google.generativeai import GenerativeModel
import google.generativeai as genai

init(autoreset=True)
app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

db = connect_to_db()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = GenerativeModel("gemini-pro")

if db:
    print(
        f"{Fore.GREEN}{Style.BRIGHT}Successfully connected to the database!{Style.RESET_ALL}"
    )
else:
    print(
        f"{Fore.RED}{Style.BRIGHT}Failed to connect to the database.{Style.RESET_ALL}"
    )


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if db.users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)
    user = {
        "email": email,
        "password": hashed_password,
        "preferences": {"categories": [], "news_outlets": []},
    }
    db.users.insert_one(user)

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email})
    if user and check_password_hash(user["password"], password):
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


@app.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user = db.users.find_one({"email": current_user}, {"_id": 0, "password": 0})
    return jsonify(user), 200


@app.route("/preferences", methods=["PUT"])
@jwt_required()
def update_preferences():
    current_user = get_jwt_identity()
    data = request.json
    categories = data.get("categories", [])
    news_outlets = data.get("news_outlets", [])

    db.users.update_one(
        {"email": current_user},
        {
            "$set": {
                "preferences.categories": categories,
                "preferences.news_outlets": news_outlets,
            }
        },
    )

    return jsonify({"message": "Preferences updated successfully"}), 200


@app.route("/delete_account", methods=["DELETE"])
@jwt_required()
def delete_account():
    current_user = get_jwt_identity()
    db.users.delete_one({"email": current_user})
    return jsonify({"message": "Account deleted successfully"}), 200


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
