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
        }
      }

      })

    },
    getPosts() {
      return $http.get(`https://reddit-steve.firebaseio.com/posts.json`)
    },
    updateScore() {
      $http.patch(`https://reddit-steve.firebaseio.com/posts.json`)
    },
    updateUpvotes() {
      $http.patch(`https://reddit-steve.firebaseio.com/posts.json`)
    },
    updateDownvotes() {
      $http.patch(`https://reddit-steve.firebaseio.com/posts.json`)
    }
  }
});

