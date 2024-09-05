# Server file

from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
from chatbot import setup_bot, ask_bot
import jsonify


def setup_server():
    print("Setting up bot")
    setup_bot()
    app = Flask(__name__)
    # app.config['CORS_HEADERS'] = 'Content-Type'
    # cors = CORS(app, resources={r"/ask": {"origins": "https://bot-server-cudlgu6y5q-wl.a.run.app"}})
    
    @app.route("/ping")
    def hello_world():
      return "pong"


    return app

app = setup_server()

@app.route("/ask", methods=["POST"])
# @cross_origin(origin="https://bot-server-cudlgu6y5q-wl.a.run.app", headers=['Content-Type', 'Authorization'])
def ask():
    """
      This will ask the quesiton to the bot by calling ask_bot API
    """
    data = request.get_json()
    msg = data["input"]
    session_id = data["session_id"]
    reply = ask_bot(msg, session_id)
    return {"reply": reply}

if __name__ == "__main__":
  #    app = create_app()
  print(" Starting app...")
  app.run(host="0.0.0.0", port=5000)