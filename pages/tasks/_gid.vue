<template>
    <div>
        <v-container style="max-width: 500px" class="mt-0 pt-0 scroll-y">
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- TOP BAR COMPONENT -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ --> 
            <list-top-component
                :path="groupPath(moduleName)"
                :moduleIcon="moduleIcon"
                :groupName="groupName"
                :gid="gid"
                :moduleName="moduleName"
                :search.sync="search"
                @onScrollChild="onScroll"
                @click="toTop"
                :fab="fab"
            >
                <template v-slot:listToggleButtons>
                    <v-list-item dense class="mx-0 my-0 py-0 px-3" @click="showPriority = !showPriority">
                        <v-list-item-action class="py-0 px-0 my-0 mx-0">
                            <v-icon color="orange" v-if="!showPriority">mdi-playlist-star</v-icon>
                            <v-icon color="orange" v-else>mdi-format-list-checkbox</v-icon>
                        </v-list-item-action>
                    </v-list-item>

                    <v-list-item dense class="mx-0 my-0 py-0 px-3"  @click="hideCompleted = !hideCompleted">
                        <v-list-item-action class="py-0 px-0 my-0 mx-0">
                            <v-icon :color="hideCompleted ? 'teal' : 'orange'">mdi-playlist-check</v-icon>
                        </v-list-item-action>
                    </v-list-item>
                    
                </template>
            </list-top-component>
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
                                            v-model="editedItem.text" 
                                            label="What do you want to do?"
                                            solo
                                            hide-details
                                            clearable
                                            class="ml-2"
                                            :append-icon="editedItem.priority ? 'mdi-star' : 'mdi-star-outline'"
                                            @click:append="toggleNewItemPriority"
                                        ></v-text-field>
                                        <div class="d-flex flex-row align-center caption teal--text">
                                            {{matchingItem}}
                                        </div>
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
<!-- DISPLAY COUNTERS IN DESKTOP VIEW ONLY -->             
            <v-row class="my-1" align="center" v-if="$vuetify.breakpoint.smAndUp">
                <strong class="mx-4 info--text text--darken-2">
                    Remaining: {{ remainingTasks }}
                </strong>
                <v-divider vertical></v-divider>
                <strong class="mx-4 info--text text--darken-2">
                    Priority: {{ priorityTasks }}
                </strong>
                <v-divider vertical></v-divider>
                <strong class="mx-4 success--text text--darken-2">
                    Completed: {{ completedTasks }}
                </strong>
                <v-spacer></v-spacer>
                <v-progress-circular :value="progress" color="red" class="mr-4" v-if="items.length > 0"></v-progress-circular>
            </v-row>
            <v-divider class="my-2" v-if="$vuetify.breakpoint.smAndUp"></v-divider>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- LIST VIEW -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->            
            <v-card v-if="filteredTasks.length > 0">
                <template v-for="(task, i) in filteredTasks">
                    <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
                    <!-- <v-list-item :key="`${i}-${task.text}`" v-touch:swipe="swipeHandler(task)" class="mx-0 px-1"> -->
                    <v-list-item :key="`${i}-${task.text}`" class="mx-0 px-1">
                        <v-list-item-action class="pl-1 pr-0 mx-0">
                            <!-- ITEM CHECK BOX -->  
                            <v-checkbox 
                                v-model="task.done" 
                                :color="task.done && 'teal' || 'primary'" 
                                @change="toggleCheck(task)">
                            </v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content class="px-2 my-0 d-flex flex-grow-1">
                            <!-- ITEM DISPLAY -->  
                            <v-list-item-title 
                                class="mx-0 px-0 d-flex " 
                                :class="textColor(task)" 
                                width="400"
                                v-text="task.text"
                            ></v-list-item-title>
                        <!-- ITEM EDIT TEXTBOX -->  
                        </v-list-item-content>
                        <v-spacer class="flex-grow-0"></v-spacer>
                        <!-- TOGGLE PRIORITY -->  
                        <v-btn icon @click="togglePriority(task)">
                            <v-icon :color="task.done && 'teal' || 'primary'" v-if="task.priority">mdi-star</v-icon>
                            <v-icon :color="task.done && 'teal' || 'success'" v-else>mdi-star-outline</v-icon>
                        </v-btn>
                        <list-action-component
                            :gid="gid"
                            :moduleName="moduleName"
                            :item="task"
                            @emitEditItem="editItem"
                            @emitCopyItem="copyItem"
                            @emitMoveItem="moveItem"
                            @emitMove="move"
                            @emitRemoveItem="remove"
                        ></list-action-component>
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
        <!-- <list-bot-component>
            <template v-slot:navIcons>
                <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                    <v-btn icon @click="syncItems">
                        <v-icon>mdi-sync</v-icon>
                    </v-btn>
                    <span class="caption">Sync</span>
                </div>
                 
                <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                    <v-btn icon @click="showPriority = !showPriority">
                        <v-icon v-if="!showPriority">mdi-playlist-star</v-icon>
                        <v-icon v-else>mdi-format-list-checkbox</v-icon>
                    </v-btn>
                    <span class="caption" v-if="!showPriority">Priority</span>
                    <span class="caption" v-else>List</span>
                </div>

                <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                    <v-btn icon to="/modules">
                        <v-icon>mdi-apps</v-icon>
                    </v-btn>
                    <span class="caption">Modules</span>
                </div>
                
                <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2" v-if="!showPriority">
                    <v-btn icon @click="hideCompleted = !hideCompleted">
                        <v-icon :color="hideCompleted ? 'teal' : 'white'">mdi-playlist-check</v-icon>
                    </v-btn>
                    <span class="caption" :color="hideCompleted ? 'teal' : 'white'">Completed</span>
                </div>

                <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                    <v-btn icon @click="isSearch = !isSearch">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn> 
                    <span class="caption">Search</span>
                </div> 
            </template>
        </list-bot-component> -->
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
    import {orderBy, filter, sortBy, concat, split, join, chain, value, map, upperCase, includes, compact} from "lodash"
    import {itemCrudMixin} from '@/mixins/itemCrudMixin'
    import ListTopComponent from '@/components/ListTopComponent.vue'
    //import ListBotComponent from '@/components/ListBotComponent.vue'
    import ListActionComponent from '@/components/ListActionComponent.vue'
    import BotNavComponent from '@/components/BotNavComponent.vue'

     //SPEECH TO TEXT API
    //let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    //let recognition = SpeechRecognition? new SpeechRecognition() : false

    export default {
        middleware : [],
        components:{ListTopComponent, ListActionComponent, BotNavComponent},
        mixins : [itemCrudMixin],
        data () {
            return {
            //ADD BUTTON
                //fixed: false,
                activeBtn: 1,
           
            //MOBILE SWIPE
                swipedTask: '',
            //BOTTON NAV
                bottomNav: true,
            //SPEECH TO TEXT
                command: '',
                error: '',
                sheet: false,
                //editedTask: {},
                //tasks: [],
                //task: '',
            //LIST ITEMS
                hideCompleted : false,
                showPriority : false,
                editedItem: {
                    text: '',
                    done: false,
                    editable : false,
                    priority: false,
                },
                defaultItem: {
                    text: '',
                    done: false,
                    editable : false,
                    priority: false,
                },
            }//RETURN
        },//DATA
        asyncData({store, params, route}){
            let path = route.path
            let moduleName = path.split("/")[1]
            store.dispatch(`${moduleName}/loadItems`,{gid : params.gid})
            return{
                gid : params.gid,
                uid : store.getters['uid'],
            }//RETURN
        },//ASYN
        async fetch({store,params}){
            
        },//FETCH
        created(){
        
        },//CREATED
        mounted(){
        
        },//MOUNTED
        watch: {
           
        },//WATCH
        computed:{
            isChrome(){
                const userAgent = window.navigator.userAgent.toLowerCase()
                
                return /chrome/.test( userAgent )
            },
            completedTasks () {
                return this.items.filter(item => item.done).length
            },
            progress () {
                return this.completedTasks / this.items.length * 100
            },
            remainingTasks () {
                return this.items.length - this.completedTasks
            },
            priorityTasks () {
                return this.items.filter(item => item.priority).length
            },
            filteredTasks(){
                this.items = this.$store.getters[`${this.moduleName}/listByGid`](this.gid)

                let priorityArr = filter(this.items,{ 'priority': true, 'done': false })
                let doneArr = filter(this.items,{ 'priority': false, 'done': true })
                let pendingArr = filter(this.items,{ 'priority': false, 'done': false })

                let mergedArr = []

                if(this.showPriority){
                    mergedArr = sortBy(priorityArr,['text'])
                }
                else{
                    if(this.hideCompleted){
                        mergedArr = concat(sortBy(priorityArr,['text']), sortBy(pendingArr,['text']))
                    }
                    else{
                        mergedArr = concat(sortBy(priorityArr,['text']), sortBy(pendingArr,['text']), sortBy(doneArr,['text']))
                    }
                }

                if(this.search != ''){
                    let searchText = upperCase(this.search)
                    return mergedArr.filter(item => includes(upperCase(item.text), searchText) )
                }
                else{
                    return mergedArr
                }
            },
        },//COMPUTED
        methods:{
            textColor(task){
                if(task.priority == true && task.done == false){
                    return 'blue--text'
                }
                if(task.priority == false && task.done == false){
                    return 'green--text'
                }
                if(task.priority == false && task.done == true){
                    return 'teal--text taskComplete'
                }
            },
            
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

            //         let [cmd, ...task] = split(this.command, " ")

            //         if(cmd == 'add' || 'at' || 'ad' || 'and'){
            //             this.task = task.length > 0 ? task.join(" ") : task[0]
            //             this.create()
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
            toggleCheck(task){
                task.priority = false
                //this.$store.dispatch('tasks/update', task)
                this.$store.dispatch(`${this.moduleName}/updateItem`, task)
            },
            togglePriority(task){
                task.priority ? task.done = false : task.done = false
                task.priority = !task.priority
                //this.$store.dispatch('tasks/update', task)
                this.$store.dispatch(`${this.moduleName}/updateItem`, task)
            },
            toggleNewItemPriority(){
                this.editedItem.priority = !this.editedItem.priority
            },
            
            swipeHandler(param){
                return (direction, event) => {
                    //console.log(direction, param)
                    direction == 'left' ? this.swipedTask = param : this.swipedTask = {}
                }
            },//SWIPE HANDLER
        }//METHODS
    }//EXPORT DEFAULT
</script>

<style scoped>
.taskComplete {
    text-decoration: line-through;
}
</style>
