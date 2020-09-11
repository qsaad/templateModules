import {db, fireAuth} from '~/plugins/firebase.js'
import firebase from '~/plugins/firebase.js'
import Swal from 'sweetalert2'
//import router from './router'

export const strict = false

const collectionName = "tasks"

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

    // count: 0,
    // countAdd: 0,
    // countUpdate: 0,
    // countDelete: 0,
    // visitedGroups:[]
    //tasks : [],
})//STATE

//---------------------------------------------------
//GETTERS
//---------------------------------------------------
export const getters = {
    //DEBUGGING
    // count : state => state.count,
    // countAdd : state => state.countAdd,
    // countUpdate : state => state.countUpdate,
    // countDelete : state => state.countDelete,
    // visitedGroups : state => state.visitedGroups,
    //DATA
    list : state => state.list,
    visited : state => state.visited,
    status : state => state.status,
    isLoading : state => { return state.status == 'loading' ? true : false },
    readCount : state => state.readCount,
    writeCount : state => state.writeCount,
    deleteCount : state => state.deleteCount,
    listByGid : (state) => (gid) => {
        return state.list.filter(item => item.gid === gid)
    },
    isVisited : (state) => (gid) => {
        let arr = state.visited
        return arr.includes(gid) 
    },
}//GETTERS

//---------------------------------------------------
//MUTATIONS
//---------------------------------------------------
export const mutations = {
    SET_VISITED(state, payload){
        console.log(`VUEX MUTATION ${collectionName} : SET VISITED`)
        state.visited.push(payload.gid)
    },
    SET_UNVISITED(state, payload){
        //state.visited.push(payload.gid)
        console.log(`VUEX MUTATION ${collectionName} : SET UNVISITED`)
        state.visited.splice(state.visited.indexOf(payload.gid), 1)
    },
    SET_STATUS(state, payload){
        state.status = payload
    },
    LOAD_ITEMS(state, payload){
        console.log(`VUEX MUTATION ${collectionName} : LOAD ITEMS`)
        payload.forEach(item => state.list.push(item))
    },
    ADD_ITEM(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : ADD ITEM`)
        state.list.push(payload)
    },
    UPDATE_ITEM(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : UPDATE ITEM`)
        const index = state.list.findIndex(item => item.tid == payload.tid)
        state.list[index] = {...payload}
    },
    DELETE_ITEM(state,payload){
        console.log(`VUEX MUTATION ${collectionName} : DELETE ITEM`)
        state.list.splice(state.list.indexOf(payload), 1)
    },
    //COUNT
    UPDATE_READ_COUNT(state, payload){
        state.readCount += payload.length
    },
    UPDATE_WRITE_COUNT(state, payload){
        payload > 1 ? state.writeCount += payload : state.writeCount += 1
    },
    UPDATE_DELETE_COUNT(state, payload){
        payload > 1 ? state.deleteCount += payload : state.deleteCount += 1
    },

}//MUTATIONS

//---------------------------------------------------
//ACTIONS
//---------------------------------------------------
export const actions = {
    //---------------------------------------------------
    //SYNC ITEMS
    //---------------------------------------------------
    syncItems : ({state,getters,commit, dispatch}, payload) => {
        console.log(`VUEX ACTION ${collectionName} : SYNC ITEMS`)
        commit('SET_UNVISITED', payload)
        dispatch('loadItems',payload);
    },
    //---------------------------------------------------
    //LOAD ITEMS
    //---------------------------------------------------
    async loadItems ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : LOAD ITEMS`)
            if(!getters.isVisited(payload.gid)){
                commit('SET_VISITED', payload)
                commit('SET_STATUS', 'loading')
                let items = []
                let query = await db.collection(`${collectionName}`).where("gid","==" , payload.gid).get()
                query.forEach((doc) => {
                    items.push(doc.data())
                })
               
                commit('LOAD_ITEMS', items)
                commit('SET_STATUS', 'success')
                commit('UPDATE_READ_COUNT', items)
            }
            else{
                commit('SET_STATUS', '')
            }
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
            let query = await db.collection(`${collectionName}`).where("gid","==",payload.gid).where("tid","==",payload.tid).get()
            if(query.empty){
              //1. ADD GROUP TO DATABASE
              await db.collection(`${collectionName}`).add({...payload, createdOn : firebase.firestore.FieldValue.serverTimestamp()})
              //2. ADD ITEM TO STATE LIST
              commit('ADD_ITEM', {...payload, createdOn : firebase.firestore.FieldValue.serverTimestamp()})
              commit('SET_STATUS', 'success')
              commit('UPDATE_WRITE_COUNT')

            }//IF - NEW GROUP - ADD
            else{
                Swal.fire({
                    icon: 'warning',
                    title: `${payload.text} already exists`,
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
            let query = await db.collection(`${collectionName}`).where("tid","==",payload.tid).get()
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
    async deleteItem ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : DELETE ITEM`)
            //1. DELETE PROJECT FROM DATABASE
            commit('SET_STATUS', 'loading')
            let query = await db.collection(`${collectionName}`).where("gid","==",payload.gid).where("tid","==",payload.tid).get()
            query.forEach((doc) => {
                db.collection(`${collectionName}`).doc(doc.id).delete()
            })
            //2. DELETE SCHEDULE FROM LIST
            commit('DELETE_ITEM', payload)
            commit('SET_STATUS', 'success')
            commit('UPDATE_DELETE_COUNT')
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
    //DELETE ITEMS (FIRED WHEN GROUP IS DELETED)
    //---------------------------------------------------
    async deleteItems ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : DELETE ITEMS`)
            //1. DELETE PROJECT FROM DATABASE
            let query = await db.collection(`${collectionName}`).where("gid","==",payload.gid).get()
            query.forEach((doc) => {
                db.collection(`${collectionName}`).doc(doc.id).delete()
                commit('DELETE_ITEM', doc.data())
                commit('UPDATE_DELETE_COUNT')
            })
            commit('SET_STATUS', 'success')
        }//TRY
        catch(error){
            commit('SET_STATUS', 'error')
            Swal.fire({
                icon: 'error',
                title: 'Delete Items Failed',
                text: `Error : ${error.message}`,
            })
        }//CATCH
    },//DELETE ITEMS

}//ACTIONS