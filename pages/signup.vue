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
            <v-col cols="10" sm="9" md="3" justify="center" align="center" >
                <v-card>
                    <v-card-text>
                        <signup-component></signup-component>
                    </v-card-text>
                    <v-card-actions>
                    </v-card-actions>
                </v-card>
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
import SignupComponent from '@/components/SignupComponent'

export default {
  middleware : [],
  components: {AppBarComponent, SignupComponent},
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
}
</script>

<style scoped>
.main{
    width:100%;
}
.section-one{
    width:100%;
    height : 100vh;
}

</style>

