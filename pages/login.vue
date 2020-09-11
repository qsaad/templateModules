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
                        <login-component v-if="status == 'login'"></login-component>
                        <reset-component v-if="status == 'reset'"></reset-component>
                    </v-card-text>
                    <v-card-actions>
                        <v-row justify="center" align="center" class="pa-0 ma-0">
                            <v-col cols="10" >
                                <v-btn text @click="status = 'reset'" color="indigo" v-if="status == 'login'">Forgot password ?</v-btn>
                                <v-btn text @click="status = 'login'" color="indigo" v-else>Login</v-btn>
                            </v-col>
                        </v-row>
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
import LoginComponent from '@/components/LoginComponent'
import ResetComponent from '@/components/ResetComponent'

export default {
  middleware : [],
  components: {AppBarComponent, LoginComponent, ResetComponent},
  layout : 'landing',
  data: () => ({
        isLogin : false , 
        status : 'login',
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

