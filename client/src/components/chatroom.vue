<template>
  <div>
      <div>Notification Log</div>
    <div v-for="notification in notifications" :key="notification">
      <div>{{ notification.timestamp }}</div>
      <div>{{ notification.message }}</div>

      <div v-for='message in messages' :key='message'>
          {{message}}
      </div>
      <div>
  <input class="message-input" type="text" placeholder="Message" v-model="draft" @keyup.enter="sendMessage()">
</div>
    </div>
  </div>
</template>

<script>

//import socket from "../socket.js"
export default {
    
  name: "ChatRoom",
  data() {
    return {
      cryptWorker: null,
      socket: null,
      originPublicKey: null,
      destinationPublicKey: null,
      messages: [],
      notifications: [],
      currentRoom: null,
      pendingRoom: Math.floor(Math.random() * 1000),
      draft: "",
    };
  },
  created() {
    this.addNotification("Hello User");
    
  //this.setupSocketListeners()
  },
  methods: {
    addNotification(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.notifications.push({ message, timestamp });
    },
    /** Setup Socket.io event listeners */
setupSocketListeners () {
  // Automatically join default room on connect
  this.socket.on('connect', () => {
    this.addNotification('Connected To Server.')
    this.joinRoom()
  })

  // Notify user that they have lost the socket connection
  this.socket.on('disconnect', () => this.addNotification('Lost Connection'))

  // Display message when recieved
  this.socket.on('MESSAGE', (message) => {
    this.addMessage(message)
  })
},

/** Send the current draft message */
sendMessage () {
  // Don't send message if there is nothing to send
  if (!this.draft || this.draft === '') { return }

  const message = this.draft

  // Reset the UI input draft text
  this.draft = ''

  // Instantly add message to local UI
  this.addMessage(message)

  // Emit the message
  this.socket.emit('MESSAGE', message)
},

/** Join the chatroom */
joinRoom () {
  this.socket.emit('JOIN')
},

/** Add message to UI */
addMessage (message) {
  this.messages.push(message)
},
  },
};
</script>
