const app = angular.module('iHaveReadIt', ['ngRoute', 'angular-toArrayFilter']);
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
;
app.controller('homeCtrl', function($scope, $location, authFactory, redditFactory) {
  redditFactory.getPosts()
    .then((allPosts) => {
      $scope.all = allPosts.data;
      // console.log("posts", $scope.all);
    });

  // redditFactory.getPosts()
  //   .then((allPosts) => {
  //     $scope.all = allPosts.data
  //     redditFactory.finalScore($scope.all)
  //   })

  // onclick post the result to firebase
  $scope.upVote = (postkey) => {
    // get current user
    let voted = false;
    let uid;
    redditFactory.getPosts()
      .then((allPosts) => {
        $scope.all = allPosts.data
          // console.log("posts", $scope.all)
      }).then(() => {
        authFactory
          .getUser()
          .then((e) => {
            uid = e.uid;
          })
          .then(() => {
            // see if user has already upvoted or downvoted
            // loop through the postkey passed from click to find the post
            for (key in $scope.all) {
              // when the keys match, loop through the post and get the upvotes & downvotes
              if (key === postkey) {
                let obj = $scope.all[key];
                for (k1 in obj.upvotes) {
                  // if user upvoted then do nothing
                  if (uid === obj.upvotes[k1]) {
                    return voted = true;
                  }
                }
                for (k2 in obj.downvotes) {
                  // if the user wants to change their downvote to an upvote then delete the downvote and add an upvote
                  if (uid === obj.downvotes[k2]) { // upvoters uid will be obj.upvotes[k]
                    // console.log('delete the downvote and add an upvote, postkey & key match, k2 dv', postkey, key, k2);
                    // delete downvote
                    redditFactory.removeDownvotes(key, k2);
                    // add upvote
                    redditFactory.addUpvotes(key, uid);
                    return voted = true;
                  }
                }
              }
            }
          })
          // if user has not voted then add upvote.
          .then(() => {
            // the response will be true if user has already voted, false if they haven't
            if (voted === false) {
              for (key in $scope.all) {
                // when the keys match, loop through the post and get the upvotes & downvotes
                if (key === postkey) {
                  // console.log('keys match', key, postkey)
                  redditFactory.addUpvotes(key, uid)
                }
              }
            }
          })
      });
  }

  $scope.downVote = (postkey) => {
    // get current user
    let voted = false;
    let uid;
    redditFactory.getPosts()
      .then((allPosts) => {
        $scope.all = allPosts.data
          // console.log("posts", $scope.all)
      })
      .then(() => {
        authFactory
          .getUser()
          .then((e) => {
            uid = e.uid;
          })
          .then(() => {
            // see if user has already upvoted or downvoted
            // loop through the postkey passed from click to find the post
            for (key in $scope.all) {
              // when the keys match, loop through the post and get the upvotes & downvotes
              if (key === postkey) {
                let obj = $scope.all[key];
                for (k1 in obj.downvotes) {
                  // if user downvoted then do nothing
                  if (uid === obj.downvotes[k1]) {
                    return voted = true;
                  }
                }
                for (k2 in obj.upvotes) {
                  // if the user wants to change their downvote to an upvote then delete the downvote and add an upvote
                  if (uid === obj.upvotes[k2]) { // upvoters uid will be obj.upvotes[k]
                    // console.log('delete the upvote and add a downvote, postkey & key match, k2 dv', postkey, key, k2);
                    // delete upvote
                    redditFactory.removeUpvotes(key, k2);
                    // add downvote
                    redditFactory.addDownvotes(key, uid);
                    return voted = true;
                  }
                }
              }
            }
          })
          // if user has not voted then add downvote.
          .then(() => {
            // the response will be true if user has already voted, false if they haven't
            if (voted === false) {
              console.log('user has not yet voted so begin the vote')
              for (key in $scope.all) {
                // when the keys match, loop through the post and get the upvotes & downvotes
                if (key === postkey) {
                  console.log('keys match', key, postkey)
                  redditFactory.addDownvotes(key, uid)
                }
              }
            }
          })
      });
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
      .then(() => {
        console.log("woohoo")
        $location.url('/main')
      });
  };

  $('#loginModal').modal('open');
  //login
  $('#loginModal').modal({
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
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
      .then(() => {console.log('logged out')
        $location.url('/login')
      })
  }


})
;
app.controller('postCtrl', function($scope, $location, authFactory, redditFactory) {
  // use postid to name file
  $scope.newPost = () => {
    // let newPost = {};

    redditFactory.newPost($scope.Link, $scope.Title)
      .then((user) => {
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

      // console.log(modal, trigger);
    },
    // complete: function() { console.log('Closed'); } // Callback for Modal close
  });
})
;
app.controller('registerCtrl', function($scope, $location, authFactory, redditFactory) {

  $scope.createUser = () => {
    let newuid;
    authFactory.createUser($scope.user_email, $scope.user_password)
      .then((response) => {
        newuid = response.uid;
        console.log(newuid)
      })
      .then(() => {
        let newUser = {"uid": newuid, "firstName": $scope.firstName, "lastName": $scope.lastName, "email": $scope.user_email};
        redditFactory.addUser(newUser);
      })
  };

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
})
;
app.factory('authFactory', ($q) => {
  return {
    login(email, pass) {
      console.log("auth", email);
      return $q.resolve(firebase.auth().signInWithEmailAndPassword(email, pass).then((data) => {
        // console.log(data.uid);
        // return UID = data.uid;
      }));
    },
    createUser(email, pass, first, last) {
      return $q.resolve(firebase.auth().createUserWithEmailAndPassword(email, pass));
    },
    getUser() {
      return $q((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
            resolve(user);
          } else {
            reject(() => {
              var $toastContent = $('<span>Not Logged In</span>');
              Materialize.toast($toastContent, 5000);
              });
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
          title: title,
          url: link,
        })
      })
    },
    handleFiles(userId) {
      let storageRef = firebase.storage().ref();
      let File = $('#fileUpload').prop('files')[0]
        // console.log("id?", userId)
        // console.log('file',File)
      storageRef.child(File.name + userId).put(File)
        .then(function(snapshot) {
          $http.patch(`https://reddit-steve.firebaseio.com/posts/${userId}.json`, {
            image: snapshot.downloadURL
          })

          console.log("downloadurl", snapshot.downloadURL)
        }).catch(console.error);
    },
    // finalScore(all){
    //   for(obj in all)

    //   let u = Object.keys(obj.upvotes).length
    //   let d = Object.keys(obj.downvotes).length
    //   return () =>{
    //   let  s = (all.upvotes - all.downvotes)
    //   console.log("score?", s)
    //   }


    // },
    getPosts() {
      return $http.get(`https://reddit-steve.firebaseio.com/posts.json`)
    },
    updateScore(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/score.json`, data)
    },
    addDownvotes(key, uid) {
      $http.post(`https://reddit-steve.firebaseio.com/posts/${key}/downvotes.json`, `"${uid}"`)
    },
    addUpvotes(key, uid) {
      $http.post(`https://reddit-steve.firebaseio.com/posts/${key}/upvotes.json`, `"${uid}"`)
    },
    removeDownvotes(key, k2) {
      $http.delete(`https://reddit-steve.firebaseio.com/posts/${key}/downvotes/${k2}.json`)
    },
    removeUpvotes(key, k2) {
      $http.delete(`https://reddit-steve.firebaseio.com/posts/${key}/upvotes/${k2}.json`)
    },
    addUser(newUser) {
      $http.post(`https://reddit-steve.firebaseio.com/users.json`, newUser)
    }
  }
});
