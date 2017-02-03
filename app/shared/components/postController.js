app.controller('postCtrl', function($scope, $location, authFactory, redditFactory) {
  // use postid to name file
  $scope.newPost = () => {
    // let newPost = {};

    redditFactory.newPost($scope.Link, $scope.Title)
      .then((user) => {
        let userId = user.data.name
        redditFactory.handleFiles(userId)
        console.log("much success")
      })
      .catch(() => $location.path('/login'))
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
