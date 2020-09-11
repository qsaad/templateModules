export default({ store, route, redirect }) => {
    console.log('MIDDLEWARE - LOADGROUPS - ' + route.name)
    if (store.state.groups.list.length === 0) {
      console.log('FETCHED GROUPS FROM FIREBASE')
      store.dispatch('groups/loadItems',{type: route.name})
    }
    // if(route.name == 'share'){
    //   store.dispatch('groups/loadItems',{type: 'tasks'})
    // }
    // else{
    //   store.dispatch('groups/loadItems',{type: route.name})
    // }
}