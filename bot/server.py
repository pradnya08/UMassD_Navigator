# Server file

from flask import Flask, request, Response
from chatbot import setup_bot, ask_bot
import jsonify


def setup_server():
    print("Setting up bot")
    setup_bot()
    app = Flask(__name__)

    # Error 404 handler
    @app.errorhandler(404)
    def resource_not_found(e):
      return jsonify(error=str(e)), 404
    # Error 405 handler
    @app.errorhandler(405)
    def resource_not_found(e):
      return jsonify(error=str(e)), 405
    # Error 401 handler
    @app.errorhandler(401)
    def custom_401(error):
      return Response("API Key required.", 401)
    
    @app.route("/ping")
    def hello_world():
      return "pong"


    return app

app = setup_server()

@app.route("/ask", methods=["POST"])
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