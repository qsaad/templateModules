export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - AUTH')
    //if(!store.getters.isAuthenticated && route.name !== 'login'){
    if(!store.getters.isAuthenticated){
      console.log('Invalid User ')
      redirect('/')
    }
    else{
      console.log('Valid User Name - ' + store.getters.displayName)
      //console.log('Valid User Group - ' + store.getters.userGroup)
    }
}