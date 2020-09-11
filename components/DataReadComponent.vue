<template>
<div>
    <v-row  dense justify="center" align="center" class="pa-0">
        <v-col cols="12">
           <v-card>
                <v-card-title class="pl-2 pr-0 py-0 subheading">FIREBASE DATA USAGE</v-card-title>
                <!-- <v-card-text class="pb-0" v-for="item in items" :key="item.gid"> -->
                <v-card-text class="pb-0">
                   <v-row justify="center" align="center">
                       <v-col cols="4" class="pa-0 d-flex justify-center">MODULE</v-col>
                       <v-col cols="2" class="pa-0 d-flex justify-center">READ</v-col>
                       <v-col cols="2" class="pa-0 d-flex justify-center">WRITE</v-col>
                       <v-col cols="2" class="pa-0 d-flex justify-center">DELETE</v-col>
                       <v-col cols="2" class="pa-0 d-flex justify-center">VISITED</v-col>
                   </v-row>
                   <v-row justify="center" align="center">
                       <v-col cols="4" class="pa-0 d-flex justify-center">{{moduleName}}</v-col>
                       <v-col cols="2" class="pa-0 d-flex justify-center">{{moduleCount.readCount}}</v-col>
                       <v-col cols="2" class="pa-0 d-flex justify-center">{{moduleCount.writeCount}}</v-col>
                       <v-col cols="2" class="pa-0 d-flex justify-center">{{moduleCount.deleteCount}}</v-col>
                       <v-col cols="2" class="pa-0 d-flex justify-center">{{moduleCount.visited}}</v-col>
                   </v-row>
               </v-card-text>
           </v-card>
        </v-col>
    </v-row>
    </div>
</template>

<script>
export default {
    middleware : [],
    components:{},
    props:{
        items: {type: Array, default: []},
        moduleName: {type: String, default: ''},
    },
    data(){
        return{
           
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
        user(){
            return{
                count: this.$store.getters.count,
                countAdd: this.$store.getters.countAdd,
                countUpdate: this.$store.getters.countUpdate,
                countDelete: this.$store.getters.countDelete,
                user : this.$store.getters.user,
                role : this.$store.getters.role,
                default : this.$store.getters.default,
                list : this.$store.getters.list,
            }
        },
        groups(){
            return{
               count: this.$store.getters['groups/count'],
               countAdd: this.$store.getters['groups/countAdd'],
               countUpdate: this.$store.getters['groups/countUpdate'],
               countDelete: this.$store.getters['groups/countDelete']
            }
        },
        notifications(){
            return{
               count: this.$store.getters['notifications/count'],
               countAdd: this.$store.getters['notifications/countAdd'],
               countUpdate: this.$store.getters['notifications/countUpdate'],
               countDelete: this.$store.getters['notifications/countDelete'],
            }
        },
        tasks(){
            return{
               count: this.$store.getters['tasks/count'],
               countAdd: this.$store.getters['tasks/countAdd'],
               countUpdate: this.$store.getters['tasks/countUpdate'],
               countDelete: this.$store.getters['tasks/countDelete'],
               visitedGroups : this.$store.getters['tasks/visitedGroups'],
            }
        },
        moduleCount(){
            return{
               readCount: this.$store.getters[`${this.moduleName}/readCount`],
               writeCount: this.$store.getters[`${this.moduleName}/writeCount`],
               deleteCount: this.$store.getters[`${this.moduleName}/deleteCount`],
               visited: this.$store.getters[`${this.moduleName}/visited`],
            }
        },
    },//COMPUTED
    methods:{
       
    },//METHODS  
}
</script>

<style scoped>

</style>




