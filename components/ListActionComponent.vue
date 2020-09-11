<template>
    <div>
        <v-menu open-on-click left offset-x bottom >
            <template v-slot:activator="{ on }">
                <v-btn icon color="teal" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>
            <v-list class="py-0 px-0 my-0 mx-0">
            <!-- EDIT -->
                <v-list-item dense class="mx-0 my-0 py-0 px-3" @click="emitEditItem()">
                    <v-list-item-action class="py-0 px-0 my-0 mx-0">
                        <v-icon color="yellow">mdi-pencil-outline</v-icon>
                    </v-list-item-action>
                </v-list-item>
            <!-- COPY -->
                <v-list-item dense class="mx-0 my-0 py-0 px-3" @click="emitCopyItem()">
                    <v-list-item-action class="py-0 px-0 my-0 mx-0">
                        <v-icon color="blue">mdi-content-copy</v-icon>
                    </v-list-item-action>
                </v-list-item>
            <!-- MOVE BUTTON AND DIALOG -->
                <v-dialog v-model="dialogMove" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-list-item dense class="mx-0 my-0 py-0 px-3" @click="emitMoveItem()" v-on="on">
                            <v-list-item-action class="py-0 px-0 my-0 mx-0">
                                <v-icon color="green">mdi-cursor-move</v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                    <v-card color="#00695C">
                        <v-card-title class="px-3 py-2 ma-0">
                            <span class="headline white--text">Move Item : </span>
                            <span class="headline blue--text pl-2">{{itemName(item)}}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container class="px-2 py-0 ma-0">
                                <v-row>
                                    <v-col cols="12" class="pa-0 ma-0">
                                        <v-autocomplete 
                                            prepend-icon="mdi-folder"
                                            v-model="emitMoveTo"
                                            label="Select group name" 
                                            :items="moveToGroupsList"
                                            :rules="[rules.required]"
                                            hint="What group do want to move this item to?"
                                            @change="emitMove()"
                                        ></v-autocomplete>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            <!-- DELETE -->
                <v-list-item dense class="mx-0 my-0 py-0 px-3" @click="emitRemove()">
                    <v-list-item-action class="py-0 px-0 my-0 mx-0">
                        <v-icon color="red">mdi-delete-outline</v-icon>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
//import {filter, sortBy,  map} from "lodash"

let map = require('lodash/map')
let filter = require('lodash/filter')
let sortBy = require('lodash/sortBy')

export default {
    middleware : [],
    components:{},
    props:{
        gid: {type: String, default: ''},
        moduleName: {type: String, default: ''},
        item: {type: Object, default: {}},
    },
    data(){
        return{
           fixed: false,
           emitMoveTo: '',
           rules: {
                required: value => !!value || 'Required.',
            },//RULES
            dialogMove: false,
        }//RETURN
    },//DATA
    async asyncData({store}){
        
    },//ASYN
    fetch(){

    },
    created(){
        
    },//CREATED
    mounted(){
        
    },//MOUNTED
    watch: {
     
    },//WATCH
    computed:{
        listItems(){
            return filter(this.$store.getters[`${this.moduleName}/list`],{gid : this.gid})
        },
        groupsList(){
            return map(filter(this.$store.getters['groups/list'],{type : `${this.moduleName}`}),item => item.name)
        },
        moveToGroupsList(){
            let arr = this.groupsList
            let index = arr.findIndex(item => item == this.listName)
            arr.splice(index, 1)
            let sortedArr = sortBy(arr,['name'])
            return sortedArr
        },
    },//COMPUTED
    methods:{
        emitEditItem(){
            this.$emit('emitEditItem', this.item)
        },
        emitCopyItem(){
            this.$emit('emitCopyItem', this.item)
        },
        emitMoveItem(){
            this.$emit('emitMoveItem', this.item)
        },
        emitMove(){
            this.$emit('emitMove', this.emitMoveTo)
        },
        emitRemove(){
            this.$emit('emitRemoveItem', this.item)
        },
        itemName(item){
            switch(this.moduleName) {
                case 'tasks':
                    return item.text
                case 'teams':
                    return item.title
                default:
                    return item.name
                }
        }//ITEM NAME
    },//METHODS  
}
</script>

<style scoped>

</style>




