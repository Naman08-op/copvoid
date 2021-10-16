<template>
  <div>
      <button class="button is-link" @click="logout">logout</button>
    <p>Hey</p>
    MESSAGE: <input type="text" v-model="message" /> <br />
    <button @click="handleSubmit">Send</button>
    <h1>Hello {{ username }}</h1>
    <h2>Your id is {{ id }}</h2>
    <div v-for="(item, i) in items" :key="item._id">
      {{ i + 1 }}
      {{ item.text }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SendMessage",
  data() {
    return {
      message: "",
      items: [],
    };
  },
  created() {
    if (sessionStorage.getItem("token") === null) {
      this.$router.push("/login");
    }
  },
  async mounted() {
    axios
      .get("http://localhost:3000/copvoid/coptexts", {
        headers: { token: sessionStorage.getItem("token") },
      })
      .then((res) => {
        this.username = res.data.user.username;
        this.items = res.data.user.todos;
        this.id = res.data.user.token;
      });
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async handleSubmit() {
      console.log("Text sent");
      console.log("Text: ", this.message);
      let textBody = JSON.stringify({
        _id: this.id,
        texts: [{ text: this.message }],
      });
      console.log(textBody);
      axios
        .post("http://localhost:3000/copvoid/sendmsg", textBody, {
          headers: { "content-type": "application/json" },
        })
        .then((res) => {
          window.location.reload();
          this.items = res.data.user.texts;
          (this.addedText = res.data.result), console.log(this.addedText);
          this.message = " ";
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style></style>
