import os
import sys
import random
import eventlet
from flask_cors import CORS
from datetime import datetime, timedelta
from flask import Flask, render_template, request, make_response, jsonify
from flask_socketio import SocketIO, emit, join_room, rooms, send

from pymongo import MongoClient

eventlet.monkey_patch(socket=True)

# export FLASK_ENV=development
# export FLASK_APP=chat

# Initialize all
# flask
app = Flask(__name__)
app.config["SECRET_KEY"] = "test"
CORS(app)

#ROOT_PATH = os.environ["ROOT_PATH"]

# mongoDB
mongo_client = MongoClient("mongodb://localhost:27017/test")
app_db = mongo_client.expensesDatabase

# socketIO
socketio = SocketIO(cors_allowed_origins="*", async_mode='eventlet')
socketio.init_app(app)


# @app.route(ROOT_PATH)
# def load_index():
#     return render_template("index.html")


# @app.route(ROOT_PATH + "chat")
# def load_chat():
#     return render_template("chat.html")


# @app.route(ROOT_PATH + "rooms/<string:username>", methods=["GET"])
# def get_rooms(username):
#     users = app_db.users
#     user = user_collection.find_one({"username": username})
#     return make_response(jsonify({"rooms": user.get("rooms")}), 200)


# @socketio.on("userconnect")
# def user_connect(userinfo):
#     # get user role and id from jwt token
#     print("User is connecting...")
#     username = userinfo["username"]
#     role = userinfo["role"]
    
#     user_collection = chat_db.users
#     user = user_collection.find_one({"username": username})
#     if user:
#         user_collection.update_one(
#             {"username": username},
#             {"$set": {"connected": True}}
#         )

 
@socketio.on("join support")
def join_chat(userinfo):
    if isinstance(userinfo, dict):
        username = userinfo["username"].split('=')[1]
    else:
        username = userinfo
        
    users = app_db.users
    user = users.find({"username": username})
    if user:
        emit("connection", {"status": "200"}) # connected_users.count()})
    else:
        emit("connection", {"status": "404"})

 
@socketio.on("send message")
def new_message(message_info):
    print("New message: ", message_info)
    author = message_info["author"]
    msg = message_info["data"]["message"]["data"]
    
    emit("new message", {"msg": msg, "author": author}, broadcast=True) 


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port="5000")
