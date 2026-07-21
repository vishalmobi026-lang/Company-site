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
    Generate 10 MCQ quiz questions about {topic}.
    
    IMPORTANT RESTRICTIONS:
    - Questions MUST be maximum 20 words. Be concise and clear.
    - Keep the options very brief (maximum 1-3 words). This is strictly required because they will be displayed on small animated game objects.

    Return ONLY JSON.

    Format:

    [
      {{
        "question": "Question here",
        "options": [
          "A",
          "B",
          "C",
          "D"
        ],
        "correct": 0
      }}
    ]

    correct = index number of correct answer.
    """

    response = model.generate_content(prompt)

    text = response.text.strip()

    # REMOVE MARKDOWN
    text = text.replace("```json", "")
    text = text.replace("```", "")

    questions = json.loads(text)

    random.shuffle(questions)

    return questions