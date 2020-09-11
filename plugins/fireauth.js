import { fireAuth } from './firebase.js'

export default context => {
  const { store, route } = context

  return new Promise((resolve, reject) => {
    fireAuth.onAuthStateChanged(user => {
      if (user) {
        console.log('USER ALREADY LOGGED IN')
        //return resolve(store.dispatch('setUser', user))
      }
      return resolve()
    })
  })
}