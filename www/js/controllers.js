
angular.module('starter.controllers', ['ionic', 'ngCordova'])

//top view controller
.controller('AppCtrl', function($scope, $rootScope, UserService, $ionicActionSheet, $state, $ionicLoading) {
  
  // #SIMPLIFIED-IMPLEMENTATION:
  // Simplified handling and logout function.
  // A real app would delegate a service for organizing session data
  // and auth stuff in a better way.
  $rootScope.user = {};

  $scope.logout = function(){
    $rootScope.user = {};
    
	
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'SmartShop is awesome so We recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
					template: 'Logging out...'
				});
				// Google logout
				window.plugins.googleplus.logout(
					function (msg) {
						console.log(msg);
						$ionicLoading.hide();
						
					},
					function(fail){
						console.log(fail);
					}
				);


        $ionicLoading.hide();
			}
		});
       $state.go('start')
	};

    

})



// This controller is bound to the "app.account" view
.controller('AccountCtrl', function($scope, $rootScope) {
  
  //readonly property is used to control editability of account form
  $scope.readonly = true;

  // #SIMPLIFIED-IMPLEMENTATION:
  // We act on a copy of the root user
  $scope.accountUser = angular.copy($rootScope.user);
  var userCopy = {};

  $scope.startEdit = function(){
    $scope.readonly = false;
    userCopy = angular.copy($scope.user);
  };

  $scope.cancelEdit = function(){
    $scope.readonly = true;
    $scope.user = userCopy;
  };
  
  // #SIMPLIFIED-IMPLEMENTATION:
  // this function should call a service to update and save 
  // the data of current user.
  // In this case we'll just set form to readonly and copy data back to $rootScope.
  $scope.saveEdit = function(){
    $scope.readonly = true;
    $rootScope.user = $scope.accountUser;
  };

})




.controller('StartCtrl', function ($scope, $state, $rootScope, UserService, $ionicLoading) {

  // #SIMPLIFIED-IMPLEMENTATION:
  // This login function is just an example.
  // A real one should call a service that checks the auth against some
  // web service

    $scope.googleSignIn = function(){
        
    $ionicLoading.show({
      template: 'Logging in...'
    });

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        // For the purpose of this example I will store user data on local storage
        UserService.setUser({
          userID: user_data.userId,
          name: user_data.displayName,
          email: user_data.email,
          picture: user_data.imageUrl,
          accessToken: user_data.accessToken,
          idToken: user_data.idToken});
     
           $rootScope.user = {
              email : user_data.email,
              name : user_data.displayName,
              address : "YTI",
              city : "YTI",
              zip  : "YTI",
              avatar : user_data.imageUrl
            };
         
            
      

        $ionicLoading.hide();
        $state.go('app.shop');
      },
      function (msg) {
        $ionicLoading.hide();
      }
    );
        
        
    };

})


.controller('LoginCtrl', function ($scope, $state, $rootScope, UserService, $ionicLoading, $ionicPlatform, $timeout, $http, $ionicPopup) {

    
  $scope.login = function(){
    //in this case we just set the user in $rootScope
   /* $rootScope.user = {
      email : "mary@ubiqtspaces.com",
      name : "Mary Ubiquitous",
      address : "Rue de Galvignac",
      city : "RonnieLand",
      zip  : "00007",
      avatar : 'sampledata/images/avatar.jpg'
    };*/
    //finally, we route our app to the 'app.shop' view
      
/*
    $ionicLoading.show(); 
        payload = $scope.loginData;
        $http.get("http://10.207.114.201:8088/login",payload)
            .success(function (resp) {
                console.log("Resp! " + resp);
                
                })
            .error(function (data) {
                alert("ERROR");
            });



            $ionicLoading.hide();
*/
        $ionicPopup.alert({title : "Login Successful"});

        $ionicLoading.show(); 
        $http.get("http://10.207.114.201:8088/shop")
            .success(function (list) {
                console.log("Shops! " + list);
                $rootScope.listShops = list;
    
                $rootScope.listOfShops = JSON.parse(JSON.stringify(list));
                console.log("date "+ JSON.stringify($scope.listOfShops));
            })
            .error(function (data) {
                alert("ERROR");
            });
        console.log("hey")
        $state.go("MapsShow")
        $ionicLoading.hide();
      
      
      
    //$state.go('app.shop');
  };
  
})




