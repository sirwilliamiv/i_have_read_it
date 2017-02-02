app.controller('registerCtrl', function($scope, $location, authFactory) {


  $scope.createUser = () => {
    console.log($scope.user_email)
    authFactory.createUser($scope.user_email, $scope.user_password,$scope.firstName, $scope.lastName)
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
