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
