<template>
  <div>
    USERNAME: <input type="text" v-model="username" /> <br/>
    
    PASSWORD: <input type="password" v-model="password" /> <br/>
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
      error: '',
    }
  },
  methods: {
    signup() {
      let newUser = {
        username: this.username,
        password: this.password
      }
      axios.post('http://localhost:3000/copvoid/signup', newUser)
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
