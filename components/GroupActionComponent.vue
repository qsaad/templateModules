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
import {filter, sortBy,  map} from "lodash"

export default {
    middleware : [],
    components:{},
    props:{
        item: {type: Object, default: {}},
    },
    data(){
        return{
           //fixed: false,
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
       
        
    },//COMPUTED
    methods:{
        emitEditItem(){
            this.$emit('emitEditItem', this.item)
        },
        emitCopyItem(){
            this.$emit('emitCopyItem', this.item)
        },
        emitRemove(){
            this.$emit('emitRemoveItem', this.item)
        },
    },//METHODS  
}
</script>

<style scoped>

</style>




