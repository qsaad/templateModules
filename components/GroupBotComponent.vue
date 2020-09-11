<template>
    <div>
        <v-footer :fixed="fixed" app>
            <v-row dense justify="center" align="center">
                <v-col cols="12" align="center">
                    <slot>
                        <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                            <v-btn icon to="/share">
                                <v-icon>mdi-share-variant</v-icon>
                            </v-btn>
                            <span class="caption">Share</span>
                        </div>

                        <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                            <v-btn icon to="/dashboard">
                                <v-icon>mdi-view-dashboard</v-icon>
                            </v-btn>
                            <span class="caption">Dashboard</span>
                        </div>

                        <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                            <v-btn icon to="/modules">
                                <v-icon>mdi-apps</v-icon>
                            </v-btn>
                            <span class="caption">Modules</span>
                        </div>
                    </slot> 
                    <slot name="navIcons"></slot>
                </v-col>
            </v-row>
        </v-footer>
    </div>
</template>

<script>
    //import {find} from "lodash"

export default {
    middleware : [],
    components:{},
    props:{
       
    },
    data(){
        return{
           fixed: false,
           //isSearch: false,
      
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
        // syncGroups(){
        //     this.$store.dispatch('groups/get')
        // },
        // toggleSearchIcon(){
        //     this.isSearch = !this.isSearch 
        //     this.$emit('emittedToggleSearchIcon', this.isSearch)
        // },
    },//METHODS  
}
</script>

<style scoped>

</style>




