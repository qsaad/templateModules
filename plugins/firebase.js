import firebase from 'firebase/app'
import 'firebase/auth'          // for authentication
import 'firebase/storage';      // for storage
import 'firebase/firestore'     // for cloud firestore
import 'firebase/messaging';    // for cloud messaging
import 'firebase/functions';    // for cloud functions

    if(!firebase.apps.length) {
    //-------------------------------------------------------------------
    //FIRBASE CONFIGURATION
    //--------------------------------------------------------------------
        const config = {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            databaseURL: process.env.DATABASE_URL,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID,
            appId: process.env.APP_ID,
            measurementId: process.env.MEASUREMENT_ID
        }
    
    !firebase.apps.length ? firebase.initializeApp(config) : ''

    // firebase.firestore().enablePersistence()
    // .catch( err => {
    //     if (err.code == 'failed-precondition') {
    //       // Multiple tabs open, persistence can only be enabled
    //       // in one tab at a a time.
    //       console.log('Multiple tabs open - Persistence failed')
    //     } else if (err.code == 'unimplemented') {
    //       // The current browser does not support all of the
    //       // features required to enable persistence
    //       console.log('Current browser does not support persistence feature')
    //     }
    // })

}//FIREBASE APP

export const fireAuth = firebase.auth()
export const db = firebase.firestore()
export const functions = firebase.functions()
export default firebase