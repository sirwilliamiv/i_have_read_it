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
    }).when('/logout', {
      controller: 'logoutCtrl',
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
      // console.log("posts", $scope.all);
    });

  redditFactory.getPosts()
    .then((allPosts) => {
      $scope.all = allPosts.data
        // console.log("posts", $scope.all)
    })

  // onclick post the result to firebase
  $scope.upVote = (postkey) => {
    // get current user
    authFactory
      .getUser()
      .then((e) => {
        // see if user has already upvoted or downvoted
        // loop through the postkey passed from click to find the post
        let voted = false;
        for (key in $scope.all) {
          // when the keys match, loop through the post and get the upvotes & downvotes
          if (key === postkey) {
            let obj = $scope.all[key];
            for (k1 in obj.upvotes) {
              // if user upvoted then do nothing
              if (e.uid === obj.upvotes[k1]) {
                console.log('you have already upvoted this post - k1', k1);
                return voted = true;
              }
            }
            for (k2 in obj.downvotes) {
              // if the user wants to change their downvote to an upvote then delete the downvote and add an upvote
              console.log('uid vs key2', e.uid, obj.downvotes[k2])
              if (e.uid === obj.downvotes[k2]) { // upvoters uid will be obj.upvotes[k]
                console.log('delete the downvote and add an upvote, postkey & key match, k2 dv', postkey, key, k2);
                return voted = true;
              }
            }
          }

        }
      })
      .then((response) => {
        // the response will be true if user has already voted, false if they haven't, or undefined if downvotes/upvotes don't exist yet.
        console.log(response)
      });

    // if user downvoted, remove downvote add upvote and update score
    // if user upvoted already, do nothing
    // else add upvote and update score


    // console.log('upvoted', vote, 'score', score, 'key', key);
    // let newVote = ((parseInt(vote, 10) + 1).toString());
    // let newScore = ((parseInt(score, 10) + 1).toString());
    // console.log('upvoted', newVote, 'score', newScore, 'key', key);
    // // patch to reddit factory on key to update upvote and score
    // redditFactory.updateUpvotes(key, newVote);
    // redditFactory.updateScore(key, newScore);
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
app.controller('loginCtrl', function($scope, $location, authFactory) {

  $scope.userLogin = () => {

    authFactory.login($scope.user_email, $scope.user_password)
      .then(() => console.log("woohoo"));
  };

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
app.controller('logoutCtrl', function($scope, $location, authFactory) {

 //Auth
  $scope.logout = () => {
    authFactory.logout()
      .then(() => console.log('logged out'))
  }


})
;
app.controller('postCtrl', function($scope, $location, redditFactory) {
  console.log('postCtrl!')
    // use postid to name file
  $scope.newPost = () => {

    redditFactory.newPost($scope.Link, $scope.Title)
      .then((user) => {
        console.log(user.data.name)
        let userId = user.data.name
         redditFactory.handleFiles(userId)
        console.log("much success")
      })
      .catch(() => $location.path('/login'))

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
app.controller('registerCtrl', function($scope, $location, authFactory) {


  $scope.createUser = () => {
    console.log($scope.user_email)
    authFactory.createUser($scope.user_email, $scope.user_password)
      .then(() => console.log("success"));
  };

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
          url: link,

        })
      })
    },
    handleFiles (userId) {
    let storageRef = firebase.storage().ref();
    let File = $('#fileUpload').prop('files')[0]
    console.log("id?", userId)
    console.log('file',File)
    storageRef.child(File.name + userId).put(File)
      .then(function(snapshot) {
      $http.patch(`https://reddit-steve.firebaseio.com/posts/${userId}.json`,
        {
          image: snapshot.downloadURL
        })

        console.log("downloadurl", snapshot.downloadURL)
      }).catch(console.error);
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
