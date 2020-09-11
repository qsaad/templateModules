<template>
    <div>
        <v-row justify="center" class="pa-0 ma-0">
            <v-col cols="12" md="6">
                <v-toolbar dense flat color="teal--darken-2">
                    <v-icon color="yellow">mdi-cog-outline</v-icon>
                    <v-spacer></v-spacer>
                    <v-toolbar-title class="green--text">
                        <v-chip outlined pill class="title font-weight-bold green--text mt-1" color="success">
                            SETTINGS
                        </v-chip>
                    </v-toolbar-title>
                    
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card>
                    <v-card-text class="pa-2">
                        <v-row justify="center" align="center">
                            <v-col cols="12">
                                <p>Avatar Color</p>
                                <div class="d-flex flex-column flex-sm-row">
                                    <div class="justify-center align-self-center">
                                        <v-color-picker 
                                            v-model="selectedColor" 
                                            dot-size="30"
                                            hide-inputs
                                        ></v-color-picker>
                                    </div>
                                    <div class="pl-2 ml-2 mt-2 grow d-flex justify-center align-stretch align-self-center">
                                        <v-btn 
                                            color="indigo" 
                                            @click="updateColor"
                                            
                                        >Update Color</v-btn>
                                    </div>
                                    
                                </div>
                            </v-col>
                            <v-col cols="12">
                                Selected Modules
                            </v-col>
                            <v-col cols="6" md="4" xs="6" v-for="(item,i) in modules" :key="i" class="px-4 py-0">
                                
                                <div class="d-flex">
                                    <v-checkbox 
                                        v-model="selectedModules" 
                                        hide-details
                                        :value="item.name"
                                        class="pa-0 ma-0"
                                        @change="toggleModule(item)">
                                    ></v-checkbox>
                                    <v-icon class="justify-center align-center" color="orange">{{item.icon}}</v-icon>
                                    <span class="d-flex justify-center align-center pl-2">{{item.name}}</span>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

            </v-col>
        </v-row>

        <bot-nav-component>
        </bot-nav-component>
    </div>
</template>

<script>
import BotNavComponent from '@/components/BotNavComponent.vue'
import * as modules from '@/data/modulesData' 

export default {
    middleware : [],
    components: {BotNavComponent},
    layout : 'default',
    data: () => ({
        //userId: '',
        //selectedModules: [],
        selectedColor: ''
    }),//DATA
    async asyncData({store,params}){
       return{
           selectedModules: store.getters.modules,
           selectedColor: store.getters.color
       }
    },//ASYNC DATA
    async fetch({store}){
      
    },
    created(){
        
    
    },//CREATED
    mounted(){
      
    },//MOUNTED
    watch: {
        selectedModules:{
            deep: true,
            handler(){
                return this.$store.getters.modules
            }
        }
    },//WATCH
    computed:{
        modules(){
            return modules.data
        },
      
        
    },//COMPUTED
    methods:{
        toggleModule(item){
            this.$store.dispatch(`toggleModule`, item.name)
        },
        updateColor(){
            this.$store.dispatch(`updateColor`, this.selectedColor)
        }
        // addSetting(){
        //     this.$store.dispatch(`addSetting`, {uid: this.userId})
        // }
    },//METHODS  
}//EXPORT DEFAULT
</script>

   