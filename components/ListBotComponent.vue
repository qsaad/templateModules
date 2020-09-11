<template>
    <div>
        <v-footer :fixed="fixed" app>
            <v-row dense justify="center" align="center">
                <v-col cols="12" align="center">
                    <slot name="navIcons"></slot>
                </v-col>
            </v-row>
        </v-footer>
    </div>
</template>

<script>
export default {
    middleware : [],
    components:{},
    props:{},
    data(){
        return{
           fixed: false,
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
      
    },//METHODS  
}
</script>

<style scoped>

</style>




