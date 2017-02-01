app.controller('homeCtrl', function($scope, $location, authFactory, redditFactory) {





    redditFactory.getPosts()
      .then((allPosts) => {
        $scope.all = allPosts.data
        console.log("posts", $scope.all)
      })



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



})
