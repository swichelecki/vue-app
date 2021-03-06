import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import {routes} from './router'
import firebase from 'firebase/app'
import 'firebase/database'
import Slip from './slip'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDz1BnTdGWyDU8u-ikoo62ysGg0eylAZU8",
  authDomain: "vue-app-c7d24.firebaseapp.com",
  databaseURL: "https://vue-app-c7d24.firebaseio.com",
  projectId: "vue-app-c7d24",
  storageBucket: "vue-app-c7d24.appspot.com",
  messagingSenderId: "121601252233"
};
firebase.initializeApp(config);

let router = new Router({mode: 'history', routes});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
