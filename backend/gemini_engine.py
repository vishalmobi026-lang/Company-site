import json
import random
import os

from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)
model = genai.GenerativeModel("gemini-flash-latest")


def generate_ai_questions(topic):

    prompt = f"""
    Generate 30 unique MCQ quiz questions about {topic}.

    Return ONLY a valid JSON array. No markdown, no explanation, no extra text.

    Format:

    [
      {{
        "question": "Question here",
        "options": [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        "correct": 0
      }}
    ]

    Rules:
    - "correct" must be the index (0, 1, 2, or 3) of the correct option.
    - All questions must be unique.
    - Do NOT repeat questions.
    - Return exactly 30 questions.
    """

    response = model.generate_content(prompt)

    text = response.text.strip()

    # REMOVE MARKDOWN
    text = text.replace("```json", "")
    text = text.replace("```", "")

    questions = json.loads(text)

    random.shuffle(questions)

    return questions