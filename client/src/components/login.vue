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
        <button class="button is-link" @click="handleSubmit()">
          Login with Password
        </button>
      </div>
    </div>
    <label class="label">Or login by uploading KEY FILE</label>
    <div>
      
        <div class="file is-info has-name">
          <label class="file-label">
            <input
              class="file-input"
              type="file"
              ref="file"
              @change="readFile()"
            />
            <span class="file-cta">
             
              <span class="file-label">
                Upload Key File
              </span>
            </span>

            <span v-if="file" class="file-name">
              {{ file.name }}
            </span>
          </label>
        </div>
        <!-- <div>{{ content }}</div> -->
        <div class="field">
          <div class="control">
        <button class="button is-link" @click="sendFile()">
          Login with KEY FILE
        </button>
      </div>
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
      file: "",
      content: "",
      publickey: "",
      error: "",
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
            window.location = "http://localhost:3000/";
            localStorage.setItem("token", res.data.token);
            

            console.log(res.data.decrypted_text);
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
    selectFile() {
      this.file = this.$refs.file.files[0];
    },
    sendFile() {
      console.log("Form Submitted");
      console.log("username: ", this.username);

      let user = {
        username: this.username,
        file_content: this.content,
      };
      axios
        .post("http://localhost:3000/copvoid/file_authentication", user)
        .then(
          (res) => {
            if (res.status === 200) {
              localStorage.setItem("token", res.data.token);
              window.location = "http://localhost:3000/";
            }
          },
          (err) => {
            console.log(err.response);
            this.username = "";
            this.content = "";
            this.error = err.response.data.error;
          }
        );
    },
    readFile() {
      this.file = this.$refs.file.files[0];
      const reader = new FileReader();
      if (this.file.name.includes(".txt")) {
        reader.onload = (res) => {
          this.content = res.target.result;
          console.log(this.content)
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.file);
      } else {
        this.content = "Check the console for file input";
        reader.onload = (res) => {
          console.log(res.target.result);
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.file);

      }
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
