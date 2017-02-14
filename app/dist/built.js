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
          posts (redditFactory) {
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
app.controller('homeCtrl', function($scope, $location, authFactory, redditFactory, posts, user) {

  $scope.all = posts

  // create score
  for (obj in $scope.all) {
    let u;
    let d;
    if ($scope.all[obj].upvotes === undefined) {
      u = 0;
    } else {
      u = Object.keys($scope.all[obj].upvotes).length;
    }
    if ($scope.all[obj].downvotes === undefined) {
      d = 0;
    } else {
      d = Object.keys($scope.all[obj].downvotes).length;
    }
    let score = u - d
    let key = obj
    redditFactory.updateScore(key, score)
  }

  // copy post key into post
  for (key in $scope.all) {
    if ($scope.all[key].postKey === undefined) {
      redditFactory.copyKey(key, key);
    }
  }

  // get users then loop through post and if they match then patch the username to the post
  redditFactory.getUsers()
    .then((allUsers) => {
      $scope.users = allUsers.data;
    }).then(() => {
      for (key in $scope.all) {
        for (k in $scope.users) {
          // see if post has a first name already. if so do nothing
          if ($scope.all[key].firstName === undefined) {
            if ($scope.all[key].uid === $scope.users[k].uid) {
              console.log("Tis a match!", key)
                // if match then post the firstName, lastName to the post
              let postFLName = { "firstName": $scope.users[k].firstName, "lastName": $scope.users[k].lastName };
              // patch the users first and last name to the database
              redditFactory.patchName(key, postFLName);
            }
          }
        }
      }
    })

  // onclick post the result to firebase
  $scope.upVote = (postkey) => {
    console.log('postKey', postkey)
      // get current user
    let voted = false;
    let uid;
    redditFactory.getPosts()
      .then((allPosts) => {
        $scope.all = allPosts
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
                for (k1 in obj.upvotes) {
                  // console.log('k1', obj.upvotes[k1], 'uid', uid)
                  // if user upvoted then do nothing
                  if (uid === obj.upvotes[k1]) {
                    console.log('this guy already upvoted')
                    return voted = true;
                  }
                }
                for (k2 in obj.downvotes) {
                  console.log('k2', obj.downvotes[k2], 'uid', uid)
                    // if the user wants to change their downvote to an upvote then delete the downvote and add an upvote
                  if (uid === obj.downvotes[k2]) { // upvoters uid will be obj.upvotes[k]
                    console.log('delete the downvote and add an upvote, postkey & key match, k2 dv', postkey, key, k2);
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
      })
  };


  $scope.downVote = (postkey) => {
    console.log('postKey', postkey)
    let voted = false;
    let uid;
    redditFactory.getPosts()
      .then((allPosts) => {
        $scope.all = allPosts
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
                    console.log('this guy already downvoted')
                    return voted = true;
                  }
                }
                for (k2 in obj.upvotes) {
                  // if the user wants to change their downvote to an upvote then delete the downvote and add an upvote
                  if (uid === obj.upvotes[k2]) { // upvoters uid will be obj.upvotes[k]
                    console.log('delete the upvote and add a downvote, postkey & key match, k2 dv', postkey, key, k2);
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
      })
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
    // get user
    // new post
    redditFactory.newPost($scope.Link, $scope.Title)
      .then((user) => {
        let userId = user.data.name
        let toPost = {"uid": userId, "first": $scope.firstName, "last": $scope.lastName}
        console.log('toPost', toPost);
        redditFactory.handleFiles(userId);
        console.log("much success")
      })
      .catch(() => $location.path('/login'))
    // put response.data.name (postkey) onto the post
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
        // console.log(newuid)
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
            reject("Not logged in");
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
      return authFactory.getUser()
        .then((user) => {
          return $http.post(`https://reddit-steve.firebaseio.com/posts.json`, {
            uid: user.uid,
            title: title,
            url: link,
          })
        })
        // .then((response) => {
        //   let x = response.data.name;
        //   copyKey(x, x)
        // })
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


    copyKey(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/postKey.json`, `"${data}"`)
    },
    getPosts() {
      return $http.get(`https://reddit-steve.firebaseio.com/posts.json`)
        .then(res => res.data)
    },
    getUsers() {
      return $http.get(`https://reddit-steve.firebaseio.com/users.json`)
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
    },
    patchName(key, userName) {
      $http.patch(`https://reddit-steve.firebaseio.com/posts/${key}.json`, userName)
    }
  }
});
