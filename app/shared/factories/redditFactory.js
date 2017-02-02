app.factory('redditFactory', ($q, authFactory, $http) => {

  return {
    newPost(link, title) {
      console.log('NEW POST')
      return authFactory.getUser().then(user => {
        console.log("addingpost")
          // $scope.title, $scope.artist, $scope.album, $scope.length
        return $http.post(`https://reddit-steve.firebaseio.com/posts.json`, {
          uid: user.uid,
          Title: title,
          Link: link,
          // Photoid:
          // Upvotes:,
          // Downvotes:,
          // Image:
        })
      })
    },
    getPosts() {
      return $http.get(`https://reddit-steve.firebaseio.com/posts.json`)
    },
    updateScore(key, data) {
      $http.patch(`https://reddit-steve.firebaseio.com/posts/${key}.json`, data)
    },
    updateUpvotes(key, data) {
      $http.patch(`https://reddit-steve.firebaseio.com/posts/${key}.json`, data)
    },
    updateDownvotes(key, data) {
      $http.patch(`https://reddit-steve.firebaseio.com/posts/${key}.json`, data)
    }
  }
});
