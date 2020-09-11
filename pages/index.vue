<template>
<div>
  <app-bar-component path="login" name="Login"></app-bar-component>
  
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- TAGLINE + LOGIN/REGISTER/RESET DIALOG -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
  <v-row justify="center" align="center" class="section-one">
    <v-col cols="12" sm="8" md="6" justify="center" align="center" >
      <img src="/images/logo.png" width="200">
        <p class="display-3 font-weight-bold">RAPID LYST</p>
        <p class="body-2 red--text text--darken-3">A free webapp to manage tasks for virtually anything</p>
           <v-btn color="indigo" to="signup">Sign up</v-btn>
      </v-col>
  </v-row>

  <v-row justify="center" align="center" class="section-one colorOne">
    <v-col cols="12" sm="8" md="6" justify="center" align="center" >
      <p class="headline white--text">Create new group easily</p>
      <p class="body-1 white--text">Swipe left on each group to edit or delete it</p>
      <img src="/images/homeGroupView.png" width="300" height="500">
      {{isLoggedIn}}
    </v-col>
  </v-row>

  <v-row justify="center" align="center" class="section-one colorTwo">
    <v-col cols="12" sm="8" md="6" justify="center" align="center" >
      <p class="headline white--text">Add new task to group</p>
      <p class="body-1 white--text">Swipe left on each task to edit or delete it</p>
      <img src="/images/homeTaskView.png" width="300" height="500">
    </v-col>
  </v-row>

  <v-row justify="center" align="center" class="section-one colorThree">
    <v-col cols="12" sm="8" md="6" justify="center" align="center" >
      <p class="headline white--text">Share group with friend</p>
      <p class="body-1 white--text pb-0 mb-0">Click share icon and enter email address</p>
      <p class="caption teal--text py-0 my-0">(Friend must be a registered user)</p>
      <img src="/images/homeShareView.png" width="300" height="500">
    </v-col>
  </v-row>

  <v-row justify="center" align="center" class="section-one colorFour">
    <v-col cols="12" sm="8" md="6" justify="center" align="center" >
      <p class="headline white--text">Manage your shared groups</p>
      <p class="body-1 white--text">Select a group and delete user</p>
      <img src="/images/homeSettingView.png" width="300" height="500">
    </v-col>
  </v-row>

  <v-row justify="center" align="center" class="section-one">
    <v-col cols="12" sm="8" md="6" justify="center" align="center" >
      <p class="headline font-weight-bold">CORE FEATURES</p>
      <v-list>
        <v-list-item >
          <v-list-item-title class="green--text">Unlimited Groups</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title class="green--text">Unlimited Sharing</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title class="green--text">Manage shared users</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title class="green--text">Automatic list sorting</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title class="green--text">Filter list by priority</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title class="green--text">Inline editing</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title class="green--text">Installable Webapp</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
         <v-list-item>
          <v-list-item-title class="green--text">Offline usage</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title class="green--text">Live sync shared list</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title class="green--text">Realtime updates</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title class="green--text">Sharing notifications</v-list-item-title>
        </v-list-item>
      </v-list>
    
      <!-- <p class="d-flex justify-space-around">
        <v-card class="text-center px-0 mx-1 pb-2" min-width="150">
          <v-icon size="60" color="yellow" class="mt-3">mdi-clock-fast</v-icon>
          <v-card-text class="title red--text py-0">QUICK</v-card-text>
          <v-card-text class="body-2 teal--text py-0">Blazing fast input and edits</v-card-text>
        </v-card>
        <v-card class="text-center px-0 mx-1 pb-2" min-width="150">
          <v-icon size="60" color="yellow" class="mt-3">mdi-share-variant</v-icon>
          <v-card-text class="title red--text py-0">SHAREBALE</v-card-text>
          <v-card-text class="body-2 teal--text py-0">Unlimited collaborators</v-card-text>
        </v-card>
        <v-card class="text-center px-0 mx-1 pb-2" min-width="150">
          <v-icon size="60" color="yellow" class="mt-3">mdi-microphone-outline</v-icon>
          <v-card-text class="title red--text py-0">VOICE</v-card-text>
          <v-card-text class="body-2 teal--text py-0">Coming soon !!</v-card-text>
        </v-card>
      </p> -->
      </v-col>
  </v-row>

  <v-snackbar vertical v-model="snackbar" :timeout="timeout">
    <v-row dense justify="center" align="center">
      <v-col col="12">
        <p class="green--text text-center body-1">Install this webapp on your iphone :</p>
        <p class="green--text text-center body-1">Tap upload button below and Add to Homescreen</p> 
      </v-col>
    </v-row>
    
    <v-btn color="blue" text @click="snackbar = false">
      Close
    </v-btn>
  </v-snackbar>

  <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- FOOTER -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <v-footer color="teal darken-4">
      <v-row dense justify="center" align="center">
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>rapidlyst</strong>
      </v-col>
      </v-row>
    </v-footer>

  </div>
</template>

<script>
import {fireAuth} from '~/plugins/firebase.js'
import AppBarComponent from '@/components/AppBarComponent'

const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  //return /chrome/.test( userAgent );
  return /iphone|ipad|ipod/.test( userAgent );
}
// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

const appInstall = () => {
  if(
      (('standalone' in window.navigator) && !window.navigator.standalone) //IOS
      ||
      (!window.matchMedia('display-mode : standalone').matches) //ANDROID
    )
    {
      alert('Add to Homescreen')
    }
}

const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!')
  }
  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!')
  }
}

const registerServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
  return registration
}

const main = async () => {
  try{
    check();
    let registration = await registerServiceWorker()
    if(registration){
      console.log('SW is registered')
     }
  }
  catch(error){
    console.log('Service Worker ', error.message)
  }
}

if (process.browser) {
  main()
}


export default {
  middleware : [],
  components: {AppBarComponent},
  layout : 'landing',
  data: () => ({
      snackbar : false,
      timeout : 6000
  }),//DATA
  async asyncData({store}){
        return{
         
        }//RETURN
    },//ASYNC DATA
    async fetch({store}){
      
    },
    created(){
      //appInstall()
    },//CREATED
    mounted(){
      if (isIos() && !isInStandaloneMode()) {
          this.snackbar = true
      }
    },//MOUNTED
    watch: {
     
    },//WATCH
    computed:{
      async isLoggedIn(){
        await fireAuth.onAuthStateChanged(user => {
          if (user) {
            this.$store.dispatch('setUser', user)
          }
          else{
            this.$router.replace('/').catch(err => console.log(err) )
          }
        })
      }//IS LOGGED IN
    },//COMPUTED
    methods:{
     
    },//METHODS  
}
</script>

<style scoped>
.section-one{
  height : 100vh;
}
.colorOne{
  /* background-color: rgb(5,81,165); */
  background-color: rgb(33,150,243);
}
.colorTwo{
  /* background-color:rgb(145,199,75); */
  background-color: rgb(133,190,135);
}
.colorThree{
  /* background-color: rgb(246,104,32); */
  background-color: rgb(250,164,27);
}
.colorFour{
  /* background-color:rgb(1,171,134); */
  background-color: rgb(241,104,72);
}
.colorFive{
  background-color:rgb(1,171,134);
}
.colorSix{
  background-color :rgb(154,95,159);
}
.colorSeven{
  background-color :rgb(154,95,159);
}
.spacer{
  height : 50px;
}
</style>

