<template>
<div id="app">
    <div class="field">
      <label class="label">Username</label>
      <div class="control has-icons-left has-icons-right">
        <input
          class="input is-success"
          type="text"
          placeholder="Enter your username"
          required
          v-model="username"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="fas fa-check"></i>
        </span>
      </div>
      <p>{{ username }}</p>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control has-icons-left has-icons-right">
        <input
          class="input is-success"
          type="password"
          placeholder="Enter your secure password"
          required
          v-model="password"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="fas fa-check"></i>
        </span>
      </div>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" @click="handleSubmit()">Submit</button>
      </div>
    </div>
    <p class="help is-danger">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    handleSubmit() {
      console.log("Form Submitted");
      console.log("username: ", this.username);

      let user = {
        username: this.username,
        password: this.password,
      };
      axios.post("http://localhost:3000/copvoid/login", user).then(
        (res) => {
          if (res.status === 200) {
            sessionStorage.setItem("token", res.data.token);
            this.$router.push("/sendmessage");
          }
        },
        (err) => {
          console.log(err.response);
          this.username = "";
          this.password = "";
          this.error = err.response.data.error;
        }
      );
    },
  },
};
</script>

<style>
#app {
  margin: auto;
  margin-top: 3rem;
  max-width: 700px;
}
.icon {
  cursor: pointer;
}
</style>