// Feeds controller.
.controller('FeedsCtrl', function($scope, BackendService) {

  // #SIMPLIFIED-IMPLEMENTATION:
  // In this example feeds are loaded from a json file.
  // (using "getFeeds" method in BackendService, see services.js)
  // In your application you can use the same approach or load 
  // feeds from a web service.
  
  $scope.doRefresh = function(){
      BackendService.getFeeds()
      .success(function(newItems) {
        $scope.feeds = newItems;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // Triggering the first refresh
  $scope.doRefresh();

})



// Shop controller.
.controller('ShopCtrl', function($scope, $ionicActionSheet, BackendService, CartService, $state) {
  
  // In this example feeds are loaded from a json file.
  // (using "getProducts" method in BackendService, see services.js)
  // In your application you can use the same approach or load 
  // products from a web service.
  
  //using the CartService to load cart from localStorage



$scope.showList = function(){
$state.go('app.shop')
}




  $scope.cart = CartService.loadCart();

  $scope.doRefresh = function(){
      BackendService.getProducts()
      .success(function(newItems) {
        $scope.products = newItems;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning (not needed in this view)
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // private method to add a product to cart
  var addProductToCart = function(product){
    $scope.cart.products.push(product);
    CartService.saveCart($scope.cart);
  };

    
    
  // method to add a product to cart via $ionicActionSheet
  $scope.addProduct = function(product){
    $ionicActionSheet.show({
       buttons: [
         { text: '<b>Add to cart</b>' }
       ],
       titleText: 'Buy ' + product.title,
       cancelText: 'Cancel',
       cancel: function() {
          // add cancel code if needed ..
       },
       buttonClicked: function(index) {
         if(index == 0){
           addProductToCart(product);
           return true;
         }
         return true;
       }
     });
  };

  //trigger initial refresh of products
  $scope.doRefresh();

})

// controller for "app.cart" view
.controller('CartCtrl', function($scope, CartService, $ionicListDelegate) {
  
  // using the CartService to load cart from localStorage
  $scope.cart = CartService.loadCart();
  
  // we assign getTotal method of CartService to $scope to have it available
  // in our template
  $scope.getTotal = CartService.getTotal;

  // removes product from cart (making in persistent)
  $scope.dropProduct = function($index){
    $scope.cart.products.splice($index, 1);
    CartService.saveCart($scope.cart);
    // as this method is triggered in an <ion-option-button> 
    // we close the list after that (not strictly needed)
    $ionicListDelegate.closeOptionButtons();

  }
})

.controller('CheckoutCtrl', function($scope, CartService, $state) {
  
  //using the CartService to load cart from localStorage
  $scope.cart = CartService.loadCart();
  $scope.getTotal = CartService.getTotal;

  $scope.getTotal = CartService.getTotal;

  // #NOT-IMPLEMENTED: This method is just calling alert()
  // you should implement this method to connect an ecommerce
  // after that the cart is reset and user is redirected to shop
  $scope.checkout = function(){
    alert("this implementation is up to you!");
    $scope.cart = CartService.resetCart();
    $state.go('app.shop')
  }

})

/*

.controller('MapsCtrl', function($scope, $ionicActionSheet, BackendService, CartService) {
  
  // In this example feeds are loaded from a json file.
  // (using "getProducts" method in BackendService, see services.js)
  // In your application you can use the same approach or load 
  // products from a web service.
  
  //using the CartService to load cart from localStorage
  $scope.cart = CartService.loadCart();

  $scope.doRefresh = function(){
      BackendService.getProducts()
      .success(function(newItems) {
        $scope.products = newItems;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning (not needed in this view)
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // private method to add a product to cart
  var addProductToCart = function(product){
    $scope.cart.products.push(product);
    CartService.saveCart($scope.cart);
  };

    
    
  // method to add a product to cart via $ionicActionSheet
  $scope.addProduct = function(product){
    $ionicActionSheet.show({
       buttons: [
         { text: '<b>Add to cart</b>' }
       ],
       titleText: 'Buy ' + product.title,
       cancelText: 'Cancel',
       cancel: function() {
          // add cancel code if needed ..
       },
       buttonClicked: function(index) {
         if(index == 0){
           addProductToCart(product);
           return true;
         }
         return true;
       }
     });
  };

  //trigger initial refresh of products
  $scope.doRefresh();

})
*/
.controller('MapsShowCtrl', function($scope, $ionicActionSheet, BackendService, $cordovaGeolocation, $rootScope, $http ) {
  var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    

    //Show All Markers
    var newState = 0;

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

$http.get("http://10.207.114.201:8088/shop")
            .success(function (list) {
                console.log("Shops! " + list);
                
                $rootScope.listOfShops = JSON.parse(JSON.stringify(list));
     
                newState = -1;
                
            })
            .error(function (data) {
                alert("ERROR");
            });



      setTimeout(function () {
        if (newState == -1) {

     
            

            for (var i = 0; i <$rootScope.listOfShops.length ; i++) {

              $rootScope.listOfShops[i].image = 'http://10.207.114.201:8088/' + $rootScope.listOfShops[i].image ;

              var marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: new google.maps.LatLng($rootScope.listOfShops[i].location.coordinates[0], $rootScope.listOfShops[i].location.coordinates[1] )
              });      
             
              var infoWindow = new google.maps.InfoWindow({
                  content: $rootScope.listOfShops[i].name
              });
             
              google.maps.event.addListener(marker, 'click', function () {
                  infoWindow.open($scope.map, marker);
              });


            }


            var marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                  icon: 'img/home.png'
              });      
             
              var infoWindow = new google.maps.InfoWindow({
                  content: "Current Location"
              });
             
              google.maps.event.addListener(marker, 'click', function () {
                  infoWindow.open($scope.map, marker);
              });



        }
    }, 5000);
newState = 0;
 
});

 
  }, function(error){
    console.log("Could not get location" + error);
  });
})

