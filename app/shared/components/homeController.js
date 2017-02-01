app.controller('homeCtrl', function($scope, $location, authFactory, redditFactory) {



  redditFactory.getPosts()
    .then((allPosts) => {
      $scope.all = allPosts.data;
      console.log("posts", $scope.all);
    });

  // onclick post the result to firebase
  $scope.upVote = (vote, score, key) => {
    console.log('upvoted', vote, 'score', score, 'key', key);
    let newVote = parseInt(vote, 10) + 1;
    let newScore = parseInt(score, 10) + 1;
    console.log('upvoted', newVote, 'score', newScore, 'key', key);
    // patch to reddit factory on key to update upvote and score
    // redditFactory.updateScore();
    // redditFactory.updateUpvotes();
  }



    redditFactory.getPosts()
      .then((allPosts) => {
        $scope.all = allPosts.data
        console.log("posts", $scope.all)
      })



  // $scope.getPosts()


  $scope.downVote = (vote, score, key) => {
    console.log('downvoted', vote, 'score', score, 'key', key);
    let newVote = parseInt(vote, 10) + 1;
    let newScore = parseInt(score, 10) - 1;
    console.log('downvoted', newVote, 'score', newScore, 'key', key);
    // patch to reddit factory on key to update upvote and score
    // redditFactory.updateScore();
    // redditFactory.updateDownvotes();
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
