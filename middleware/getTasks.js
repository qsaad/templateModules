export default({ store, route, params, redirect }) => {
    console.log('MIDDLEWARE - LOADTASKS - ' + route.name)
    if (store.state.tasks.list.length === 0) {
      store.dispatch('tasks/get',{ gid : params.gid })
    }
}