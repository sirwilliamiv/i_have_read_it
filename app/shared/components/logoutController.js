app.controller('logoutCtrl', function($scope, $location, authFactory) {

 //Auth
  $scope.logout = () => {
    authFactory.logout()
      .then(() => {console.log('logged out')
        $location.url('/login')
      })
  }


})
