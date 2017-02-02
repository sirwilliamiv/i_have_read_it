app.factory('redditFactory', ($q, authFactory, $http) => {

  return {
    newPost(link, title) {
      console.log('NEW POST')
      return authFactory.getUser().then(user => {
        console.log("addingpost")
          // $scope.title, $scope.artist, $scope.album, $scope.length
        return $http.post(`https://reddit-steve.firebaseio.com/posts.json`, {
          uid: user.uid,
          title: title,
          url: link,

        })
      })
    },
    handleFiles(userId) {
      let storageRef = firebase.storage().ref();
      let File = $('#fileUpload').prop('files')[0]
        // console.log("id?", userId)
        // console.log('file',File)
      storageRef.child(File.name + userId).put(File)
        .then(function(snapshot) {
          $http.patch(`https://reddit-steve.firebaseio.com/posts/${userId}.json`, {
            image: snapshot.downloadURL
          })

          console.log("downloadurl", snapshot.downloadURL)
        }).catch(console.error);
    },
    getPosts() {
      return $http.get(`https://reddit-steve.firebaseio.com/posts.json`)
    },
    updateScore(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/score.json`, data)
    },
    updateUpvotes(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/upvotes.json`, data)
    },
    updateDownvotes(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/downvotes.json`, data)
    }
  }
});
