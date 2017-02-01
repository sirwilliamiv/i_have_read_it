app.config(($routeProvider, $locationProvider) => {
  //firebaseAuth here

  firebase.initializeApp({
    apiKey: "AIzaSyB_ZNOxBEUAKGKdWVS3_Lfd5sDGmQ11GkI",
    authDomain: "reddit-steve.firebaseapp.com",
    databaseURL: "https://reddit-steve.firebaseio.com",
    storageBucket: "reddit-steve.appspot.com",
    messagingSenderId: "386901472273"
  });





  $locationProvider.hashPrefix("")
  $routeProvider
    .when('/main', {
      controller: 'homeCtrl',
      templateUrl: '/shared/components/homeView.html',
      resolve: {
        // authentication resolves from factories
      }
    })
    .when('/login', {
      controller: 'loginCtrl',
      templateUrl: '/shared/components/homeView.html',
    })
    .when('/register', {
      controller: 'registerCtrl',
      templateUrl: '/shared/components/homeView.html',
    })
    .when('/post', {
      controller: 'postCtrl',
      templateUrl: '/shared/components/homeView.html',
    })
    .otherwise({
      redirectTo: '/main'
    });
});