.controller('WishlistCtrl', function($scope, $ionicPopup, $ionicLoading) {
  
  $scope.data = {};
  $scope.listDetails = [];
  var a,b;

  $scope.addItem = function(){
    // Add Item popup
  var myPopup = $ionicPopup.show({
    template: '<input type="text" placeholder="Item Category" ng-bind="' + a + '" ><br><input type="text" placeholder="Item name" ng-model="data.Item">',
    title: '<b>Add Item to Wishlist</b>',
    cssClass: 'my-custom-popup',
    buttons: [
      { text: '<b>Cancel</b>',
        type: 'button-positive',
        onTap: function(){
          $ionicLoading.show({
          template: 'No item added to Wishlist',
          duration: 3000
        }).then(function(){
           //console.log("The loading indicator is now displayed");
        });
        } },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function() {
          console.log(a)
          if($scope.data.Category)
           $scope.listDetails.push($scope.data.Category);
          else
           $scope.listDetails.push($scope.data.Item);
        }
      }
    ]
  });

  };

  $scope.navigate = function(){

    // Choose mall
  var myPopup2 = $ionicPopup.show({
    template: '<input type="text" placeholder="Mall/Shop name">>',
    title: '<b>Add Mall/Shop</b>',
    cssClass: 'my-custom-popup',
    buttons: [
      { text: '<b>Cancel</b>',
        type: 'button-positive',
        onTap: function(){
          alert("Cancel");
        } },{
        text: '<b>Proceed</b>',
        type: 'button-positive',
        onTap: function() {
          alert("Navigate to map screen");
        }
      }
    ]
  });

  };

})


.controller('RouteCtrl', function($scope) {
  
  

})

.controller('ShopDetailsCtrl', function($scope) {
  
  $scope.rateShop = function(){

  };

  $scope.markFav = function(){

  };

  $scope.addReview = function(){

  };

})


.controller('SignupCtrl', function($scope, $ionicActionSheet, BackendService, $ionicPopup, $http, $state) {

$scope.signupCall = function(){

  payload = JSON.stringify($scope.data);

  if($scope.data.password !== $scope.data.cpass)
  {
 var error = $ionicPopup.alert({title : "Passwords Do Not Match, Enter Again"});
  }
  else{
        $http.post('http://10.207.114.201:8088/register', payload).then(function(result){
             
             console.log(result)
            $ionicPopup.alert({title : "Signup Successful"});


             $state.go("MapsShow");
              });
}
}


})
