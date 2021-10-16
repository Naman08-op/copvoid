<template>
  <div>
    USERNAME: <input type="text" v-model="username" /> <br/>
    
    PASSWORD: <input type="password" v-model="password" /> <br/>
    Private Key: <input type="password" v-model="privateKey" /> <br/>
    Public Key: <input type="password" v-model="publicKey" /> <br/>
    <button @click="signup">signup</button>
    {{ error }}
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      password: '',
      privateKey:'',
      publicKey:'',
      error: '',
    }
  },
  methods: {
    signup() {
      let newUser = {
        username: this.username,
        password: this.password,
        publicKey: this.publicKey,
        privateKey: this.privateKey
      }
      axios.post('http://localhost:3000/cryptochat/signup', newUser)
        .then(res => {
          this.error = '';
          console.log(res.status)
          this.$router.push('/login');
        }, err => {
          console.log(err.response)

          this.error = err.response.data.error
        })
    }
  }
}
</script>
