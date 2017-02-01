app.factory('redditFactory', ($q, authFactory, $http) => {

  return {
    newPost(url, title) {

      return authFactory.getUser().then(user => {
        console.log("addingpost")
          // $scope.title, $scope.artist, $scope.album, $scope.length
        return $http.post(`https://reddit-steve.firebaseio.com/posts.json`, {
          uid: user.uid,
          Title: title,
          Link: url,
          // Name: first
          // Upvotes:,
          // Downvotes:,
          // Image:
        })
      })
    },
    getPosts() {
      return $http.get(`https://reddit-steve.firebaseio.com/posts.json`)
    }
  }
})
