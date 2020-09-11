import {db, fireAuth} from '~/plugins/firebase.js'
import firebase from '~/plugins/firebase.js'
import Swal from 'sweetalert2'
import * as modules from '@/data/modulesData' 

let concat = require('lodash/concat')

export const strict = false

const collectionName = "index"

//---------------------------------------------------
//STATE
//---------------------------------------------------
export const state = () => ({
    user : {},
    status: '',
    role : '',
    setting : {
      color: "", 
      modules: []
    },
    list : [],

    authCount: 0,
    readCount: 0,
    writeCount: 0,
    deleteCount: 0,
})//STATE

//---------------------------------------------------
//GETTERS
//---------------------------------------------------
export const getters = {
    authCount : state => state.readCount,
    readCount : state => state.readCount,
    writeCount : state => state.writeCount,
    deleteCount : state => state.deleteCount,

    user : state => state.user,
    userData : state => (uid) =>{
      let user = state.list.filter(item => item.uid === uid)[0]
      return {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
      }
    },
    list : state => state.list,
    setting : state => state.setting,
    modules : state => state.setting.modules,
    color : state => state.setting.color,
    role : state => state.role,
    uid : state => state.user.uid,
    email : state => state.user.email,
    displayName : state => state.user.displayName,
    photoURL : state => state.user.photoURL,
    isAuthenticated : state => { return state.user != null ? true : false },
    isLoading : state => { return state.status == 'loading' ? true : false },
    uidByEmail : (state) => (email) => {
      return state.list.filter(item => item.email === email)[0].uid
    },
    displayNameByUid : (state) => (uid) => {
      return state.list.filter(item => item.uid === uid)[0].displayName
    },
    colorByUid : (state) => (uid) => {
      return state.list.filter(item => item.uid === uid)[0].setting.color
    },
    hasModule : (state) => (name) => {
      return state.setting.modules.includes(name)
    },
}//GETTERS

