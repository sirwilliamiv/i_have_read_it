app.controller('postCtrl', function($scope, $location, redditFactory) {
console.log('postCtrl!')
// use postid to name file
 $scope.newPost = () => {
    debugger
    redditFactory.newPost($scope.Link, $scope.Title)
      .then(() => {
        console.log("much success")
      })
      .catch(() => $location.path('/login'))

  }

  //upload a photo
  $scope.handleFiles = function(evt) {
    let storageRef = firebase.storage().ref();
    // var fileList = evt.target.files;  now you can work with the file list
    // console.log("filelist[0]", fileList[0])
    console.log($scope.File)
    storageRef.child($scope.File).put($scope.File)
      .then(function(snapshot) {
        console.log(snapshot.downloadURL)

        // console.log('Uploaded a blob or file!', spaceRef.name);
        // return spaceRef.name
      }).catch(console.error);
  }


  $('#postModal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .3, // Opacity of modal background
    inDuration: 700, // Transition in duration
    outDuration: 700, // Transition out duration
    startingTop: '0%', // Starting top style attribute
    endingTop: '20%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

      console.log(modal, trigger);
    },
    complete: function() { console.log('Closed'); } // Callback for Modal close
  });
})
