# Server file

from flask import Flask, request
from chatbot import setup_bot, ask_bot


def setup_server():
    print("Setting up bot")
    setup_bot()
    app = Flask(__name__)
    return app

app = setup_server()

@app.route("/ask", methods=["POST"])
def ask():
    """
      This will ask the quesiton to the bot by calling ask_bot API
    """
    data = request.get_json()
    msg = data["input"]
    reply = ask_bot(msg)
    return {"reply": reply}
