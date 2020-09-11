// THIS FILE SHOULD NOT BE VERSION CONTROLLED
importScripts ('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js')
importScripts ('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js')

const staticCacheName = 'site-static-v2'
const dynamicCacheName = 'site-dynamic-v3'
const assets = [
    '/',
    '/offline',
    '/manifest.json',
    '/favicon.ico',
    //'/_loading/sse',
    '/icons/manifest-icon-144.png',
    '/_nuxt/runtime.js',
    '/_nuxt/commons.app.js',
    '/_nuxt/vendors.app.js',
    '/_nuxt/app.js',
    '/_nuxt/pages_index.js',
    'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap',
    'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
    //'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyC68j8B3fHDgycCQLAJB0MXh872mKqGJho',
    //'http://localhost:3000/manifest.json',
    '/images/logo.png',
    '/images/homeGroupView.png',
    '/images/homeTaskView.png',
    '/images/homeShareView.png',
    '/images/homeSettingView.png',
    'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
    'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc4.woff2',
    'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2',
    
    //'/__webpack_hmr/client'
]

if (!firebase.apps.length) {
    const config = {
        apiKey: "AIzaSyD6Bssou2_bi_99Nf2jVHa3suicoddMPsw",
        authDomain: "rapidlyst.firebaseapp.com",
        databaseURL: "https://rapidlyst.firebaseio.com",
        projectId: "rapidlyst",
        storageBucket: "rapidlyst.appspot.com",
        messagingSenderId: "485860192079",
        appId: "1:485860192079:web:34ea5a16b494bc978adf3a",
        measurementId: "G-6PKXBG90M2"
    }

    firebase.initializeApp(config)

    const messaging = firebase.messaging()

    messaging.setBackgroundMessageHandler(payload =>{
        console.log('FIREBASE-MESSAGING-SW - ' + payload)
        let obj = JSON.parse(payload.notification)
        let notificationTitle = obj.title
        let notificationOptions = {
            body : obj.body,
            icon : obj.icon,
            click_action: obj.click_action,
        }

        return self.registration.showNotification(notificationTitle, notificationOptions)
    })

}

//CACHE LIMIT
// const limitCacheSize = (name, size) =>{
//     caches.open(name).then(cache =>{
//         cache.keys().then(keys =>{
//             if(keys.length > size){
//                 cache.delete(keys[0]).then(limitCacheSize(name, size))
//             }
//         })
//     })
// }//LIMIT CACHE SIZE

//INSTALL EVENT
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache =>{
            cache.addAll(assets)
        })//CACHE ASSETS
    )//EXTEND INSTALL EVENT UNTIL ALL CACHING IN COMPLETE
})


//ACTIVATE EVENT
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>{
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )// LOOP AND DELETE OLD CACHES NOT MATCHING CURRENT CACHE NAME
        })//GET CACHES
    )//EXTEND ACTIVATE EVENT UNTIL ALL OLD CACHES ARE DELETED
})


//FETCH EVENT
// self.addEventListener("fetch", event => {
//     if(event.request.url.indexOf('firestore.googleapis.com') === -1){
//         event.respondWith(
//             caches.match(event.request).then(cacheRes =>{
//                 return cacheRes || fetch(event.request).then(fetchRes =>{
//                     return caches.open(dynamicCacheName).then(cache =>{
//                         cache.put(event.request.url, fetchRes.clone())
//                         limitCacheSize(dynamicCacheName, 40)
//                         return fetchRes
//                     })
//                 })
//             })//CACHE
//             .catch( () => {
//                 if(event.request.url.index('.html') > -1){
//                     return caches.match('/offline') 
//                 }
//             })//CATCH
//         )//EVENT RESPONSE
//     }//IF
// })//FETCH EVENT