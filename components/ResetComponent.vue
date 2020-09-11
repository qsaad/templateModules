<template>
    <v-row  dense justify="center" align="center" class="pa-0">
        <v-col>
            <v-chip outlined pill class="title font-weight-bold mt-1" color="success">
                RESET PASSWORD
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
                <v-btn 
                    block color="blue" 
                    @click.prevent="reset"
                    :disabled="!valid"
                >
                    RESET PASSWORD
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
            rules: {
                required: value => !!value || 'Required.',
                counter: value => value.length > 6 || 'Min 6 characters',
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
    //    validation(){
    //         return this.rules.email() == 'Invalid e-mail.' ? false : true
    //         //return (this.email == '') ? false : true
    //     },//VALIDATION
    },//COMPUTED
    methods:{
        reset(){
            //this.$store.dispatch('reset',{email : this.email})
        }
       
    },//METHODS  
}
</script>

<style scoped>

</style>




