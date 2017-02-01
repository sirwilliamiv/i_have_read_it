app.controller('homeCtrl', function($scope, $location, authFactory, redditFactory) {

    $scope.newPost = () => {

        redditFactory.newPost($scope.Photo, $scope.Title)
            .then(() => {
                console.log("much success")
            })
            .catch((error) => console.log(error))
    }

    $scope.getPosts = () => {
        redditFactory.getPosts()
            .then((allPosts) => {
                $scope.all = allPosts.data
                console.log("posts", $scope.all)
            })
    }

    // $scope.getPosts()







    //Auth
    $scope.logout = () => {
        authFactory.logout()
            .then(() => console.log('logged out'))
    }

    $scope.userLogin = () => {

        authFactory.login($scope.user_email, $scope.user_password)
            .then(() => console.log("woohoo"))
    }
    $scope.createUser = () => {
        console.log($scope.user_email)
        authFactory.createUser($scope.user_email, $scope.user_password)
            .then(() => console.log("success"))

    }


    //materialize Modals below
    $('#loginButton').click(() => {
        $('#loginModal').modal('open')
    })


    $('.registerButton').click(() => {
        $('#registerModal').modal('open')
    })

    $('#newPost').click(() => {
        $('#postModal').modal('open')
    })

    //register
    $('#registerModal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .3, // Opacity of modal background
        inDuration: 750, // Transition in duration
        outDuration: 700, // Transition out duration
        startingTop: '100%', // Starting top style attribute
        endingTop: '20%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

            console.log(modal, trigger);
        },
        complete: function() { console.log('Closed'); } // Callback for Modal close
    });


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
