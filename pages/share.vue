<template>
    <div>
        <v-row justify="center" class="pa-0 ma-0">
            <v-col cols="12" md="6">
                <v-toolbar dense flat color="teal--darken-2">
                   
                    <v-icon color="yellow">mdi-share-variant</v-icon>
                    <v-spacer></v-spacer>
                    <v-toolbar-title class="green--text">
                        <v-chip outlined pill class="title font-weight-bold green--text mt-1" color="success">
                            SHARE GROUP
                        </v-chip>
                    </v-toolbar-title>
                    
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card>
                    <v-card-text class="pa-2">
                        <v-autocomplete 
                            v-model="selectedModule" 
                            placeholder="Select Module to share"
                            label = "Module"
                            :items="filteredModules"
                            item-text="name"
                            return-object
                            hide-details
                            class="pb-4 px-3"
                        >
                        </v-autocomplete>
                        <v-autocomplete 
                            v-model="selectedGroup" 
                            placeholder="Select Group to share"
                            label = "Group"
                            :items="filteredGroups"
                            item-text="name"
                            return-object
                            hide-details
                            class="pb-4 px-3"
                            v-if="selectedModule != ''"
                        >
                        </v-autocomplete>

                        <v-text-field 
                            prepend-icon="mdi-email"
                            v-model="email" 
                            placeholder="Enter email of user to share with"
                            clearable
                            :rules="[rules.email]"
                            :append-outer-icon=" rules.email(email) == true ? 'mdi-plus' : ''"
                            @click:append-outer="addUser(), sheet = false"
                            v-if="isAdmin"
                            class="px-2"
                        ></v-text-field>

                        <v-list v-if="usersList.length > 0" class="py-0">
                            <v-subheader>The {{selectedModule.name}} module is shared with : </v-subheader>
                            <v-list-item v-for="(item,i) in usersList" :key="i + 'ul'" class="px-0 mx-0">
                                <v-list-item-avatar>
                                    <v-icon>mdi-account</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title class="py-0 d-flex justify-center align-center">
                                        <span class="grow">{{item.displayName}}</span>
                                        <v-switch 
                                            v-model="isUser" 
                                            inset 
                                            color="purple"
                                            @change="toggleUserRole(item)"
                                            v-if="isAdmin"
                                        ></v-switch>
                                        <span>{{item.role}}</span>
                                       
                                    </v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn icon @click="deleteUser(item)" v-if="isAdmin">
                                        <v-icon color="red">mdi-delete</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>

                        <v-alert v-else dense outlined :type="isAdmin ? 'info' : 'warning'" class="px-2">
                             <span v-if="isAdmin">
                                 <strong> {{this.selectedGroup.name}} </strong> has not been shared 
                             </span>
                             <span v-else>
                                 You do not have admin rights to share <strong> {{this.selectedGroup.name}} </strong>
                             </span>
                        </v-alert>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <bot-nav-component>
        </bot-nav-component>

         <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
            {{ snackbarText }}
            <v-btn  color="white" text @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import {db, fireAuth} from '~/plugins/firebase.js'
import firebase from '~/plugins/firebase.js'
import * as modules from '@/data/modulesData' 
import BotNavComponent from '@/components/BotNavComponent.vue'
import Swal from 'sweetalert2'

let orderBy = require('lodash/orderBy')
let map = require('lodash/map')
let find = require('lodash/find')
let split = require('lodash/split')
let join = require('lodash/join')
let includes = require('lodash/includes')

