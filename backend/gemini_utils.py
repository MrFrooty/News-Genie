# gemini_utils.py

import os
from google.generativeai import GenerativeModel
import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = GenerativeModel("gemini-pro")


def print_prompt(prompt):
    print("\n--- Prompt ---")
    print(prompt)
    print("--- End of Prompt ---\n")


def generate_content(prompt):
    print_prompt(prompt)
    response = model.generate_content(prompt)
    return response.text
