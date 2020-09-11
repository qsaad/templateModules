<template>
  <v-app dark>
    <!-- ++++++++++++++++++++++++++++++++++++++++ -->
    <!-- NAV SIDE BAR -->
    <!-- ++++++++++++++++++++++++++++++++++++++++ -->
    <!-- <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
     <!-- ++++++++++++++++++++++++++++++++++++++++ -->
    <!-- APP BAR -->
    <!-- ++++++++++++++++++++++++++++++++++++++++ -->
    <v-app-bar :clipped-left="clipped" dense fixed app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-text="title" /> -->
      
      <v-avatar size="30" tile >
            <img src="/images/logo.png">
        </v-avatar>
      <v-spacer />

      <!-- <v-btn icon to="/dashboard">
        <v-badge color="green" :content="notifications.length" overlap :value="notifications.length > 0">
            <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn> -->

      <!-- <v-menu open-on-click left offset-x top >
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-badge color="green" :content="notifications.length" overlap :value="notifications.length > 0">
                <v-icon>mdi-bell-outline</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-list>
            <v-list-item two-line dense v-for="(item, index) in notifications" :key="index" @click="notificationRead(item)">
              <v-list-item-avatar size="32" color="red" class="pa-0">
                {{ initials(item.by) }}
              </v-list-item-avatar>
                
              <v-list-item-content class="pa-0">
                <v-list-item-title class="green--text">{{ item.status }} <span class="yellow--text"> {{ item.group }}</span></v-list-item-title>
                <v-list-item-subtitle>
                  <v-row dense justify="start">
                    <v-col cols="6">with you on {{ timestampToDate(item.createdOn) }}</v-col>
                  </v-row>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-menu> -->

      <v-menu open-on-click left offset-x top >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar color="yellow--text title" size=36 v-on="on">
              {{ userInitials }} 
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="py-0 px-0 my-0 mx-0">
            <v-list-item dense v-for="(item, index) in actions" :key="index + 'mn'" @click="action(item.to)" class="mx-0 my-0 py-0 px-3">
              <v-list-item-action class="py-0 px-0 my-0 mx-0">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content class="py-0 px-0 my-0 ml-2 mr-0">
                <v-list-item-title class="text-left body-2">
                  {{item.title}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>

      <!-- <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <!-- <v-footer :fixed="fixed" app>
      <v-row dense justify="center" align="center">
        <v-col cols="12" align="center">
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-col>
      </v-row>
      
    </v-footer> -->
  </v-app>
</template>

<script>
  //import {map, split, startCase, filter} from "lodash"
  let map = require('lodash/map')
  let split = require('lodash/split')
  let startCase = require('lodash/startCase')
  let filter = require('lodash/filter')
  
  import * as moment from 'moment'

  export default {
    //middleware : ['auth','loadUsers','loadGroups','loadTasks','loadNotifications'],
    //middleware : ['auth','loadUsers','loadGroups','loadNotifications'],
    middleware : ['auth','loadNotifications'],
    components:{},
    mixins : [],
    data () {
      return {
        clipped: true,
        drawer: true,
        fixed: false,
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'RapidLyst',
      }//RETURN
    },//DATA
    async asyncData({store}){
      
      return{
        
      }//RETURN
    },//ASYN
    async fetch({store,params}){
        
    },//FETCH
    created(){
      
      
    },//CREATED
    mounted(){
       
    },//MOUNTED
    computed:{
      userInitials(){
        if(this.$store.state.user != null){
          let displayName = startCase(this.$store.getters.displayName)
          let arr = displayName != "" ? split(displayName, " ") : split("John Doe", " ")
          return map(arr, x =>{
              return x.charAt(0)
          }).join('')
        }
        else{
          return 'XX'
        }
      },//USERS INITIAL NAV
      items(){
        return [
          {icon: 'mdi-view-dashboard', title: 'Dashboard', to: '/dashboard'},
          {icon: 'mdi-folder-outline', title: 'Groups', to: '/tasks'},
          {icon: 'mdi-cog-outline', title: 'Setting', to: '/setting'},
        ]
      },
      notifications(){
        return filter(this.$store.getters['notifications/list'],{uid : this.$store.getters['uid']})
      },
      actions(){
        return [
          {icon : 'mdi-cog-outline', title:'Setting',  to:'setting'},
          {icon : 'mdi-logout', title:'Logout', to:'logout'}
        ]
        
      }
      
    },//COMPUTED
    methods:{
      fake(){

      },
      initials(name){
        let arr = name != "" ? split(name, " ") : split("John Doe", " ")
            return map(arr, x =>{
              return x.charAt(0)
            }).join('')
      },
      timestampToDate(ts){
            // console.log(ts)
            // console.log(ts.seconds)
            return moment(ts.seconds * 1000).format('MM-DD')
      },
      notificationRead(item){
          //this.$store.dispatch('notifications/delete',item)
          this.$store.dispatch('notifications/deleteItem',item)
      },
      action(value){
        if(value == 'setting'){
          this.$router.replace('/setting').catch(err => console.log(err) )
        }
        if(value == 'logout'){
          this.$store.dispatch('logout')
        }
      },
      // logout(){
      //   this.$store.dispatch('logout')
      // },//SIGNOUT
    }//METHODS
}
</script>
