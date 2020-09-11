import {db, fireAuth} from '~/plugins/firebase.js'
import firebase from '~/plugins/firebase.js'
import Swal from 'sweetalert2'

export const strict = false

const collectionName = "notifications"

//---------------------------------------------------
//STATE
//---------------------------------------------------
export const state = () => ({
    list : [],
    //count: 0,
    status: '',
    readCount: 0,
    writeCount: 0,
    deleteCount: 0,

})//STATE

//---------------------------------------------------
//GETTERS
//---------------------------------------------------
export const getters = {
    count : state => state.list.length,
    unreadCount : state => state.list.filter(item => item.read === false).length,
    list : state => state.list,
    status : state => state.status,
    readCount : state => state.readCount,
    writeCount : state => state.writeCount,
    deleteCount : state => state.deleteCount,
    //listByUid : state => state.list.filter(item => item.uid == this.state.user.uid),
    listByUid : (state) => (uid) => {
        return state.list.filter(item => item.uid === uid)
    },
}//GETTERS

//---------------------------------------------------
//MUTATIONS
//---------------------------------------------------
export const mutations = {
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
        console.log(payload)
        const index = state.list.findIndex(item => item.nid == payload.nid)
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
    //LOAD ITEMS
    //---------------------------------------------------
    async loadItems ({state,getters,commit}, payload) {
        try{
            console.log(`VUEX ACTION ${collectionName} : LOAD ITEMS`)
            commit('SET_STATUS', 'loading')
            let items = []
            let query = await db.collection(`${collectionName}`).where('uidTo', '==', this.state.user.uid).get()
            query.forEach((doc) => {
                items.push(doc.data())
            })
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
            //1. ADD  NOTIFICATION TO DATABASE
            commit('SET_STATUS', 'loading')
            await db.collection(`${collectionName}`).add({...payload, createdOn : firebase.firestore.FieldValue.serverTimestamp()})
            //2. ADD  NOTIFICATION TO LIST
            commit('ADD_ITEM', {...payload, createdOn : firebase.firestore.FieldValue.serverTimestamp()})
            commit('SET_STATUS', 'success')
            commit('UPDATE_WRITE_COUNT')
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
            let query = await db.collection(`${collectionName}`).where("nid","==",payload.nid).get()
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
            commit('SET_STATUS', 'loading')
            let query = await db.collection(`${collectionName}`).where("nid","==",payload.nid).get()
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


}//ACTIONS