//---------------------------------------------------
//MUTATIONS
//---------------------------------------------------
export const mutations = {
    SET_STATUS(state, payload){
      state.status = payload
    },
    UPDATE_COLOR(state, payload){
      console.log(`VUEX MUTATION ${collectionName} : UPDATE COLOR`)
      state.setting.color = payload.color
      const index = state.list.findIndex(item => item.uid == payload.uid)
      state.list[index].setting.color = payload.color
    },
    SET_SETTING(state, payload){
      console.log(`VUEX MUTATION ${collectionName} : SET SETTING`)
      state.setting = payload
    },
    ADD_MODULE(state, payload){
      console.log(`VUEX MUTATION ${collectionName} : ADD MODULE`)
      state.setting.modules.push(payload)
    },
    REMOVE_MODULE(state, payload){
      console.log(`VUEX MUTATION ${collectionName} : REMOVE MODULE`)
      state.setting.modules.splice(state.setting.modules.indexOf(payload), 1)
    },
    SET_USER(state, payload){
      console.log(`VUEX MUTATION ${collectionName} : SET USER`)
      if(payload == null){
        console.log(`NULL`)
        state.user = null
        state.list = []
        state.role = ''
        state.setting = []
        state.status = ''
      }
      else{
        console.log(`AUTH`)
        state.user = payload
      }
    },

    LOAD_USERS(state, payload){
      console.log(`VUEX MUTATION ${collectionName} : LOADUSERS`)
      state.list = payload.flat()
    },

    //COUNT
    UPDATE_AUTH_COUNT(state, payload){
      payload > 1 ? state.authCount += payload : state.authCount += 1
    },
    UPDATE_READ_COUNT(state, payload){
        state.readCount += 1
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
    //LOAD USERS
    //---------------------------------------------------
    async loadUsers ({state,getters,commit}, payload) {
      try{
        commit('SET_STATUS', 'loading')
        if(getters.list.length == 0){
          let query = await db.collection("users").get()
          let items = []
          query.forEach((doc) => {
            items.push(doc.data())
          }) 
          commit('LOAD_USERS', items)
          commit('SET_STATUS', 'success')
          commit('UPDATE_WRITE_COUNT', items)
        }
        else{
          console.log('USERS LIST ALREADY LOADED')
        }
      }//TRY
      catch(error){
        commit('SET_STATUS', 'error')
        Swal.fire({
          icon: 'error',
          title: 'Load Users Failed',
          text: `Error : ${error.message}`,
        })
      }//CATCH
    },//LOAD USER

    async addSetting ({state,getters,commit, dispatch}, payload) {
      try{
        console.log(`VUEX ACTION ${collectionName} : UPDATE SETTING`)
        commit('SET_STATUS', 'loading')
        let userDocs = await db.collection("users").where("uid","==",payload.uid).get()

        commit('SET_STATUS', 'success')
        commit('UPDATE_READ_COUNT')
       
        userDocs.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            createdOn : firebase.firestore.FieldValue.serverTimestamp(),
            setting: {
              color: 'green',
              modules: modules.data.map(item => item.name)
            }
          })
        })
      }//TRY
      catch(error){
        commit('SET_STATUS', 'error')
        Swal.fire({
            icon: 'warning',
            title: 'Add setting failed',
            text: 'Error' + error.message,
        })
      }//CATCH
    },//ADD SETTING

    //---------------------------------------------------
    //SET COLOR
    //---------------------------------------------------
    async updateColor ({state,getters,commit, dispatch}, payload) {
      try{
        console.log(`VUEX ACTION ${collectionName} : UPDATE COLOR`)
        commit('SET_STATUS', 'loading')

        let query = await db.collection("users").where("uid","==", state.user.uid).get()

        query.forEach((doc) => {
          db.collection("users").doc(doc.id).update({ 
            "setting.color": payload
          })
        })
        
        commit('UPDATE_COLOR', {color: payload, uid: state.user.uid})
        commit('UPDATE_WRITE_COUNT')
        commit('SET_STATUS', 'success')
        
      }//TRY
      catch(error){
        commit('SET_STATUS', 'error')
        Swal.fire({
            icon: 'warning',
            title: 'UPDATE COLOR failed',
            text: 'Avatar color was not updated ' + error.message,
        })
      }//CATCH
    },//SET COLOR

    //---------------------------------------------------
    //SET MODULES
    //---------------------------------------------------
    async toggleModule ({state,getters,commit, dispatch}, payload) {
      try{
        console.log(`VUEX ACTION ${collectionName} : TOGGLE MODULE`)
        commit('SET_STATUS', 'loading')

        let query = await db.collection("users").where("uid","==", state.user.uid).get()

        //let modules = getters.modules

        //if(modules.includes(payload)){
        if(getters.hasModule(payload)){
          commit('REMOVE_MODULE', payload)
          commit('UPDATE_DELETE_COUNT')
          query.forEach((doc) => {
            db.collection("users").doc(doc.id).update({ 
              "setting.modules": firebase.firestore.FieldValue.arrayRemove(payload)
            })
          })
        }
        else{
          commit('ADD_MODULE', payload)
          commit('UPDATE_WRITE_COUNT')
          query.forEach((doc) => {
            db.collection("users").doc(doc.id).update({ 
              "setting.modules": firebase.firestore.FieldValue.arrayUnion(payload)
            })
          })
        }
        commit('SET_STATUS', 'success')
        
      }//TRY
      catch(error){
        commit('SET_STATUS', 'error')
        Swal.fire({
            icon: 'warning',
            title: 'TOGGLE MODULE failed',
            text: 'Modules list not updated ' + error.message,
        })
      }//CATCH
    },//SET MODULES

    //---------------------------------------------------
    //SET USER
    //---------------------------------------------------
    async setUser ({state,getters,commit, dispatch}, payload) {
      try{
        console.log(`VUEX ACTION ${collectionName} : SETUSER`)
        //let user = firebase.auth().currentUser
        let userDocs = await db.collection('users').where("uid","==",payload.uid).get()

        if(payload.emailVerified){
          commit('SET_STATUS', 'success')
          commit('UPDATE_AUTH_COUNT')
          commit('UPDATE_READ_COUNT')
          commit('SET_USER', payload)
          userDocs.forEach( doc => commit('SET_SETTING', doc.data().setting) )

          dispatch('loadUsers')
          dispatch('groups/loadItems',{ root: true })
          this.$router.replace('/modules').catch(err => console.log(err) )
        }
        else{
          Swal.fire({
            type: 'warning',
            title: 'VERIFY EMAIL',
            text: 'Check your email for verification link',
          })
          this.$router.replace('/')
        }
      }//TRY
      catch(error){
        commit('SET_STATUS', 'error')
        Swal.fire({
            icon: 'warning',
            title: 'SET USER failed',
            text: 'Current user not found' + error.message,
        })
      }//CATCH
    },//SET USER

     //---------------------------------------------------
    //SIGNUP
    //---------------------------------------------------
    async signup ({state,getters,commit, dispatch}, payload) {
      try{
        console.log(`VUEX ACTION INDEX : SIGNUP`)

        commit('SET_STATUS', 'loading')
        
        const userAuth = await fireAuth.createUserWithEmailAndPassword(payload.email,payload.password)
        if(userAuth){
            //ADD USER NAME TO AUTHENTICATION
            userAuth.user.updateProfile({displayName: payload.fname + ' ' + payload.lname})
            commit('SET_STATUS', 'success')
            commit('UPDATE_AUTH_COUNT')
            //SEND VERIFICATION EMAIL
            userAuth.user.sendEmailVerification()
            .then(() =>{
                //DELETES PASSWORD FROM PAYLOAD
                delete payload.password
                //CREATES REFERENCE TO USERS COLLECTION
                let arr = modules.data
                let modulesList = arr.map(item => item.name)
                db.collection("users").add({
                    uid : userAuth.user.uid,
                    email : payload.email,
                    displayName : payload.fname + ' ' + payload.lname,
                    createdOn : firebase.firestore.FieldValue.serverTimestamp(),
                    setting: {
                      color: 'green',
                      modules: modulesList
                    }
                })
                Swal.fire({
                  icon: 'success',
                  title: 'REGISTRATION SUCCESSFULLY',
                  text: 'Check you email for activation link',
                })

                this.$router.replace('/')
            })//ALERT
          }//SEND EMAIL VERIFICATION
      }//TRY
      catch(error){
        commit('SET_STATUS', 'error')
        Swal.fire({
            icon: 'warning',
            title: 'Signup failed',
            text: 'Signup error' + error.message,
        })
      }//CATCH
    },//LOGIN

    //---------------------------------------------------
    //LOGIN
    //---------------------------------------------------
    async login ({state,getters,commit, dispatch}, payload) {
      try{
        console.log(`VUEX ACTION ${collectionName} : LOGIN`)

        commit('SET_STATUS', 'loading')
        let userAuth = await fireAuth.signInWithEmailAndPassword(payload.email, payload.password)
        let userDocs = await db.collection('users').where("uid","==",userAuth.user.uid).get()
       
        //ROUTE VERIFIED USERS TO DASHBOARD
        if(userAuth.user.emailVerified){
            commit('SET_USER', userAuth.user)
            userDocs.forEach( doc => commit('SET_SETTING', doc.data().setting) )
            commit('SET_STATUS', 'success')
            commit('UPDATE_AUTH_COUNT')

            dispatch('loadUsers')
            dispatch('groups/loadItems', { root: true })
           
            this.$router.replace('/modules').catch(err => console.log(err) )
        }//IF VERIFIED
        else{
            Swal.fire({
                type: 'warning',
                title: 'VERIFY EMAIL',
                text: 'Check your email for verification link',
            })
            this.$router.replace('/')
        }//ELSE UNVERIFIED
      }//TRY
      catch(error){
        commit('SET_STATUS', 'error')
        Swal.fire({
            icon: 'warning',
            title: 'Login failed',
            text: 'login credentials not found' + error.message,
        })
      }//CATCH
    },//LOGIN

    //---------------------------------------------------
    //LOGOUT
    //---------------------------------------------------
    async logout ({state,getters,commit}, payload) {
      try{
          console.log(`VUEX ACTION ${collectionName} : LOGOUT`)
          await fireAuth.signOut().then(()=>{
            commit('SET_STATUS', 'success')
            commit('SET_USER', null)
            commit('UPDATE_AUTH_COUNT')
            this.$router.replace('/')
          })
      }//TRY
      catch(error){
          commit('SET_STATUS', 'error')
          Swal.fire({
              icon: 'error',
              title: 'Logout Failed',
              text: `Error : ${error.message}`,
          })
      }//CATCH
    },//LOGOUT

    //---------------------------------------------------
    //RESET PASSWORD
    //---------------------------------------------------
    async reset ({state,getters,commit}, payload) {
      try{
        console.log(`VUEX ACTION INDEX : RESET`)
        commit('SET_STATUS', 'loading')
        await fireAuth.sendPasswordResetEmail(payload.email)
        commit('SET_STATUS', 'success')
        this.$router.replace('/')
      }//TRY
      catch(error){
        commit('SET_STATUS', 'error')
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: `Error : ${error.message}`,
        })
      }//CATCH
    },//LOAD USER

}//ACTIONS