<template>
    <div>
        <v-container fluid class="pa-0 ma-0">
        
<!-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- INITIAL SETUP - NO DATA  -->
<!-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            <v-row dense justify="center" align="center" v-if="gid == ''">
                <v-col cols="12" sm="6" md="4">
                    <v-chip outlined pill class="title font-weight-bold mt-1" color="info">
                        INTIAL SETUP
                    </v-chip>
                </v-col>
            </v-row>
            <v-row dense justify="center" align="center" v-else>
<!-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- PANEL 1  -->
<!-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                <v-col cols="12" sm="6" md="8">
                    <v-card hover height="100%" shaped outlined class="pa-0 ma-0">
                            <v-container fluid class="py-0">
                                <v-row justify="center" >
                                    <v-col cols="12" align="start" class="pt-1 d-flex justify-space-between">
                                        <v-chip outlined pill class="title font-weight-bold mt-1" color="success">
                                            NOTIFICATIONS
                                        </v-chip>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-card v-if="filteredNotifications.length > 0">
                                            <template v-for="(item, i) in filteredNotifications">
                                                <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
                                                <v-list-item three-line :key="`${i}-${item.nid}`" class="mx-0 px-1" @click="goto(item.url)">
                                                    <v-list-item-action class="pl-1 pr-0 mx-0">
                                                        <!-- ITEM CHECK BOX -->  
                                                        <v-checkbox 
                                                            v-model="item.read" 
                                                            :color="item.read && 'teal' || 'primary'" 
                                                            @change="toggleCheck(item)">
                                                        </v-checkbox>
                                                    </v-list-item-action>
                                                    <v-list-item-content class="px-2 my-0 d-flex" >
                                                        <v-list-item-title class="mx-0 px-0 d-flex " :class="textColor(item)">
                                                            <span class="title grow">{{item.title}}</span>
                                                            <span class="caption d-flex justify-center align-center">{{ convertTimeStamp(item.createdOn) }}</span>
                                                        </v-list-item-title>
                                                        <v-list-item-subtitle class="d-flex" :class="textColor(item)">
                                                            <span class="subheading grow">{{ item.description }}</span>
                                                        </v-list-item-subtitle>
                                                        <v-list-item-subtitle class="teal--text">
                                                            <div class="d-none d-sm-flex d-flex">
                                                                <span class="caption grow align-self-center">{{ displayNameByUid(item.uidBy) }}</span>
                                                                <span class="caption yellow--text"> {{item.moduleName}} Module </span>
                                                            </div>
                                                            <v-chip class="ma-0 hidden-sm-and-up" color="teal darken-4" text-color="white">
                                                                <v-avatar left :color="avatarColor(item.uidBy)">{{userInitials(item.uidBy)}}</v-avatar>
                                                                {{item.moduleName}}
                                                            </v-chip>
                                                        </v-list-item-subtitle>
                                                   
                                                    </v-list-item-content>
                                                    <v-spacer class="flex-grow-0"></v-spacer>
                                                    <!-- TOGGLE PRIORITY -->  
                                                    <v-btn icon @click="deleteNotification(item)">
                                                        <v-icon color="red">mdi-delete-outline</v-icon>
                                                    </v-btn>
                                                
                                                </v-list-item>
                                            </template>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                    </v-card>
                </v-col>


        </v-row>
        </v-container>

        <bot-nav-component>
        </bot-nav-component>

    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- SNACKBAR -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->  
        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" top>
            {{ snackbarText }}
            <v-btn  color="white" text @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
       
    </div>
</template>

<script>
import BotNavComponent from '@/components/BotNavComponent.vue'
import * as moment from 'moment'

let sortBy = require('lodash/sortBy')
let split = require('lodash/split')
let map = require('lodash/map')

export default {
    middleware : [],
    components: {BotNavComponent},
    layout : 'default',
    data: () => ({
        fixed: false,
        items: [],
        snackbar: false,
        snackbarText: '',
        snackbarColor: '',
    }),//DATA
    async asyncData({store}){
        return{
            
        }//RETURN
    },//ASYNC DATA
    async fetch({store}){
      
    },
    created(){
      
    
    },//CREATED
    mounted(){
      
    },//MOUNTED
    watch: {
     
    },//WATCH
    computed:{
        gid(){
            return this.$store.getters.gid
        },
        filteredNotifications(){
            this.items = this.$store.getters[`notifications/list`]
            return sortBy(this.items,['createdOn'])
        }
    },//COMPUTED
    methods:{
        userInitials(uid){
            let name = uid != "" ? this.$store.getters.displayNameByUid(uid) : ""
            let arr = name != "" ? split(name, " ") : "John Doe"
            return map(arr, x =>{
              return x.charAt(0)
            }).join('')
        },
        avatarColor(uid){
                return this.$store.getters.colorByUid(uid)
        },
        deleteNotification(item){
            this.$store.dispatch('notifications/deleteItem', item)
            if(this.$store.getters[`notifications/status`] == 'success'){
                this.snackbarText = `Notification Item deleted`
                this.snackbarColor = 'success'
                this.snackbar = true
            }
        },
        toggleCheck(item){
            //console.log(item)
            //item.read = !item.read
            this.$store.dispatch('notifications/updateItem', item)
            //return item
        },
        textColor(item){
            return item.read == true ? 'teal--text' : 'blue--text'
        },
        convertTimeStamp(ts){
            let today = moment().format('YYYY-MM-DD')
            let created = moment(ts.seconds * 1000).format('YYYY-MM-DD')
            if(today === created){
                return moment(ts.seconds * 1000).format('h:mm a')
            }
            else{
                return moment(ts.seconds * 1000).format('MM-DD-YY')
            }
            
        },
        displayNameByUid(uid){
            return this.$store.getters.displayNameByUid(uid)
        },
        goto(path){
            this.$router.replace(path).catch(err => console.log(err) )
        }
    },//METHODS  
}//EXPORT DEFAULT
</script>

   