app.factory('redditFactory', ($q, authFactory, $http) => {

  return {
    newPost(link, title) {
      console.log('NEW POST')
      return authFactory.getUser()
        .then((user) => {
          return $http.post(`https://reddit-steve.firebaseio.com/posts.json`, {
            uid: user.uid,
            title: title,
            url: link,
          })
        })
        // .then((response) => {
        //   let x = response.data.name;
        //   copyKey(x, x)
        // })
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


    copyKey(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/postKey.json`, `"${data}"`)
    },
    getPosts() {
      return $http.get(`https://reddit-steve.firebaseio.com/posts.json`)
        .then(res => res.data)
    },
    getUsers() {
      return $http.get(`https://reddit-steve.firebaseio.com/users.json`)
    },
    updateScore(key, data) {
      $http.put(`https://reddit-steve.firebaseio.com/posts/${key}/score.json`, data)
    },
    addDownvotes(key, uid) {
      $http.post(`https://reddit-steve.firebaseio.com/posts/${key}/downvotes.json`, `"${uid}"`)
    },
    addUpvotes(key, uid) {
      $http.post(`https://reddit-steve.firebaseio.com/posts/${key}/upvotes.json`, `"${uid}"`)
    },
    removeDownvotes(key, k2) {
      $http.delete(`https://reddit-steve.firebaseio.com/posts/${key}/downvotes/${k2}.json`)
    },
    removeUpvotes(key, k2) {
      $http.delete(`https://reddit-steve.firebaseio.com/posts/${key}/upvotes/${k2}.json`)
    },
    addUser(newUser) {
      $http.post(`https://reddit-steve.firebaseio.com/users.json`, newUser)
    },
    patchName(key, userName) {
      $http.patch(`https://reddit-steve.firebaseio.com/posts/${key}.json`, userName)
    }
  }
});
