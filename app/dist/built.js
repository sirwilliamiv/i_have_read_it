console.log("hey");

const app = angular.module('iHaveReadIt', ['ngRoute']);
;
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
    controller:'loginCtrl'
  });
});
;
app.controller('homeCtrl', function($scope, $location, authFactory, redditFactory) {

    $scope.newPost = () => {

        redditFactory.newPost($scope.Photo, $scope.Title)
            .then(() => {
                console.log("much success")
            })
            .catch((error) => console.log(error))
    }

        redditFactory.getPosts()
            .then((allPosts) => {
                $scope.all = allPosts.data
                console.log("posts", $scope.all)
            });

    // $scope.getPosts()





    //Auth
    $scope.logout = () => {
        authFactory.logout()
            .then(() => console.log('logged out'))
    }

  $scope.userLogin = () => {

    authFactory.login($scope.user_email, $scope.user_password)
      .then(() => console.log("woohoo"));
  };
  $scope.createUser = () => {
    console.log($scope.user_email)
    authFactory.createUser($scope.user_email, $scope.user_password)
      .then(() => console.log("success"));
  };


    //materialize Modals below
    $('#loginButton').click(() => {
        $('#loginModal').modal('open')
    })


    $('.registerButton').click(() => {
        $('#registerModal').modal('open')
    })

    $('#newPost').click(() => {
        $('#postModal').modal('open')
    })

    //register
    $('#registerModal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: 0.3, // Opacity of modal background
        inDuration: 750, // Transition in duration
        outDuration: 700, // Transition out duration
        startingTop: '100%', // Starting top style attribute
        endingTop: '20%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

      console.log(modal, trigger);
    },
    complete: function() { console.log('Closed'); } // Callback for Modal close
  });
  //register
  $('#registerModal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: 0.3, // Opacity of modal background
    inDuration: 750, // Transition in duration
    outDuration: 700, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '20%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

      console.log(modal, trigger);
    },
    complete: function() { console.log('Closed'); } // Callback for Modal close
  });


  $('#postModal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: 0.3, // Opacity of modal background
    inDuration: 700, // Transition in duration
    outDuration: 700, // Transition out duration
    startingTop: '0%', // Starting top style attribute
    endingTop: '20%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

      console.log(modal, trigger);
    },
    complete: function() { console.log('Closed'); } // Callback for Modal close
  });

})
;
app.controller('loginCtrl', function($scope, $location) {


// $('#loginModal').modal('open');
      //login
  $('#loginModal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.3, // Opacity of modal background
      inDuration: 700, // Transition in duration
      outDuration: 700, // Transition out duration
      startingTop: '0%', // Starting top style attribute
      endingTop: '20%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

          console.log(modal, trigger);
      },
      complete: function() { console.log('Closed'); } // Callback for Modal close
  });
});
;
app.factory('authFactory', ($q) => {
  return {
    login(email, pass) {
      console.log("auth", email);
      return $q.resolve(firebase.auth().signInWithEmailAndPassword(email, pass).then((data) => {
        console.log(data.uid);
        return UID = data.uid;
      }));
    }, //end login

    createUser(email, pass) {
      console.log("email", email);
      return $q.resolve(firebase.auth().createUserWithEmailAndPassword(email, pass));

    }, //end createUser
    getUser() {
      return $q((resolve, reject) => {
          const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
              unsubscribe();
              if (user) {
                resolve(user);
              } else {
                reject();
              }

            }); //end const unsubscribe
        }); //end return getUser
    }, //end getUser
    logout() {
      return $q.resolve(firebase.auth().signOut());
    }
  }; //end of return object
}); //end factory
;
app.factory('redditFactory', ($q, authFactory, $http) => {

  return {
    newPost(url, title) {

      return authFactory.getUser().then(user => {
        console.log("addingpost")
          // $scope.title, $scope.artist, $scope.album, $scope.length
        return $http.post(`https://reddit-steve.firebaseio.com/posts.json`, {
          uid: user.uid,
          Title: title,
          Link: url,
          // Name: first
          // Upvotes:,
          // Downvotes:,
          // Image:
        })
      })
    },
    getPosts() {
      return $http.get(`https://reddit-steve.firebaseio.com/posts.json`)
    }
  }
})
