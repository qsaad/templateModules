<template>
    <div>
        <v-container style="max-width: 500px" class="mt-0 pt-0 scroll-y">
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- TOP BAR COMPONENT -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ --> 
            <group-top-component
                :moduleIcon="moduleIcon"
                :moduleName="moduleName"
                :search.sync="search"
                @onScrollChild="onScroll"
                @click="toTop"
                :fab="fab"
            ></group-top-component>
            <!-- <v-divider class="my-2"></v-divider>
                <data-read-component></data-read-component>
            <v-divider class="my-2"></v-divider> -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- ADD OR EDIT DIALOG BOX -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ --> 
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn 
                        v-show="!fab" 
                        fab 
                        dark
                        fixed
                        bottom
                        right
                        color="primary"
                        v-on="on"
                    >
                        <v-icon large>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-card color="#00695C">
                    <v-form v-model="valid">
                        <v-card-title class="px-3 py-2 ma-0">
                            <span class="headline white--text">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container class="px-2 py-0 ma-0">
                                <v-row>
                                    <v-col cols="12" class="pa-0 ma-0">
                                        <v-text-field 
                                            v-model="editedItem.name" 
                                            label="Enter new group name"
                                            solo
                                            hide-details
                                            clearable
                                            class="ml-2"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="copy()" v-if="isCopy" :disabled="!valid">Copy</v-btn>
                            <v-btn color="blue darken-1" text @click="save()" v-else :disabled="!valid">{{saveButtonText}}</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- LIST VIEW -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->    
            <v-card v-if="filteredGroups.length > 0">
                <template v-for="(group, i) in filteredGroups">
                    <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
                    <v-list-item :key="`${i}-${group.name}`">
                        <v-list-item-action  @click="gotoList(group)" class="d-flex xs-12 flex-grow-1"> 
                            <span class="blue--text d-flex xs-12 clickable" >{{group.name}}</span>
                        </v-list-item-action>
                        <v-spacer class="flex-grow-0"></v-spacer>
                        <group-action-component
                            v-if="isAdmin(group)"
                            :item="group"
                            @emitEditItem="editItem"
                            @emitCopyItem="copyItem"
                            @emitRemoveItem="remove"
                        ></group-action-component>
                    </v-list-item>
                </template>
            </v-card>
            <!-- <v-card v-else>
                <v-card-text class="title green--text">
                    No data available
                </v-card-text>
            </v-card> -->
        </v-container>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- FOOTER BUTTONS COMPONENT -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->  
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
    import {orderBy, map, find, split, join, upperCase, includes, filter, capitalize} from "lodash"
    import {groupCrudMixin} from '@/mixins/groupCrudMixin'
    import DataReadComponent from '@/components/DataReadComponent'
    import GroupTopComponent from '@/components/GroupTopComponent.vue'
    //import GroupBotComponent from '@/components/GroupBotComponent.vue'
    import GroupActionComponent from '@/components/GroupActionComponent.vue'
    import BotNavComponent from '@/components/BotNavComponent.vue'

    //SPEECH TO TEXT API
    // let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    // let recognition = SpeechRecognition? new SpeechRecognition() : false

    //const moduleName = 'tasks'

    export default {
        middleware : ['loadGroups'],
        components: {DataReadComponent, GroupTopComponent, GroupActionComponent, BotNavComponent},
        mixins : [groupCrudMixin],
        layout : 'default',
        data: () => ({
            fixed : false,
           
            //MOBILE SWIPING FEATURE
            swipedGroup : '',
          
            //SPEECH TO TEXT
            command : '',
            error : ''
        }),//DATA
        async asyncData({store, route}){
            console.log(`ASYNCDATA -  ${route.name}`)
            return{
                uid : store.getters['uid'],
                //mod: route.name,
                editedItem: {
                name: '',
                type: route.name
                },
                defaultItem: {
                    name: '',
                    type: route.name
                },
                
            }//RETURN
        },//ASYNC DATA
        async fetch({store}){
            
        },//FETCH
        created(){
            
        },//CREATED
        mounted(){
        
        },//MOUNTED
        watch: {
           
        },//WATCH
        computed:{
            isLoading(){
                //return this.$store.getters[`${this.moduleName}/isLoading`]
                return this.$store.getters[`${this.$route.name}/isLoading`]
            },
            isChrome(){
                const userAgent = window.navigator.userAgent.toLowerCase()
                
                return /chrome/.test( userAgent )
            },
            filteredGroups(){
                //this.items = orderBy(this.$store.getters['groups/listByType'](this.uid,`${this.moduleName}`),['name'],['asc'])
                this.items = orderBy(this.$store.getters['groups/listByType'](this.uid,`${this.$route.name}`),['name'],['asc'])
                if(this.search != ''){
                    let searchText = upperCase(this.search)
                    let arr = this.items
                    return arr.filter(item => includes(upperCase(item.name), searchText) )
                }
                else{
                    return this.items
                }
            },
            count(){
                return this.$store.getters['groups/count']
            },
        },//COMPUTED
        methods:{
            // speechCommand(){
            //     let SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
            //     let SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList

            //     let grammer = '#JSGF V1.0;'

            //     let recognition = new SpeechRecognition()
            //     if (!recognition) {
            //         this.error = 'Speech Recognition is not available on this browser. Please use Chrome or Firefox'
            //         return false
            //     }
            //     let speechRecognitionGrammarList = new SpeechGrammarList
            //     speechRecognitionGrammarList.addFromString(grammer, 1)
            //     recognition.grammers = speechRecognitionGrammarList
            //     recognition.lang = 'en-US'
            //     recognition.interimResults = false

            //     recognition.onresult = (event) =>{
            //         let last = event.results.length - 1
            //         console.log(event.results[last][0].transcript)
            //         this.command = event.results[last][0].transcript

            //         let [cmd, ...groupName] = split(this.command, " ")

            //         if(cmd == 'add' || 'at' || 'ad' || 'and'){
            //             this.group = groupName.length > 0 ? groupName.join(" ") : groupName[0]
            //             this.add()
            //         }
            //     }

            //     recognition.onspeechend = () =>{
            //         recognition.stop()
            //     }
                
            //     recognition.onerror = (event)=>{
            //         console.log('Speech Recognition Error ' + event.error)
            //     }

            //     recognition.start()

            // },
           
            swipeHandler(param){
                return (direction, event) => {
                    //console.log(direction, param)
                    direction == 'left' ? this.swipedGroup = param : this.swipedGroup = {}
                }
            },
        },//METHODS  
    }//EXPORT DEFAULT
</script>

<style scoped>
    .clickable{
        cursor: pointer;
    }
</style>

   