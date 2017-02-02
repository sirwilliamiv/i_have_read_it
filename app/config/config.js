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
          showPosts (redditFactory, $route) {
            return redditFactory.getPosts()
          },
          user (authFactory, $location) {
            return authFactory.getUser().catch(() => {
                 var $toastContent = $('<span>Please Register or Login to contribute to content </span>');
              // Materialize.toast($toastContent, 500);
               // $('#loginModal').modal('open');
              $location.url('/login')})
          },
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
    }).when('/logout', {
      controller: 'logoutCtrl',
      templateUrl: '/shared/components/homeView.html',
    })
    .otherwise({
      redirectTo: '/main'
    });
});
