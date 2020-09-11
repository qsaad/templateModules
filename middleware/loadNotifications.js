export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADNOTIFICATIONS - ' + route.name)
    if (store.state.notifications.list.length === 0) {
      console.log('Load Notification')
      //store.dispatch('notifications/get')
      store.dispatch('notifications/loadItems')
    }
    else{
      console.log('Notification already loaded')
    }
}