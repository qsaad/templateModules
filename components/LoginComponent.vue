<template>
    <v-row  dense justify="center" align="center" class="pa-0">
        <v-col cols="12">
            <v-chip outlined pill class="title font-weight-bold mt-1" color="success">
                LOGIN
            </v-chip>
            <v-form v-model="valid">
                <v-text-field
                    label="email"
                    v-model="email"
                    prepend-icon="mdi-email"
                    :rules="[rules.required, rules.email]"
                    clearable
                    required
                >
                </v-text-field>
                <v-text-field
                    label="password" 
                    type="password"
                    v-model="password" 
                    :rules="[rules.required, rules.counter]"
                    counter
                    prepend-icon="mdi-lock"
                    clearable 
                    required
                >
                </v-text-field>
                <v-btn 
                    block color="blue" 
                    @click.prevent="login"
                    :disabled="!valid"
                >
                    Login
                </v-btn>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
export default {
    middleware : [],
    components:{},
    layout:'default',
    data(){
        return{
            valid : true,
            email : '',
            password : '',
            // email : 'alpeshk_98@yahoo.com',
            // password : 'rapid786',
            rules: {
                required: value => !!value || 'Required.',
                counter: value => value.length >= 6 || 'Min 6 characters',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                }//EMAIL RULE
            },//RULES
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
       validation(){
            return (this.email == '' || this.password.length < 6) ? false : true
        },//VALIDATION
    },//COMPUTED
    methods:{
        login(){
            this.$store.dispatch('login',{email : this.email, password : this.password})
        }
    },//METHODS  
}
</script>

<style scoped>

</style>




