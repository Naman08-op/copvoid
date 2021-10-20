<template>
  <div>
     <br/>
   <div> <input
          class="input is-success"
          type="text"
          placeholder="Enter your username"
          required
          v-model="username"
        />
        </div>
        <br/>
        <div><input
          class="input is-success"
          type="password"
          placeholder="Setup a password"
          required
          v-model="password"
        />
        </div>
        <br/>
   <div> <button class="button is-link" @click="signup">
          Create Account
        </button>
        </div>
  <br/>
  {{msg}}
  <br/>
    {{ error }}
    <br/>
    <input class="button is-link" @click="download" type="button" id="dwn-btn" value="Download dynamically generated key file"/>
  </div>
</template>
<script>
var FileSaver = require('file-saver');
import axios from 'axios';
export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      password: '',
      signfile:'',
      error: '',
      msg:''
    }
  },
  methods: {
    signup() {
      let newUser = {
        username: this.username,
        password: this.password,
      }
      axios.post('http://localhost:3000/copvoid/signup', newUser)
        .then(res => {
          this.error = '';
          console.log(res.status)
          console.log(res.data.public)
          console.log(res.data.private)
          console.log('Username   ',res.data.username)
          console.log('sign:-->   ',res.data.sign)
          
          this.signfile= res.data.sign
          this.msg='you can download secure key file from below'
          //this.$router.push('/login');

        }, err => {
          console.log(err.response)

          this.error = err.response.data.error
        })
    },
    download(){
      var file = new File([this.signfile], "KEY_FILE.txt", {type: "text/plain;charset=utf-8"});
FileSaver.saveAs(file);
this.$router.push('/login');
    }
  }
}
</script>
