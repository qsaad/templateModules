import {db, fireAuth} from '~/plugins/firebase.js'
import firebase from '~/plugins/firebase.js'
import Swal from 'sweetalert2'
//import Swal from 'sweetalert2/src/sweetalert2.js'
//import {orderBy, map, find, remove, concat} from "lodash"

let map = require('lodash/map')
let remove = require('lodash/remove')
let concat = require('lodash/concat')

export const strict = false

const collectionName = "groups"

//---------------------------------------------------
//STATE
//---------------------------------------------------
export const state = () => ({
    list : [],
    status: '',
    visited: [],
    readCount: 0,
    writeCount: 0,
    deleteCount: 0,

    count: 0,
    countAdd: 0,
    countUpdate: 0,
    countDelete: 0
})//STATE

//---------------------------------------------------
//GETTERS
//---------------------------------------------------
export const getters = {
    //count : state => state.count,
    // countAdd : state => state.countAdd,
    // countUpdate : state => state.countUpdate,
    // countDelete : state => state.countDelete,
    list : state => state.list,
    visited : state => state.visited,
    status : state => state.status,
    isLoading : state => { return state.status == 'loading' ? true : false },
    count : state => state.list.length,

    readCount : state => state.readCount,
    writeCount : state => state.writeCount,
    deleteCount : state => state.deleteCount,

    nameByGid : (state) => (gid) => {
        return state.list.filter(item => item.gid === gid)[0].name
    },
    gidByName : (state) => (name) => {
        return state.list.filter(item => item.name === name)[0].gid
    },
    members : (state) => (gid) => {
        let group = filter(state.list, {'gid' : gid})
        return pick(group[0],['admins','users'])
    },
    membersByGid : (state) => (gid) => {
        let adminsArr = state.list.filter(item => item.gid === gid)[0].admins
        let usersArr = state.list.filter(item => item.gid === gid)[0].users
        return adminsArr.concat(usersArr)
    },
    listByUid : (state) => (uid) => {
        let usersArr = state.list.filter(item => item.users.includes(uid))
        let adminsArr = state.list.filter(item => item.admins.includes(uid))
        return concat(adminsArr, usersArr)
    },
    listByType : (state) => (uid, type) => {
        let usersArr = state.list.filter(item => item.users.includes(uid))
        let adminsArr = state.list.filter(item => item.admins.includes(uid))
        let arr = concat(adminsArr, usersArr)
        return arr.filter(item => item.type == type)
    },
    listByGid : (state) => (gid) => {
        return state.list.filter(item => item.gid === gid)
    },
    isAdmin : (state) => (gid, uid) => {
        let adminsArr = state.list.filter(item => item.gid === gid)[0].admins
        return adminsArr.includes(uid) ? true : false
        //return includes(adminsArr, uid) ? true : false
    },
    isMember : (state, getters, rootState, rootGetters) => (gid, email) => {
        let arr = getters.membersByGid(gid)
        let uid = rootGetters.uidByEmail(email)
        return arr.includes(uid) ? true : false
    },
    isVisited : (state) => (type) => {
        let arr = state.visited
        return arr.includes(type) 
    },
}//GETTERS

