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
      pendingRoom: Math.floor(Math.random() * 1000),
      draft: "",
    };
  },
  async created() {
    this.addNotification("Hello User");

    this.cryptWorker = new Worker("worker.js");

    this.originPublicKey = await this.getWebWorkerResponse("generate-keys");

    this.addNotification("keypair generated");
    this.socket = io();
    this.setupSocketListeners();
    
  },
  methods: {
    addNotification(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.notifications.push({ message, timestamp });
      this.autoscroll(this.$refs.notificationContainer)
    },
    setupSocketListeners() {
      this.socket.on("connect", () => {
        this.addNotification("Connected To Server.");
        this.joinRoom();
      });

      this.socket.on("disconnect", () =>
        this.addNotification("Lost Connection")
      );

      this.socket.on("MESSAGE", async (message, signed) => {
        console.log(message.text," comes sign ",signed)
        if(message.recipient === this.originPublicKey){
          console.log(signed)
          message.text= await this.getWebWorkerResponse('verify',[message.text,signed,this.destinationPublicKey])

        }

        console.log(message.text,"--------------__------")
        this.addMessage(message);
      });
      this.socket.on("NEW_CONNECTION", () => {
        this.addNotification("Another user joined the room.");
        this.sendPublicKey();
      });

      // this.socket.on("ROOM_JOINED", (newRoom) => {
      //   this.currentRoom = newRoom;
      //   this.addNotification(`Joined Room - ${this.currentRoom}`);
      //   this.sendPublicKey();
      // });

      this.socket.on("PUBLIC_KEY", (key) => {
        this.addNotification(
          `Public Key Received - ${this.getKeySnippet(key)}`
        );
        this.destinationPublicKey = key;
      });

      this.socket.on("user disconnected", () => {
        this.notify(
          `User Disconnected - ${this.getKeySnippet(this.destinationKey)}`
        );
        this.destinationPublicKey = null;
      });
    },

   async sendMessage() {
      if (!this.draft || this.draft === "") {
        return;
      }

  let message = Immutable.Map({
    text: this.draft,
    recipient: this.destinationPublicKey,
    sender: this.originPublicKey,
   
  })

      this.draft = "";
      

      this.addMessage(message.toObject());

        if(this.destinationPublicKey){
          const signed = await this.getWebWorkerResponse(
            'sign',[message.get('text')]
          )
        console.log("signed text",signed,"finish")
      this.socket.emit("MESSAGE", message,signed);
      
   }},

    joinRoom() {
      this.socket.emit("JOIN");
    },

    addMessage(message) {
      this.messages.push(message);
      this.autoscroll(this.$refs.chatContainer)
    },

    getWebWorkerResponse(messageType, messagePayload) {
      return new Promise((resolve, reject) => {
        const messageId = Math.floor(Math.random() * 100000);

        this.cryptWorker.postMessage(
          [messageType, messageId].concat(messagePayload)
        );

        const handler = function (e) {
          if (e.data[0] === messageId) {
            e.currentTarget.removeEventListener(e.type, handler);

            resolve(e.data[1]);
          }
        };

        this.cryptWorker.addEventListener("message", handler);
      });
    },
    sendPublicKey() {
      if (this.originPublicKey) {
        this.socket.emit("PUBLIC_KEY", this.originPublicKey);
      }
    },

    
    getKeySnippet(key) {
      return key.slice(400, 416);
    },
    autoscroll (element) {
      if (element) { element.scrollTop = element.scrollHeight }
    },
  },
});
