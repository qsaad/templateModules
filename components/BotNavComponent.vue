<template>
    <div>
        <v-footer :fixed="fixed" app>
            <v-row dense justify="center" align="center">
                <v-col cols="12" align="center">
                        
                    <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                        <v-btn icon to="/share" :active-class="selectedButton">
                            <v-icon>mdi-share-variant</v-icon>
                        </v-btn>
                        <span class="caption">Share</span>
                    </div>
                    <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                        <!-- <v-btn icon to="/dashboard" :active-class="selectedButton">
                            <v-icon>mdi-bell-outline</v-icon>
                        </v-btn> -->
                        <v-btn icon to="/dashboard" :active-class="selectedButton">
                            <v-badge color="green" :content="notificationsCount" overlap :value="notificationsCount > 0">
                                <v-icon>mdi-bell-outline</v-icon>
                            </v-badge>
                        </v-btn>
                        <span class="caption">Notifications</span>
                    </div>
                    <div class="d-inline-flex flex-column justify-center align-center flex-shrink-0 px-2">
                        <v-btn icon to="/modules" :active-class="selectedButton">
                            <v-icon>mdi-apps</v-icon>
                        </v-btn>
                        <span class="caption">Modules</span>
                    </div>
                    
                </v-col>
            </v-row>
        </v-footer>
    </div>
</template>

<script>
export default {
    middleware : [],
    components:{},
    props:{
       
    },
    data(){
        return{
           fixed: false,
           count : 0
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
        selectedButton(){
            return 'orange'
        },
        notificationsCount(){
            //let uid = this.$store.getters['uid']
            //return this.$store.getters['notifications/listByUid'](uid)
            return this.$store.getters['notifications/unreadCount']
        },
    },//COMPUTED
    methods:{
       
    },//METHODS  
}
</script>

<style scoped>

</style>




