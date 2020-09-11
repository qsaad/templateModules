<template>
    <div>
        <modules-component :items="items">
        </modules-component>

        <bot-nav-component>
        </bot-nav-component>
    </div>
</template>

<script>
import * as modules from '@/data/modulesData' 
import ModulesComponent from '~/components/ModulesComponent.vue'
import BotNavComponent from '@/components/BotNavComponent.vue'

export default {
    middleware : [],
    components: { ModulesComponent, BotNavComponent },
    layout : 'default',
    data () {
        return {
            fixed: false
        }
    },//DATA
    async asyncData({store}){
        return{
                
        }//RETURN
    },//ASYNC DATA
    async fetch({store}){
                
    },//FETCH
    created(){
                
    },//CREATED
    mounted(){
        
    },//MOUNTED
    watch:{
            
    },//WATCH
    computed:{
        items(){
            return modules.data
        }
    },//COMPUTED
    methods:{
      
      
    }//METHODS
  }//EXPORT
</script>

<style scoped>

</style>
