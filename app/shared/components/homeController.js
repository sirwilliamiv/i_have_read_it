app.controller('homeCtrl', function($scope, $location, authFactory, redditFactory) {
  redditFactory.getPosts()
    .then((allPosts) => {
      $scope.all = allPosts.data;
      // console.log("posts", $scope.all);
    });

  redditFactory.getPosts()
    .then((allPosts) => {
      $scope.all = allPosts.data
      redditFactory.finalScore($scope.all)

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
