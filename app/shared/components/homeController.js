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
