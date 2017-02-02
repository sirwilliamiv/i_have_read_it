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
    // get current user
    authFactory
      .getUser()
      .then((e) => {
        // console.log('current user is', e.uid);
        // see if user has already upvoted or downvoted
        // loop through the upvotes to see if there is a match
        for (key in $scope.all) {
          let obj = $scope.all[key];
          console.log('upvotes', obj.upvotes)
        //   if (e.uid === $scope.all.key.upvotes)
        }
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


  //Auth
  $scope.logout = () => {
    authFactory.logout()
      .then(() => console.log('logged out'))
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
