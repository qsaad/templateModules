<template>
    <div>
        <div class="d-flex flex-row align-center">
        <!-- BACK BUTTON -->  
            <v-btn @click="goto(path)" icon>
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
        <!-- LIST NAME -->  
            <p class="title text-center blue--text text-uppercase mb-1 grow">
                <v-chip outlined pill class="title font-weight-bold green--text mt-1" color="success">
                    {{groupName}}
                </v-chip>
            </p>
            <v-menu open-on-click left offset-x bottom >
                <template v-slot:activator="{ on }">
                    <v-btn icon color="teal" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list class="py-0 px-0 my-0 mx-0">
                    <slot>
                        <!-- EDIT -->
                        <v-list-item dense class="mx-0 my-0 py-0 px-3" @click="syncItems()">
                            <v-list-item-action class="py-0 px-0 my-0 mx-0">
                                <v-icon color="yellow">mdi-sync</v-icon>
                            </v-list-item-action>
                        </v-list-item>
                        <!-- COPY -->
                        <v-list-item dense class="mx-0 my-0 py-0 px-3" @click="toggleSearchIcon()">
                            <v-list-item-action class="py-0 px-0 my-0 mx-0">
                                <v-icon color="yellow">mdi-magnify</v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </slot>
                    <slot name="listToggleButtons"></slot>
                </v-list>
            </v-menu>
        </div>
        <v-divider class="my-2"></v-divider>
        <div class="d-flex justify-center align-center">
             <v-progress-linear
                :active="isLoading"
                :indeterminate="isLoading"
                color="deep-purple accent-4"
            ></v-progress-linear>
        </div>
        <v-text-field 
                v-if="isSearch"
                v-model="searchText" 
                @keyup="$emit('update:search', searchText)"
                label="What are you looking for?"
                solo
                hide-details
                class="mb-2"  
                :append-outer-icon="'mdi-close'"
                @click:append-outer="closeSearch()"                 
        ></v-text-field>
        <v-btn 
            v-scroll="onScrollChild" 
            :v-show="fab" 
            fab 
            dark
            fixed
            bottom
            right
            color="teal"
            @click="$emit('click')"
            
        >
            <v-icon large>mdi-chevron-up</v-icon>
        </v-btn>
    </div>
    
</template>

<script>
export default {
    middleware : [],
    components:{},
    props:{
        path: {type: String, default: '/modules'},
        moduleIcon: {type: String, default: ''},
        groupName: {type: String, default: ''},
        gid: {type: String, default: ''},
        moduleName: {type: String, default: ''},
        search: {type: String, default: ''},
        fab: {type: Boolean, default: false},
    },
    data(){
        return{
           searchText: '',
           isSearch: false,
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
        isLoading(){
            return this.$store.getters[`${this.moduleName}/isLoading`]
        },
    },//COMPUTED
    methods:{
        goto(path){
            this.$router.replace(path)
        },
        onScrollChild(e) {
            if (typeof window === 'undefined') return
            const top = window.pageYOffset ||   e.target.scrollTop || 0
            this.$emit('onScrollChild', top);
        },
        syncItems(){
            this.$store.dispatch(`${this.moduleName}/syncItems`,{gid:this.gid})
        },
        toggleSearchIcon(){
            this.isSearch = !this.isSearch 
            this.$emit('emittedToggleSearchIcon', this.isSearch)
        },
        closeSearch(){
            this.isSearch = false
            this.searchText = ''
            this.$emit('update:search', this.searchText)
        }
    },//METHODS  
}
</script>

<style scoped>

</style>




