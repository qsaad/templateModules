<template>
    <v-container fluid>
        <v-row justify="start" align="center" v-if="!isMobile">
            <v-col cols="12">
                <v-text-field v-model="search" prepend-icon="mdi-magnify">
                </v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="3" v-for="(item,i) in filteredItems" :key="i" >
                <v-card  width="250" outlined @click="goto(item.to)" height="250" v-if="item.status == 'complete'">
                    <v-card-text class="text-center pa-1">
                        <span class="white--text title text-uppercase">  {{item.value}} </span>
                    </v-card-text>
                    <v-card-text class="text-center">
                        <v-avatar color="#121212" size="96">
                            <v-icon size="72" color="orange">{{item.icon}}</v-icon>
                        </v-avatar>
                    </v-card-text>
                    <v-card-text class="text-center pa-1">
                        <span class="teal--text subheading">  {{item.description}} </span>
                    </v-card-text>
                </v-card>

                <v-card  width="250" outlined height="250" v-else>
                    <v-card-text class="text-center pa-1">
                        <span class="teal--text title text-uppercase">  {{item.value}} </span>
                    </v-card-text>
                    <v-card-text class="text-center">
                        <v-avatar color="#121212" size="96">
                            <v-icon size="72" color="teal">{{item.icon}}</v-icon>
                        </v-avatar>
                    </v-card-text>
                    <v-card-text class="text-center pa-1">
                        <span class="teal--text subheading">  {{item.description}} </span>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center" align="center" v-if="isMobile">
            <v-col cols="4" v-for="(item,i) in filteredItems" :key="i" @click="goto(item.to)" class="clickable">
                <div v-if="item.status == 'complete'">
                    <v-icon large color="orange" class="d-flex justify-center">{{item.icon}}</v-icon>
                    <p class="caption d-flex justify-center teal--text">{{item.value}}</p>
                </div>
                 <div v-else>
                    <v-icon large color="teal" class="d-flex justify-center">{{item.icon}}</v-icon>
                    <p class="caption d-flex justify-center teal--text">{{item.value}}</p>
                </div>
                
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
let map = require('lodash/map')
let filter = require('lodash/filter')
let upperCase = require('lodash/upperCase')
let includes = require('lodash/includes')
let sortBy = require('lodash/sortBy')

export default {
    middleware : [],
    components: {  },
    props : {
        items : {type: Array, default: []}
    },
    data () {
        return {
            search: ""
        }
    },//DATA
    async asyncData({store}){
        return{
           search : ''       
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
        filteredItems(){
            if(this.search != ''){
                let searchText = upperCase(this.search)
                //let arr = this.items
                let arr = this.items.filter(item => this.$store.getters.hasModule(item.name))
                return arr.filter(item => includes(upperCase(item.name), searchText) )
            }
            else{
                //let arr = this.items
                //console.log( arr.filter(item => this.$store.getters.hasModule(item.name)) )
                let arr = this.items.filter(item => this.$store.getters.hasModule(item.name))
                return sortBy(arr, ['status'])
                //return  sortBy(this.items,['status'])
            }
        },
        isMobile(){
          return this.$vuetify.breakpoint.name == 'xs' ? true : false
        }
    },//COMPUTED
    methods:{
      goto(link){
        this.$router.replace({ path: link })
      }
    }//METHODS
  }//EXPORT
</script>

<style scoped>
.clickable{
  cursor: pointer;
}

</style>
