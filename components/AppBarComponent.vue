<template>
    <v-app-bar dense color="teal darken-4" class="pa-0 ma-0">
        <!-- <v-toolbar-title class="red--text">RapidLyst</v-toolbar-title> -->
        
        <v-avatar size="30" tile >
            <img src="/images/logo.png">
        </v-avatar>

       
        <v-spacer></v-spacer>
           
          
        
        <v-spacer></v-spacer>
        <v-btn text @click="goto">{{name}}</v-btn>
    </v-app-bar>
</template>

<script>

export default {
    props:{
        path: {type: String, default: '/'},
        name: {type: String, default: 'Home'},
    },
    methods:{
        goto(){
            this.$router.replace(this.path)
        }
    }
}

</script>