import React from 'react'
import {Launcher} from 'react-chat-window'
import io from 'socket.io-client'
const socket = io.connect('http://localhost:5000', {
  secure: true,
  origins: "http://localhost:5000"
});

 
class ChatComponent extends React.Component {
  socket;
  constructor() {
    super();
    this.socket = socket;
    this.handleNewMessageSocketResponse = this.handleNewMessageSocketResponse.bind(this);
    this.appendMessage = this.appendMessage.bind(this);

    this.state = {
      messageList: []
    };
    
  }

  
  componentDidMount(){
    this.handleNewMessageSocketResponse();
  }

  handleNewMessageSocketResponse() {
    this.socket.on( 'new message', (response) => this.appendMessage(response))
      
  }

  appendMessage(response) {
      let username = JSON.parse(localStorage.getItem('currentUser')).user.username;
      let message = response.msg;
      console.log(response)
      if(response.author !== username){
        console.log(((this.state || {}).messageList || []), {
          author: response.author,
          type: 'text',
          data: { message }
        })
        this.setState({
          messageList: [...((this.state || {}).messageList || []), {
            author: response.author,
            type: 'text',
            data: {...message }
          }]
        })
      }
  }

  _onMessageWasSent(message) {
    let username = JSON.parse(localStorage.getItem('currentUser')).user.username;
    this.setState({
      messageList: [...((this.state || {}).messageList || []), message]
    })
    this.socket.emit('send message', {
      author: username,
      type: 'text',
      data: { message
      }
    })
  }
 
  render() {
    return (<div>
      <Launcher
        agentProfile={{
          teamName: 'Support',
          imageUrl: '../Chat/ChatImage.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={((this.state || {}).messageList || [])}
        showEmoji
      />
    </div>)
  }
}

export default ChatComponent;