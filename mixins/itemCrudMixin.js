import * as modules from '@/data/modulesData' 
//import {orderBy, filter, sortBy, concat, split, join, chain, value, map, upperCase, includes, compact} from "lodash"


let map = require('lodash/map')
let filter = require('lodash/filter')
let upperCase = require('lodash/upperCase')
let includes = require('lodash/includes')
let compact = require('lodash/compact')
let split = require('lodash/split')


export const itemCrudMixin =  {
    data () {
        return {
            fab: false,
            search: '',
            isSearch: false,
            //DIALOGS
            dialog: false,
            dialogMove: false,
            isCopy: false,
            moveTo: '',
            valid: true,
            items: [],
            rules: {
                required: value => !!value || 'Required.',
            },//RULES
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
            let path = this.$route.path
            let pathArr = path.split('/')
            return pathArr[1]
        },
        moduleIcon(){
            let item = filter(modules.data,{'name' : this.moduleName})
            return item[0].icon
        },
        formTitle () {
            return this.editedIndex === -1 ? 'New Item' : this.isCopy ? 'Copy Item' : 'Edit Item'
        },
        saveButtonText(){
            return this.editedIndex === -1 ? 'Add' : 'Update'
        },
        listName(){
            return this.$store.getters['groups/nameByGid'](this.gid)
        },
        membersList(){
            return map(this.$store.getters['groups/membersByGid'](this.gid), item =>{
                return item != "" ? this.$store.getters.userData(item) : ""
            })
        },
        memberNamesList(){
            return map(this.$store.getters['groups/membersByGid'](this.gid), item =>{
                return item != "" ? this.$store.getters.displayNameByUid(item) : ""
            })
        },
        groupName(){
            return this.$store.getters['groups/nameByGid'](this.gid)
        },
        matchingItem(){
            let items = this.$store.getters[`${this.moduleName}/listByGid`](this.gid)
            let searchText = this.editedItem.text == '' ? '~' : upperCase(this.editedItem.text);

            let arr = []

            map(items, item =>{
                if(includes(upperCase(item.text), searchText)){
                    arr.push(item.text)
                }
            })

            return arr.length > 0 ? compact(arr) : ''
        }
    },//COMPUTED
    methods:{
        groupPath(moduleName){
            return `/${moduleName}`
        },
        onScroll (top) {
            this.fab = top > 20
        },
        toTop () {
            this.$vuetify.goTo(0)
        },
        syncItems(){
            this.$store.dispatch(`${this.moduleName}/syncItems`,{gid : this.gid})
        },
        displayNameByUid(uid){
            return this.$store.getters.displayNameByUid(uid)
        },
        userInitials(uid){
            let name = uid != "" ? this.$store.getters.displayNameByUid(uid) : ""
            let arr = name != "" ? split(name, " ") : "John Doe"
            return map(arr, x =>{
              return x.charAt(0)
            }).join('')
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
            delete item.tid
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            this.isCopy = true
        },
        moveItem(item){
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogMove = true
        },
        save(){
            if (this.editedIndex > -1) {
                Object.assign(this.items[this.editedIndex], this.editedItem)
                this.$store.dispatch(`${this.moduleName}/updateItem`, {...this.editedItem})

                this.editedIndex = -1
                this.editedItem = Object.assign({}, this.defaultItem)
                this.dialog = false

                this.snackbarText = `Item Updated`
                this.snackbarColor = 'success'
                this.snackbar = true
            }
            else{
                let payload = {
                    ...this.editedItem,
                    tid : this.generate_id(),
                    gid : this.gid,
                    uid : this.uid,
                }   
                //this.$store.dispatch(`${this.moduleName}/add`, payload)
                this.$store.dispatch(`${this.moduleName}/addItem`, payload)

                this.editedItem = Object.assign({}, this.defaultItem)
                this.dialog = false

                this.snackbarText = `Item Added`
                this.snackbarColor = 'success'
                this.snackbar = true
            }
        },
        copy(){
            let payload = {
                    ...this.editedItem, 
                    tid : this.generate_id()
                }

            //this.$store.dispatch(`${this.moduleName}/add`,payload)
            this.$store.dispatch(`${this.moduleName}/addItem`, payload)

            this.editedIndex = -1
            this.isCopy = false
            this.dialog = false

            this.snackbarText = `Item Copied`
            this.snackbarColor = 'success'
            this.snackbar = true
        },
        move(moveTo){
            let payload = {
                    ...this.editedItem,
                    gid : this.$store.getters['groups/gidByName'](moveTo),
                }
            Object.assign(this.items[this.editedIndex], payload)
            //this.$store.dispatch(`${this.moduleName}/update`,payload)
            this.$store.dispatch(`${this.moduleName}/updateItem`, payload)
            this.editedIndex = -1
            this.dialogMove = false

            this.snackbarText = `Item moved to ${this.moveTo}`
            this.snackbarColor = 'success'
            this.snackbar = true
        },
        remove(item){
            this.$store.dispatch(`${this.moduleName}/deleteItem`,item)

            this.snackbarText = `Item deleted`
            this.snackbarColor = 'success'
            this.snackbar = true
        },
    }//METHODS
}//EXPORT CRUD MIXIN