//---------------------------------------------------
//MUTATIONS
//---------------------------------------------------
export const mutations = {
    SET_VISITED(state, payload){
        console.log(`VUEX MUTATION ${collectionName} : SET VISITED`)
        state.visited.push(payload.type)
    },
    SET_STATUS(state, payload){
        state.status = payload
    },
    LOAD_ITEMS(state, payload){
        console.log(`VUEX MUTATION ${collectionName} : LOAD ITEMS`)
        //console.log(payload)
        //state.list.push(payload.flat())
        state.list = payload.flat()
    },
    ADD_ITEM(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : ADD ITEM`)
        state.list.push(payload)
    },
    UPDATE_ITEM(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : UPDATE ITEM`)
        const index = state.list.findIndex(item => item.gid == payload.gid)
        state.list[index] = {...payload}
    },
    DELETE_ITEM(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : DELETE ITEM`)
        state.list.splice(state.list.indexOf(payload), 1)
    },
    ADD_USER(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : ADD USER`)
        const index = state.list.findIndex(item => item.gid == payload.gid)
        if(!state.list[index].users.includes(payload.uid)){
            state.list[index].users.push(payload.uid)
        }
    },
    ADD_ADMIN(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : ADD ADMIN`)
        const index = state.list.findIndex(item => item.gid == payload.gid)
        if(!state.list[index].admins.includes(payload.uid)){
            state.list[index].admins.push(payload.uid)
        }
    },
    DELETE_ADMIN(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : DELETE ADMIN`)
        map(state.list, item => {
            remove(item.admins, uid => uid == payload.uid)
        })
    },
    DELETE_USER(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : DELETE USER`)
        map(state.list, item => {
            remove(item.users, uid => uid == payload.uid)
        })
    },
    //COUNT
    UPDATE_READ_COUNT(state, payload){
        state.readCount += payload.length
    },
    UPDATE_WRITE_COUNT(state, payload){
        state.writeCount += 1
    },
    UPDATE_DELETE_COUNT(state, payload){
        state.deleteCount += 1
    },

}//MUTATIONS

//---------------------------------------------------
//ACTIONS
//---------------------------------------------------
export const actions = {
    //---------------------------------------------------
    //LOAD ITEMS
    //---------------------------------------------------
    async loadItems ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : LOAD ITEMS`)

            commit('SET_STATUS', 'loading')
            let usersQuery = await db.collection(`${collectionName}`)
                .where("users","array-contains", this.state.user.uid)
                .get()
            let adminsQuery = await db.collection(`${collectionName}`)
                .where("admins","array-contains", this.state.user.uid)
                .get()
    
            const [usersArray, adminsArray] = await Promise.all([usersQuery.docs, adminsQuery.docs])
            const groupsArray = concat(adminsArray, usersArray)
    
            let items = []
            groupsArray.length == 0 ? items = [] :  groupsArray.forEach( doc => items.push(doc.data()) )
    
            commit('LOAD_ITEMS', items)
            commit('SET_STATUS', 'success')
            commit('UPDATE_READ_COUNT', items)
           
        }//TRY
        catch(error){
            commit('SET_STATUS', 'error')
            Swal.fire({
                icon: 'error',
                title: 'Load Items Failed',
                text: `Error : ${error.message}`,
            })
        }//CATCH
    },//LOAD ITEMS

    //---------------------------------------------------
    //ADD ITEM
    //---------------------------------------------------
    async addItem ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : ADD ITEM`)
            commit('SET_STATUS', 'loading')
            let query = await db.collection(`${collectionName}`)
                .where("gid","==",payload.gid)
                .where("type","==", payload.type)
                .get()
            if(query.empty){
                //1. ADD GROUP TO DATABASE
                await db.collection(`${collectionName}`).add({...payload, createdOn : firebase.firestore.FieldValue.serverTimestamp()})
                //2. ADD GROUP TO LIST
                commit('ADD_ITEM', {...payload, createdOn : firebase.firestore.FieldValue.serverTimestamp()})
                commit('SET_STATUS', 'success')
                commit('UPDATE_WRITE_COUNT')
            }//IF - NEW GROUP - ADD
            else{
            Swal.fire({
                icon: 'warning',
                title: `Item already exists`,
                text: `Please try another group name`,
            })
            }// ELSE - DUPLICATE GROUP - TRY AGAIN
        }//TRY
        catch(error){
            commit('SET_STATUS', 'error')
            Swal.fire({
                icon: 'error',
                title: 'Add Item Failed',
                text: `Error : ${error.message}`,
            })
        }//CATCH
    },//ADD ITEM

    //---------------------------------------------------
    //UPDATE ITEM
    //---------------------------------------------------
    async updateItem ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : UPDATE ITEM`)
             //1. UPDATE PROJECT IN DATABASE
             commit('SET_STATUS', 'loading')
             let query = await db.collection(`${collectionName}`)
             .where("gid","==",payload.gid)
             .where("type","==", payload.type)
             .get()
            query.forEach((doc) => {
                db.collection(`${collectionName}`).doc(doc.id).update({...payload, updatedOn : firebase.firestore.FieldValue.serverTimestamp()})
            })
            //2. UPDATE ITEM IN STATE LIST
            commit('UPDATE_ITEM', payload)
            commit('SET_STATUS', 'success')
            commit('UPDATE_WRITE_COUNT')
        }//TRY
        catch(error){
            commit('SET_STATUS', 'error')
            Swal.fire({
                icon: 'error',
                title: 'Update Item Failed',
                text: `Error : ${error.message}`,
            })
        }//CATCH
    },//UPDATE ITEM

    //---------------------------------------------------
    //DELETE ITEM
    //---------------------------------------------------
    async deleteItem ({state,getters,commit, dispatch}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : DELETE ITEM`)
            //1. DELETE GROUP FROM DATABASE
            commit('SET_STATUS', 'loading')
            let query = await db.collection(`${collectionName}`)
                .where("gid","==",payload.gid)
                .where("type","==", payload.type)
                .get()

            Swal.fire({
                title: 'Are you sure?',
                text: `${payload.name} group and all it contents will be deleted`,
                icon: 'warning',
                theme: 'dark',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            })
            .then((result) => {
                if (result.value) {
                    query.forEach((doc) => {
                        db.collection(`${collectionName}`).doc(doc.id).delete()
                    })
                    dispatch(`${payload.type}/deleteItems`,{gid: payload.gid},{ root: true })
                    commit('DELETE_ITEM', payload)
                    commit('SET_STATUS', 'success')
                    commit('UPDATE_DELETE_COUNT')
                    Swal.fire(
                    'Deleted!',
                    'Your Group has been deleted.',
                    'success'
                  )
                }
                else{
                    commit('SET_STATUS', '')
                }
            })     
        }//TRY
        catch(error){
            commit('SET_STATUS', 'error')
            Swal.fire({
                icon: 'error',
                title: 'Delete Item Failed',
                text: `Error : ${error.message}`,
            })
        }//CATCH
    },//DELETE ITEM

    //---------------------------------------------------
    //ADD USER
    //---------------------------------------------------
    async addUser ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : ADD USER`)
            //1. UPDATE PROJECT IN DATABASE
            commit('SET_STATUS', 'loading')
            let query = await db.collection(`${collectionName}`)
                .where("gid","==",payload.gid)
                .where("type","==", payload.type)
                .get()

            query.forEach((doc) => {
                db.collection(`${collectionName}`).doc(doc.id).update({ "users": firebase.firestore.FieldValue.arrayUnion(payload.uid) })
            })

            //2. ADD USER TO LIST
            commit('ADD_USER', payload)
            commit('SET_STATUS', 'success')
            commit('UPDATE_WRITE_COUNT')
        }//TRY
        catch(error){
            commit('SET_STATUS', 'error')
            Swal.fire({
                icon: 'error',
                title: 'Add User Failed',
                text: `Error : ${error.message}`,
            })
        }//CATCH
    },//ADD USER

    //---------------------------------------------------
    //DELETE USER
    //---------------------------------------------------
    async deleteUser ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : DELETE USER`)
            commit('SET_STATUS', 'loading')
            let query = await db.collection(`${collectionName}`)
                .where("gid","==",payload.gid)
                .where("type","==", payload.type)
                .get()
            //CHECK IS ADMIN OR USER AND THEN DELETE
            if(getters.isAdmin(payload.gid, payload.uid)){
                query.forEach((doc) => {
                    db.collection(`${collectionName}`).doc(doc.id).update({ "admins": firebase.firestore.FieldValue.arrayRemove(payload.uid) })
                })
                commit('DELETE_ADMIN', payload)
                commit('SET_STATUS', 'success')
            }
            else{
                query.forEach((doc) => {
                    db.collection(`${collectionName}`).doc(doc.id).update({ "users": firebase.firestore.FieldValue.arrayRemove(payload.uid) })
                })
                commit('DELETE_USER', payload)
                commit('SET_STATUS', 'success')
            }
           
            commit('UPDATE_DELETE_COUNT')
           
        }//TRY
        catch(error){
            commit('SET_STATUS', 'error')
            Swal.fire({
                icon: 'error',
                title: 'Delete User Failed',
                text: `Error : ${error.message}`,
            })
        }//CATCH
    },//DELETE USER

    //---------------------------------------------------
    //TOGGLE USER ROLE
    //---------------------------------------------------
    async toggleUserRole ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : TOGGLE USER ROLE`)
            //1. UPDATE PROJECT IN DATABASE
            commit('SET_STATUS', 'loading')
            let query = await db.collection(`${collectionName}`)
                .where("gid","==",payload.gid)
                .where("type","==", payload.type)
                .get()

            if(payload.role == 'admin'){
                console.log(`USER ROLE CHANGED TO ADMIN`)
                query.forEach((doc) => {
                    db.collection(`${collectionName}`).doc(doc.id).update({ "admins": firebase.firestore.FieldValue.arrayUnion(payload.uid) })
                })
                query.forEach((doc) => {
                    db.collection(`${collectionName}`).doc(doc.id).update({ "users": firebase.firestore.FieldValue.arrayRemove(payload.uid) })
                })
                commit('DELETE_USER', payload)
                commit('ADD_ADMIN', payload)
                commit('SET_STATUS', 'success')
                commit('UPDATE_WRITE_COUNT')
                commit('UPDATE_DELETE_COUNT')
            }
            else{
                console.log(`USER ROLE CHANGED TO USER`)
                query.forEach((doc) => {
                    db.collection(`${collectionName}`).doc(doc.id).update({ "users": firebase.firestore.FieldValue.arrayUnion(payload.uid) })
                })
                query.forEach((doc) => {
                    db.collection(`${collectionName}`).doc(doc.id).update({ "admins": firebase.firestore.FieldValue.arrayRemove(payload.uid) })
                })
                commit('DELETE_ADMIN', payload)
                commit('ADD_USER', payload)
                commit('SET_STATUS', 'success')
                commit('UPDATE_WRITE_COUNT')
                commit('UPDATE_DELETE_COUNT')
            }
            
        }//TRY
        catch(error){
            commit('SET_STATUS', 'error')
            Swal.fire({
                icon: 'error',
                title: 'Toggle user role Failed',
                text: `Error : ${error.message}`,
            })
        }//CATCH
    },//TOGGLE USER ROLE


}//ACTIONS