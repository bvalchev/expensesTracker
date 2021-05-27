import React, {Component} from 'react'
import {Launcher} from 'react-chat-window'
import io from 'socket.io-client'
const socket = io.connect('http://localhost:5000', {
  secure: true,
  origins: "http://localhost:5000"
});

 
class ChatComponent extends Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
    };
  }

  componentDidMount() {
    socket.on("new message", function (response) {
      let username = JSON.parse(localStorage.getItem("currentUser")).user
        .username;
      let message = response.msg;
      if (response.author !== username) {
        this.setState({
          messageList: [
            ...(this.state ? this.state.messageList : []),
            {
              author: response.author,
              type: "text",
              data: { message },
            },
          ]
        });
      }
    });
  }

  _onMessageWasSent(message) {
    let username = JSON.parse(localStorage.getItem("currentUser")).user
      .username;
    this.setState({
      messageList: [...(this.state ? this.state.messageList : []), message],
    });
    socket.emit("send message", {
      author: username,
      type: "text",
      data: { message },
    });
  }

  // _sendMessage(text) {
  //   let username = JSON.parse(localStorage.getItem('currentUser')).user.username;

  //   socket.on( 'new message', function (response) {
  //     let username = JSON.parse(localStorage.getItem('currentUser')).user.username;
  //     let message = response.msg;
  //     if(response.author !== username)
  //     this.setState({
  //       messageList: [...this.state.messageList, {
  //         author: response.author,
  //         type: 'text',
  //         data: { message }
  //       }]
  //     })
  //   })
  // }

  render() {
    return (
      <div>
        <Launcher
          agentProfile={{
            teamName: "Support",
            imageUrl: "../Chat/ChatImage.png",
          }}
          onMessageWasSent={this._onMessageWasSent.bind(this)}
          messageList={this.state.messageList}
          showEmoji
        />
      </div>
    );
  }
}

export default ChatComponent;