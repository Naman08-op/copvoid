/** The core Vue instance controlling the UI */
const vm = new Vue({
  el: "#vue-instance",
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
  async created() {
    this.addNotification("Hello World");

    this.cryptWorker = new Worker("worker.js");

    this.originPublicKey = await this.getWebWorkerResponse("generate-keys");

    this.addNotification("keypair generated");
    // Initialize socket.io
    this.socket = io();
    this.setupSocketListeners();
    var PERMITTED_DOMAIN = "http://localhost:8081/login/";
/**
 * Receiving message from other domain
 */
window.addEventListener('message', function(event) {
    if (event.origin === PERMITTED_DOMAIN) {
        //var msg = JSON.parse(event.data);
        // var msgKey = Object.keys(msg)[0];
        if (event.data) {
            localStorage.setItem("localstorage", event.data);
        } else {
            localStorage.removeItem("localstorage");
        }
    }
});
  },
  methods: {
    /** Append a notification message in the UI */
    addNotification(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.notifications.push({ message, timestamp });
      this.autoscroll(this.$refs.notificationContainer)
    },
    /** Setup Socket.io event listeners */
    setupSocketListeners() {
      // Automatically join default room on connect
      this.socket.on("connect", () => {
        this.addNotification("Connected To Server.");
        this.joinRoom();
      });

      // Notify user that they have lost the socket connection
      this.socket.on("disconnect", () =>
        this.addNotification("Lost Connection")
      );

      // Display message when recieved
      this.socket.on("MESSAGE", async (message, signed) => {
        console.log(message.text," comes sign ",signed)
        if(message.recipient === this.originPublicKey){
          console.log(signed)
          message.text= await this.getWebWorkerResponse('verify',[message.text,signed,this.destinationPublicKey])

        }

        console.log(message.text,"--------------__------")
        this.addMessage(message);
      });
      // When a user joins the current room, send them your public key
      this.socket.on("NEW_CONNECTION", () => {
        this.addNotification("Another user joined the room.");
        this.sendPublicKey();
      });

      // Broadcast public key when a new room is joined
      this.socket.on("ROOM_JOINED", (newRoom) => {
        this.currentRoom = newRoom;
        this.addNotification(`Joined Room - ${this.currentRoom}`);
        this.sendPublicKey();
      });

      // Save public key when received
      this.socket.on("PUBLIC_KEY", (key) => {
        this.addNotification(
          `Public Key Received - ${this.getKeySnippet(key)}`
        );
        this.destinationPublicKey = key;
      });

      // Clear destination public key if other user leaves room
      this.socket.on("user disconnected", () => {
        this.notify(
          `User Disconnected - ${this.getKeySnippet(this.destinationKey)}`
        );
        this.destinationPublicKey = null;
      });
    },

    /** Send the current draft message */
   async sendMessage() {
      // Don't send message if there is nothing to send
      if (!this.draft || this.draft === "") {
        return;
      }

      // Use immutable.js to avoid unintended side-effects.
  let message = Immutable.Map({
    text: this.draft,
    recipient: this.destinationPublicKey,
    sender: this.originPublicKey,
   
  })

      // Reset the UI input draft text
      this.draft = "";
      

      // Instantly add message to local UI
      this.addMessage(message.toObject());

        if(this.destinationPublicKey){
          const signed = await this.getWebWorkerResponse(
            'sign',[message.get('text')]
          )
        console.log("signed text",signed,"finish")
      // Emit the message
      this.socket.emit("MESSAGE", message,signed);
      
   }},

    /** Join the chatroom */
    joinRoom() {
      this.socket.emit("JOIN");
    },

    /** Add message to UI */
    addMessage(message) {
      this.messages.push(message);
      this.autoscroll(this.$refs.chatContainer)
    },

    /** Post a message to the web worker and return a promise that will resolve with the response.  */
    getWebWorkerResponse(messageType, messagePayload) {
      return new Promise((resolve, reject) => {
        // Generate a random message id to identify the corresponding event callback
        const messageId = Math.floor(Math.random() * 100000);

        // Post the message to the webworker
        this.cryptWorker.postMessage(
          [messageType, messageId].concat(messagePayload)
        );

        // Create a handler for the webworker message event
        const handler = function (e) {
          // Only handle messages with the matching message id
          if (e.data[0] === messageId) {
            // Remove the event listener once the listener has been called.
            e.currentTarget.removeEventListener(e.type, handler);

            // Resolve the promise with the message payload.
            resolve(e.data[1]);
          }
        };

        // Assign the handler to the webworker 'message' event.
        this.cryptWorker.addEventListener("message", handler);
      });
    },
    /** Emit the public key to all users in the chatroom */
    sendPublicKey() {
      if (this.originPublicKey) {
        this.socket.emit("PUBLIC_KEY", this.originPublicKey);
      }
    },

    /** Get key snippet for display purposes */
    getKeySnippet(key) {
      return key.slice(400, 416);
    },
    autoscroll (element) {
      if (element) { element.scrollTop = element.scrollHeight }
    },
  },
});
