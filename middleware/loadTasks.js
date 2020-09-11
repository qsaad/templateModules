export default({ store, route, redirect, params }) => {
    console.log('MIDDLEWARE - LOADTASKS - ' + route.name)
    //console.log(params)
    // if (store.state.tasks.list.length === 0) {
    //     store.dispatch('tasks/load')
    // }
}