app.factory('authFactory', ($q) => {
  return {
    login(email, pass) {
      console.log("auth", email);
      return $q.resolve(firebase.auth().signInWithEmailAndPassword(email, pass).then((data) => {
        console.log(data.uid);
        return UID = data.uid;
      }));
    }, //end login

    createUser(email, pass) {
      console.log("email", email);
      return $q.resolve(firebase.auth().createUserWithEmailAndPassword(email, pass));

    }, //end createUser
    getUser() {
      return $q((resolve, reject) => {
          const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
              unsubscribe();
              if (user) {
                resolve(user);
              } else {
                reject();
              }

            }); //end const unsubscribe
        }); //end return getUser
    }, //end getUser
    logout() {
      return $q.resolve(firebase.auth().signOut());
    }
  }; //end of return object
}); //end factory
