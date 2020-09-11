import * as modules from '@/data/modulesData' 
//import {orderBy, filter, capitalize, sortBy, concat, split, join, chain, value, map, upperCase, includes, compact} from "lodash"

let capitalize = require('lodash/capitalize')
let filter = require('lodash/filter')
//let includes = require('lodash/includes')


export const groupCrudMixin =  {
    data () {
        return {
            fab: false,
            search: '',
            dialog: false,
            isCopy: false,
            valid: true,
            items: [],
            rules: {
                required: value => !!value || 'Required.'},
            editedIndex: -1,
            //SNACKBAR
            snackbar: false,
            snackbarText: '',
            snackbarColor: '',
        }
    },//DATA
    watch:{
        dialog (val) {
            val || this.close()
        },
    },//WATCH
    computed:{
        moduleName(){
            return this.$route.name
            // let path = this.$route.path
            // let pathArr = path.split('/')
            // return pathArr[1]
        },
        moduleIcon(){
            //let item = filter(modules.data,{'name' : this.moduleName})
            let item = filter(modules.data,{'name' : this.$route.name})
            return item[0].icon
        },
        formTitle () {
            return this.editedIndex === -1 ? 'New Group' : this.isCopy ? 'Copy Group' : 'Edit Group'
        },
        saveButtonText(){
            return this.editedIndex === -1 ? 'Add' : 'Update'
        },
      
    },//COMPUTED
    methods:{
       
        onScroll (top) {
            // if (typeof window === 'undefined') return
            // const top = window.pageYOffset ||   e.target.scrollTop || 0
            this.fab = top > 20
        },
        toTop () {
            this.$vuetify.goTo(0)
        },
        handleToggleSearchIcon(value){
            this.isSearch = value
        },
        handleShareSnackbar(item){
            this.snackbarText = item.text
            this.snackbarColor = item.color
            this.snackbar = item.show
        },
        gotoList(group){
            //this.$router.push({path: `/${this.moduleName}/` + group.gid})
            this.$router.push({path: `/${this.$route.name}/` + group.gid})
        },
        isAdmin(group){
            return group.admins.includes(this.uid)
            //return includes(group.admins, this.uid)
        },
        generate_id() {
            let dt = new Date().getTime();
            let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                let r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return id;
        },//GENERATE UNIQUE ID
        editItem(item){
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        close() {
            this.dialog = false
            this.isCopy = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        copyItem(item){
            delete item.gid
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            this.isCopy = true
        },
        save(){
            if (this.editedIndex > -1) {
                Object.assign(this.items[this.editedIndex], this.editedItem)
                this.$store.dispatch('groups/updateItem', this.editedItem)

                this.editedIndex = -1
                this.editedItem = Object.assign({}, this.defaultItem)
                this.dialog = false
                if(this.$store.getters[`groups/status`] == 'success'){
                    this.snackbarText = `Item Updated`
                    this.snackbarColor = 'success'
                    this.snackbar = true
                }
            }
            else{
                let payload = {
                    gid: this.generate_id(),
                    name : capitalize(this.editedItem.name),
                    editable : false,
                    //type : this.moduleName,
                    type: this.$route.name,
                    admins : [this.uid],
                    users : []
                }
                this.$store.dispatch('groups/addItem', payload)

                this.editedItem = Object.assign({}, this.defaultItem)
                this.dialog = false

                if(this.$store.getters[`groups/status`] == 'success'){
                    this.snackbarText = `Item Added`
                    this.snackbarColor = 'success'
                    this.snackbar = true
                }
            }
        },
        copy(){
            let payload = {
                    ...this.editedItem, 
                    gid : this.generate_id()
                }

            this.$store.dispatch('groups/addItem',payload)

            this.editedIndex = -1
            this.isCopy = false
            this.dialog = false

            this.snackbarText = `Item Copied`
            this.snackbarColor = 'success'
            this.snackbar = true
        },
        remove(item){
            this.$store.dispatch('groups/deleteItem',item)

            if(this.$store.getters[`groups/status`] == 'success'){
                this.snackbarText = `${item.name} deleted`
                this.snackbarColor = 'success'
                this.snackbar = true
            }
        },
    }//METHODS
}//EXPORT CRUD MIXIN





