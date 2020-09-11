<template>
      <div class="main">
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- APP BAR \ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <app-bar-component path="/" name="Home"></app-bar-component>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- LOGIN FORM -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
    <v-row justify="center" align="center" class="section-one">
        <v-col cols="12" sm="8" md="6" justify="center" align="center" >
            <v-icon size=100 color=red>mdi-wifi-off</v-icon>
            <p class="display-1 font-weight-bold">RAPID LYST</p>
            <p class="body-2 yellow--text text--darken-3">You are currently offline and cannot view this page</p>
            <v-btn color="indigo" to="/">Home</v-btn>
        </v-col>
    </v-row>
        

  <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- FOOTER -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
        <v-footer color="teal darken-4">
            <v-row dense justify="center" align="center">
                <v-col class="text-center" cols="12">
                    {{ new Date().getFullYear() }} — <strong>ibacklog</strong>
                </v-col>
            </v-row>
        </v-footer>

    </div>
</template>

<script>
import AppBarComponent from '@/components/AppBarComponent'

export default {
    middleware : [],
   components: {AppBarComponent},
    layout : 'landing',
    data: () => ({
     
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
      
    },//COMPUTED
    methods:{
     
    },//METHODS  
}//EXPORT DEFAULT
</script>

<style scoped>
.section-one{
  height : 100vh;
}

</style>

   