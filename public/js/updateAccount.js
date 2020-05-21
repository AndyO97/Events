const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';
var map, infoWindow;
var userlat, userlng;

//For the map and the location
function initMap() {
    var options = {
        center : {lat: 0, lng: 0},
        zoom: 4
    };
    
    map = new google.maps.Map(document.getElementById('map'), options);

    //var marker = new google.maps.Marker({position: location, map: map});

    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        if(!userlat){
            userlat = position.coords.latitude;
        }
        if(!userlng){
            userlng = position.coords.longitude;
        }
          
          
        console.log("Your coordinates are:");
        console.log(userlat);
        console.log(userlng);
        infoWindow.setPosition(pos);
        infoWindow.setContent('Your location.');
        infoWindow.open(map);
        map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
    } 
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }

//for the menu

function myFunctionEvents() {
    document.getElementById("myDropdownEvents").classList.toggle("show");
}

function myFunctionAccount() {
    document.getElementById("myDropdownAccount").classList.toggle("show");
}

window.onclick = function(e) {
    if (!e.target.matches('.dropbtn-Events')) {
    var myDropdown = document.getElementById("myDropdownEvents");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
    if (!e.target.matches('.dropbtn-Account')) {
        var myDropdown = document.getElementById("myDropdownAccount");
          if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
          }
        }
}

function userUpdateFetch( username2, username, password, email, firstName, lastName, age, tags, userlat, userlng ){
    let url = `/event-manager/update-user/${username2}`;

    let data = {
        username,
        password,
        email,
        firstName,
        lastName,
        age,
        tags,
        location : {
            type : "Point",
            coordinates : [
                userlat,
                userlng
            ]
        }
    }

    let settings = {
        method : 'PATCH',
        headers : {
            sessiontoken : localStorage.getItem( 'token' ),
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            
            localStorage.removeItem( 'token' );
            localStorage.removeItem( 'username' );
            localStorage.setItem( 'token', responseJSON.token );
            localStorage.setItem( 'username', responseJSON.username );
            console.log("El json:");
            console.log(responseJSON);
            results.innerHTML = "";
            
            //for(let i=0; i<responseJSON.length; i++){
                results.innerHTML += `<div> Username: ${responseJSON.username} </div>`;
                results.innerHTML += `<div> email: ${responseJSON.email} </div>`;
                results.innerHTML += `<div> First name: ${responseJSON.firstName} </div>`;
                results.innerHTML += `<div> Last name: ${responseJSON.lastName} </div>`;
                results.innerHTML += `<div> Age: ${responseJSON.age} </div>`;
                results.innerHTML += `<div> Tags:`;
                for(let j=0; j<responseJSON.tags.length; j++){
                    results.innerHTML += `${responseJSON.tags[j]},`;
                }
                results.innerHTML += `</div>`;

                let infoWindow2 = new google.maps.InfoWindow;

                var position = {
                    lat: responseJSON[i].location.coordinates[0],
                    lng: responseJSON[i].location.coordinates[1]
                  };
        
                  infoWindow2.setPosition(position);
                  infoWindow2.setContent("Updated position");
                  infoWindow2.open(map);
            //}
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function error() {
    let results = document.querySelector( '.results' );
    results.innerHTML = "Unable to retrieve your location";
  }

function watchUpdateForm(){
    let registerForm = document.querySelector( '.register-form' );
    let results = document.querySelector( '.results' );

    registerForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let username2 = localStorage.getItem( 'username' );
        let username = document.getElementById( 'userUsername' ).value;
        let password = document.getElementById( 'userPassword' ).value;
        let email = document.getElementById( 'userEmail' ).value;
        let firstName = document.getElementById( 'userFirstName' ).value;
        let lastName = document.getElementById( 'userLastName' ).value;
        let age = document.getElementById( 'userAge' ).value;
        let tags = document.getElementById( 'userTags' ).value;
        
        if(!navigator.geolocation) {
            results.innerHTML = "Geolocation is not supported by your browser";
          } else {
            console.log("Locating…");
            navigator.geolocation.getCurrentPosition(function(position) {
                userlat  = position.coords.latitude;
                userlng = position.coords.longitude;
                console.log("Your coordinates are:");
                console.log(userlat);
                console.log(userlng);
                if( userlat && userlng){
                    userUpdateFetch( username2, username, password, email, firstName, lastName, age, tags, userlat, userlng );
                }
                console.log("User Updated");
            }, error);
        }
    })
}


function init(){
    watchUpdateForm();
}

init();



