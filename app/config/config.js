app.config(($routeProvider, $locationProvider) => {
//firebaseAuth here

 firebase.initializeApp({
   apiKey: "AIzaSyB_ZNOxBEUAKGKdWVS3_Lfd5sDGmQ11GkI",
   authDomain: "reddit-steve.firebaseapp.com",
   databaseURL: "https://reddit-steve.firebaseio.com",
   storageBucket: "reddit-steve.appspot.com",
   messagingSenderId: "386901472273"
 })





  $locationProvider.hashPrefix("")
  $routeProvider
  .when('/main', {
    controller: 'homeCtrl',
    templateUrl: '/shared/components/homeView.html',
    resolve: {
      // authentication resolves from factories
    }
  })
})
