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
;
app.controller('homeCtrl', function($scope, $location, authFactory, redditFactory) {
  redditFactory.getPosts()
    .then((allPosts) => {
      $scope.all = allPosts.data;
      console.log("posts", $scope.all);
    });

  redditFactory.getPosts()
    .then((allPosts) => {
      $scope.all = allPosts.data
      console.log("posts", $scope.all)
    })

  // $scope.getPosts()

  // onclick post the result to firebase
  $scope.upVote = (vote, score, key) => {
    console.log('upvoted', vote, 'score', score, 'key', key);
    let newVote = ((parseInt(vote, 10) + 1).toString());
    let newScore = ((parseInt(score, 10) + 1).toString());
    console.log('upvoted', newVote, 'score', newScore, 'key', key);
    // patch to reddit factory on key to update upvote and score
    redditFactory.updateUpvotes(key, newVote);
    redditFactory.updateScore(key, newScore);
  }

  $scope.downVote = (vote, score, key) => {
    console.log('downvoted', vote, 'score', score, 'key', key);
    let newVote = ((parseInt(vote, 10) + 1).toString());
    let newScore = ((parseInt(score, 10) - 1).toString());
    console.log('downvoted', newVote, 'score', newScore, 'key', key);
    // patch to reddit factory on key to update upvote and score
    redditFactory.updateDownvotes(key, newVote);
    redditFactory.updateScore(key, newScore);
  }


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




})
;
app.controller('loginCtrl', function($scope, $location) {


$('#loginModal').modal('open');
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
app.controller('postCtrl', function($scope, $location, redditFactory) {
console.log('postCtrl!')
// use postid to name file
 $scope.newPost = () => {
    debugger
    redditFactory.newPost($scope.Link, $scope.Title)
      .then(() => {
        console.log("much success")
      })
      .catch(() => $location.path('/login'))

  }

  //upload a photo
  $scope.handleFiles = function(evt) {
    let storageRef = firebase.storage().ref();
    // var fileList = evt.target.files;  now you can work with the file list
    // console.log("filelist[0]", fileList[0])
    console.log($scope.File)
    storageRef.child($scope.File).put($scope.File)
      .then(function(snapshot) {
        console.log(snapshot.downloadURL)

        // console.log('Uploaded a blob or file!', spaceRef.name);
        // return spaceRef.name
      }).catch(console.error);
  }


  $('#postModal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .3, // Opacity of modal background
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
app.controller('registerCtrl', function($scope, $location) {

    //register
    $('#registerModal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .3, // Opacity of modal background
        inDuration: 750, // Transition in duration
        outDuration: 700, // Transition out duration
        startingTop: '100%', // Starting top style attribute
        endingTop: '20%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

      console.log(modal, trigger);
    },
    complete: function() { console.log('Closed'); } // Callback for Modal close
  });
})
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
                reject('Not Logged In');
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
    newPost(link, title) {
      console.log('NEW POST')
      return authFactory.getUser().then(user => {
        console.log("addingpost")
          // $scope.title, $scope.artist, $scope.album, $scope.length
        return $http.post(`https://reddit-steve.firebaseio.com/posts.json`, {
          uid: user.uid,
          Title: title,
          Link: link,
          // Photoid:
          // Upvotes:,
          // Downvotes:,
          // Image:
        })
      })
    },
    getPosts() {
      return $http.get(`https://reddit-steve.firebaseio.com/posts.json`)
    },
    updateScore(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/score.json`, data)
    },
    updateUpvotes(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/upvotes.json`, data)
    },
    updateDownvotes(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/downvotes.json`, data)
    }
  }
});
