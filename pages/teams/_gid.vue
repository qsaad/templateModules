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
<!-- TOP BAR COMPONENT -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ --> 
            <!-- <data-read-component :moduleName="moduleName"></data-read-component> -->
            <!-- {{status}} - {{ visited}}
            <pre>{{list}}</pre> -->
            <!-- <pre>{{loadedList}}</pre> -->
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
                        <v-card-text class="py-0">
                            <v-container class="px-2 py-0 ma-0">
                                <v-row>
                                    <v-col cols="12" class="px-0 py-1 ma-0">
                                        <v-text-field 
                                            v-model="editedItem.title" 
                                            label="Enter project title"
                                            solo
                                            prepend-icon="mdi-file"
                                            hide-details
                                            clearable
                                            class="ml-2"
                                            :append-icon="editedItem.priority ? 'mdi-star' : 'mdi-star-outline'"
                                            @click:append="toggleNewItemPriority"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="px-0 py-1 ma-0">
                                        <v-text-field 
                                            v-model="editedItem.description" 
                                            label="Enter task description"
                                            solo
                                            prepend-icon="mdi-format-align-justify"
                                            hide-details
                                            clearable
                                            class="ml-2"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="px-0 py-1 ma-0">
                                        <v-dialog ref="dialogDue" v-model="modalDue"  :return-value.sync="editedItem.due" persistent width="290px">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field 
                                                    v-model="editedItem.due" 
                                                    label="Due date" 
                                                    solo 
                                                    prepend-icon="mdi-calendar-month" 
                                                    hide-details
                                                    class="ml-2"
                                                    readonly v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="editedItem.due" scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="primary" @click="modalDue = false">Cancel</v-btn>
                                            <v-btn text color="primary" @click="$refs.dialogDue.save(editedItem.due)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                    </v-col>
                                    <v-col cols="12" class="px-0 py-1 ma-0">
                                        <v-autocomplete 
                                            v-model="editedItem.assigned"
                                            label="Assigned to" 
                                            solo
                                            prepend-icon="mdi-account"
                                            class="ml-2"
                                            :items="membersList"
                                            item-text="displayName"
                                            item-value="uid"
                                            :rules="[rules.required]"
                                            hint="Assign task to member"
                                        ></v-autocomplete>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions class="pb-2">
                            <v-spacer></v-spacer>
                            <v-btn color="indigo" @click="close()">Cancel</v-btn>
                            <v-btn color="indigo" @click="copy()" v-if="isCopy" :disabled="!valid">Copy</v-btn>
                            <v-btn color="indigo" @click="save()" v-else :disabled="!valid">{{saveButtonText}}</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- LIST VIEW -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            <v-card v-if="filteredItems.length > 0">
                <template v-for="(item, i) in filteredItems">
                    <v-divider v-if="i !== 0" :key="`${i}-divider`"></v-divider>
                    <v-list-item two-line :key="`${i}-${item.tid}`" class="mx-0 px-1">
                        <v-list-item-action class="pl-1 pr-0 mx-0">
                            <!-- ITEM CHECK BOX -->  
                            <v-checkbox 
                                v-model="item.done" 
                                :color="item.done && 'teal' || 'primary'" 
                                @change="toggleCheck(item)">
                            </v-checkbox>
                        </v-list-item-action>
                        <v-avatar :color="avatarColor(item.assigned)" size="30">
                            <span class="white--text subtitle-2">{{ userInitials(item.assigned) }}</span>
                        </v-avatar>
                        <v-list-item-content class="px-2 my-0 d-flex flex-grow-1">
                            <!-- ITEM DISPLAY -->  
                            <v-list-item-title 
                                class="mx-0 px-0 d-flex text-truncate" 
                                :class="textColor(item)" 
                                v-text="item.title"
                            ></v-list-item-title>
                            <v-list-item-subtitle class="d-flex" :class="textColor(item)">
                                <span v-text="item.description" class="grow caption text-truncate"></span>
                                <span v-text="item.due" class="caption"></span>
                            </v-list-item-subtitle>
                        <!-- ITEM EDIT TEXTBOX -->  
                        </v-list-item-content>
                        <v-spacer class="flex-grow-0"></v-spacer>
                        <!-- TOGGLE PRIORITY -->  
                        <v-btn icon @click="togglePriority(item)">
                            <v-icon :color="item.done && 'teal' || 'primary'" v-if="item.priority">mdi-star</v-icon>
                            <v-icon :color="item.done && 'teal' || 'success'" v-else>mdi-star-outline</v-icon>
                        </v-btn>
                        <list-action-component
                            :gid="gid"
                            :moduleName="moduleName"
                            :item="item"
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
    import ListBotComponent from '@/components/ListBotComponent.vue'
    import ListActionComponent from '@/components/ListActionComponent.vue'
    import DataReadComponent from '@/components/DataReadComponent.vue'
    import BotNavComponent from '@/components/BotNavComponent.vue'

    import moment from 'moment'

    //import { mapState } from "vuex";

    export default {
        middleware : [],
        components:{ListTopComponent, ListActionComponent, DataReadComponent, BotNavComponent},
        mixins : [itemCrudMixin],
        data () {
            return {
            //LIST ITEMS
                modalDue: false,
                hideCompleted : false,
                showPriority : false,
                editedItem: {
                    title:'',
                    description:'',
                    due: new Date().toISOString().substr(0, 10),
                    assigned:'',
                    done: false,
                    priority: false,
                },
                defaultItem: {
                    title:'',
                    description:'',
                    due: new Date().toISOString().substr(0, 10),
                    assigned:'',
                    done: false,
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
            completedItems () {
                return this.items.filter(item => item.done).length
            },
            progress () {
                return this.completedItems / this.items.length * 100
            },
            remainingItems () {
                return this.items.length - this.completedItems
            },
            priorityItems () {
                return this.items.filter(item => item.priority).length
            },
            filteredItems(){
                this.items = this.$store.getters[`${this.moduleName}/listByGid`](this.gid)

                let priorityArr = filter(this.items,{ 'priority': true, 'done': false })
                let doneArr = filter(this.items,{ 'priority': false, 'done': true })
                let pendingArr = filter(this.items,{ 'priority': false, 'done': false })

                let mergedArr = []

                if(this.showPriority){
                    mergedArr = sortBy(priorityArr,['due'])
                }
                else{
                    if(this.hideCompleted){
                        mergedArr = concat(sortBy(priorityArr,['due']), sortBy(pendingArr,['due']))
                    }
                    else{
                        mergedArr = concat(sortBy(priorityArr,['due']), sortBy(pendingArr,['due']), sortBy(doneArr,['due']))
                    }
                }

                if(this.search != ''){
                    let searchText = upperCase(this.search)
                    return mergedArr.filter(item => includes(upperCase(item.title), searchText) )
                }
                else{
                    //return sortBy(mergedArr,['due'])
                    return mergedArr
                }
            },
        },//COMPUTED
        methods:{
            textColor(item){
                if(item.priority == true && item.done == false){
                    if(moment(item.due).isAfter(moment())){
                        return 'blue--text'
                    }
                    else{
                        return 'red--text'
                    }
                }
                if(item.priority == false && item.done == false){
                    if(moment(item.due).isAfter(moment())){
                        return 'green--text'
                    }
                    else{
                        return 'red--text'
                    }
                }
                if(item.priority == false && item.done == true){
                    return 'teal--text itemComplete'
                }
            },
            avatarColor(uid){
                return this.$store.getters.colorByUid(uid)
            },
            toggleCheck(item){
                item.priority = false
                this.$store.dispatch(`${this.moduleName}/update`, item)
            },
            togglePriority(item){
                item.priority ? item.done = false : item.done = false
                item.priority = !item.priority
                this.$store.dispatch(`${this.moduleName}/update`, item)
            },
            toggleNewItemPriority(){
                this.editedItem.priority = !this.editedItem.priority
            },
            
        }//METHODS
    }//EXPORT DEFAULT
</script>

<style scoped>
.itemComplete {
    text-decoration: line-through;
}
</style>
