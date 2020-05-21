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

function getUserData(user){
    let url = `/event-manager/user-info/${user}`;

    let settings = {
        method : 'GET',
        headers : {
            sessiontoken : localStorage.getItem( 'token' ),
            'Content-Type' : 'application/json'
        },
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
            console.log("El json:");
            console.log(responseJSON);
            results.innerHTML = "";
            for(let i=0; i<responseJSON.length; i++){
                results.innerHTML += `<div> Username: ${responseJSON[i].username} </div>`;
                results.innerHTML += `<div> email: ${responseJSON[i].email} </div>`;
                results.innerHTML += `<div> First name: ${responseJSON[i].firstName} </div>`;
                results.innerHTML += `<div> Last name: ${responseJSON[i].lastName} </div>`;
                results.innerHTML += `<div> Age: ${responseJSON[i].age} </div>`;
                results.innerHTML += `<div> Tags:`;
                for(let j=0; j<responseJSON[i].tags.length; j++){
                    results.innerHTML += `${responseJSON[i].tags[j]},`;
                }
                results.innerHTML += `</div>`;

                userlat = responseJSON[i].location.coordinates[0];
                userlng = responseJSON[i].location.coordinates[1];
                
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}


function watchGetUserDataForm(){
    let user = localStorage.getItem( 'username' );
    console.log("Starting to fetch your data");
    getUserData(user);
}


