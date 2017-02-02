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
