export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADUSERS - ' + route.name)
    if (store.state.list.length === 0) {
      console.log('FETCHED USERS FROM FIREBASE')
      store.dispatch('loadUsers')
    }
    
}