export default {
    middleware : ['loadGroups'],
    components: {BotNavComponent},
    layout : 'default',
    data: () => ({
        selectedGroup : '',
        selectedModule: '',
        snackbar: false,
        snackbarText : '',
        snackbarColor : '',
        email : '',
        rules: {
            email: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
            }//EMAIL RULE
        },//RULES
        isUser: true
    }),//DATA
    async asyncData({store,params}){
        let arrModules = modules.data
        let moduleType = arrModules[0].name
        let arr = store.getters['groups/listByType'](store.getters['uid'],moduleType)
        console.log('ASYNCDATA - SHARE')
        return{
            uid : store.getters['uid'],
            selectedGroup : arr[0],
            selectedModule : arrModules[0]
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
        isAdmin(){
            //console.log('isAdmin')
            //console.log(this.selectedGroup)
            //return includes(this.selectedGroup.admins, this.uid)
            return this.$store.getters['groups/isAdmin'](this.selectedGroup.gid, this.uid)
        },
        filteredModules(){
            let arr = modules.data
            return arr.filter(item => item.status == 'complete')
        },
        filteredGroups(){
            return orderBy(this.$store.getters['groups/listByType'](this.uid, this.selectedModule.name),['name'],['asc'])
        
        },//FILTERED GROUPS
        usersList(){
            let list = this.$store.getters['groups/listByGid'](this.selectedGroup.gid)

            //let usersArr = list.users
            //let adminsArr = list.admins
           
            let userArr = []
            let adminArr = []
            
            map(list, item => {
                map(item.users, uid => {
                    if(uid != this.uid){
                        userArr.push({
                            displayName : this.$store.getters['displayNameByUid'](uid),
                            uid : uid,
                            role: 'user'
                        })
                    }
                })
            })

            map(list, item => {
                map(item.admins, uid => {
                    if(uid != this.uid){
                        adminArr.push({
                            displayName : this.$store.getters['displayNameByUid'](uid),
                            uid : uid,
                            role: 'admin'
                        })
                    }
                })
            })

            return userArr.concat(adminArr)

        },//USERS LIST
      
    },//COMPUTED
    methods:{
        toggleUserRole(user){
            let payload = {
                gid: this.selectedGroup.gid,
                uid: user.uid,
                type: this.selectedModule.name,
                role: user.role == 'user' ? 'admin' : 'user'
            }
            
            this.$store.dispatch('groups/toggleUserRole',payload)
        },
        async addUser(){
            let group = this.selectedGroup
            let module = this.selectedModule
            let query = await db.collection("users").where("email","==", this.email).get()
            let usersItems = []
            let uid = ''
            let displayName = ''
            if(!query.empty){
                query.forEach((doc) => {
                    uid = doc.data().uid
                    displayName = doc.data().displayName
                })
                
                let payload = {
                    uid: uid,
                    gid: this.selectedGroup.gid,
                    type: module.name
                }
                this.$store.dispatch('groups/addUser',payload)

                let group = this.$store.getters['groups/nameByGid'](this.selectedGroup.gid)
                let by = this.$store.getters['displayNameByUid'](this.uid)

                this.$store.dispatch('notifications/addItem',{
                    moduleName : this.selectedModule.name,    
                    nid: Math.random().toString(24),
                    gid : this.selectedGroup.gid,
                    title: `${this.selectedModule.name} Shared group`,
                    description: `You have been added to ${group} by ${by}`,
                    read: false,
                    url: `/${this.selectedModule.name}/${this.selectedGroup.gid}`,
                    uidTo : payload.assigned,
                    uidBy : this.state.user.uid
                })
                
                this.snackbarText = `${displayName} successfully added to ${group.name}`
                this.snackbarColor = 'success'
                this.snackbar = true
            }
            else{
                let email = this.email
                this.snackbarText = `${email} not found in database`
                this.snackbarColor = 'error'
                this.snackbar = true
            }
            this.email = ""
        },
        
        deleteUser(item){
            let payload = {
                uid : item.uid,
                gid : this.selectedGroup.gid,
                type: this.selectedModule,
            }

            Swal.fire({
                icon: 'warning',
                title: 'Test',
                text: `${this.selectedModule} `,
            })

            //CHECK ASSIGNMENT FOR USER TO DELETE
            if(this.selectedModule = 'teams'){
                let count = this.$store.getters[`${this.selectedModule}/assignedCountByUid`](item.uid)
                let assignedDisplayName = this.$store.getters['displayNameByUid'](item.uid)
                if(count > 0){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Unable to delete',
                        text: `Currently ${count} tasks assigned to ${assignedDisplayName}`,
                    })
                }//CANNOT DELETE : COUNT > 0
                else{
                    this.$store.dispatch('groups/deleteUser',payload)

                    let group = this.$store.getters['groups/nameByGid'](this.selectedGroup.gid)
                    let by = this.$store.getters['displayNameByUid'](this.uid)
                    this.$store.dispatch('notifications/addItem',{
                        uid: item.uid,
                        type: this.selectedModule,
                        description:`You have been removed from ${group} by ${by}`,
                        nid: Math.random().toString(24)
                    })

                    this.snackbarText = `User successfully unshared from ${group}`
                    this.snackbarColor = 'success'
                    this.snackbar = true
                }//DELETE : COUNT == 0
            }//IF SELECTEDMODULE == TEAMS

        },//DELETE USER/ADMIN
     
    },//METHODS  
}//EXPORT DEFAULT
</script>

   