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

          userlat = position.coords.latitude;
          userlng = position.coords.longitude;
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

//for events

function getEventsFetchUser(username){
    let url = `/event-manager/user-info2/${username}`;

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
            console.log("Json of user:");
            console.log(responseJSON[0]);
            /*
            for(let cont=0; cont<responseJSON[0].favorites.length; cont++){
                results.innerHTML = "";
                getEventsFetchId(responseJSON[0].favorites[cont], cont);
            }
            */

           results.innerHTML = "";
           //let i=0;
           
           infoWindows = [];

           for(let i=0; i<responseJSON[0].favorites.length; i++){
               results.innerHTML += `<div class="event" >`;
               results.innerHTML += `<h2> Event ${i+1}: </h2>`;
               results.innerHTML += `<h3> Title: ${responseJSON[0].favorites[i].title} </h3>`;
               results.innerHTML += `<div> Description: ${responseJSON[0].favorites[i].description} </div>`;
               for(let j=0; j<responseJSON[0].favorites[i].pictures.length; j++){
                    results.innerHTML += `<img src="${responseJSON[0].favorites[i].pictures[j]}" alt="Picture ${j+1} of event ${responseJSON[0].favorites[i].title}" width="400" height="200">`;
            }
               results.innerHTML += `<div> Tags:`;
               for(let k=0; k<responseJSON[0].favorites[i].tags.length; k++){
                   results.innerHTML += `${responseJSON[0].favorites[i].tags[k]},`;
               }
               results.innerHTML += `</div>`;
               var date = new Date(responseJSON[0].favorites[i].date);
               results.innerHTML += `<div> Date: ${date} </div>`;

               infoWindows[i] = new google.maps.InfoWindow;

               var position = {
                   lat: responseJSON[0].favorites[i].location.coordinates[0],
                   lng: responseJSON[0].favorites[i].location.coordinates[1]
                 };
       
                 infoWindows[i].setPosition(position);
                 infoWindows[i].setContent(responseJSON[0].favorites[i].title);
                 infoWindows[i].open(map);
                
                 /*
                results.innerHTML += `<div> Creator: ${responseJSON[0].favorites[i].creator.username} </div>`;
                for(let l=0; l<responseJSON[0].favorites[i].participants.length; l++){
                   results.innerHTML += `<div> Participant ${l+1}: ${responseJSON[0].favorites[i].participants[l].username} </div>`;
                }
               
                for(let m=0; m<responseJSON[0].favorites[i].comments.length; m++){
                   results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                   results.innerHTML += `<div> Title: ${responseJSON[0].favorites[i].comments[m].title} </div>`;
                   results.innerHTML += `<div> Content: ${responseJSON[0].favorites[i].comments[m].content} </div>`;
                   results.innerHTML += `<div> User: ${responseJSON[0].favorites[i].comments[m].username} </div>`;
                   var date2 = new Date(responseJSON[0].favorites[i].comments[m].date);
                   results.innerHTML += `<div> date: ${date2} </div>`;
                }
                */
                if(responseJSON[0].favorites[i].creator.username == localStorage.getItem( 'username' )){
                   owned = true;
                }
                else{
                   owned = false;
                }
               
                results.innerHTML +=`<button id="${responseJSON[0].favorites[i].title}" onClick="reply_click(this.id, owned)">See event</button>`;
                results.innerHTML += `</div>`;
           }

            
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getEventsFetchId(eventId, n){
    let url = `/event-manager/events-by-id/${eventId}`;

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
            let infoWindow2;
            
                results.innerHTML += `<h2> Event ${n+1}: </h2>`;
                results.innerHTML += `<h3> Title: ${responseJSON.title} </h3>`;
                results.innerHTML += `<div> Description: ${responseJSON.description} </div>`;
                for(let j=0; j<responseJSON.pictures.length; j++){
                    results.innerHTML += `<img src="${responseJSON.pictures[j]}" alt="Picture ${j+1} of event ${i+1}" width="400" height="200">`;
                }
                results.innerHTML += `<div> Tags:`;
                for(let k=0; k<responseJSON.tags.length; k++){
                    results.innerHTML += `${responseJSON.tags[k]},`;
                }
                results.innerHTML += `</div>`;
                var date = new Date(responseJSON.date);
                results.innerHTML += `<div> Date: ${date} </div>`;

                infoWindow2 = new google.maps.InfoWindow;

                var position = {
                    lat: responseJSON.location.coordinates[0],
                    lng: responseJSON.location.coordinates[1]
                  };
        
                  infoWindow2.setPosition(position);
                  infoWindow2.setContent(responseJSON.title);
                  infoWindow2.open(map);

                results.innerHTML += `<div> Creator: ${responseJSON.creator.username} </div>`;
                for(let l=0; l<responseJSON.participants.length; l++){
                    results.innerHTML += `<div> Participant ${l+1}: ${responseJSON.participants[l].username} </div>`;
                }
                
                for(let m=0; m<responseJSON.comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Title: ${responseJSON.comments[m].title} </div>`;
                    results.innerHTML += `<div> Content: ${responseJSON.comments[m].content} </div>`;
                    results.innerHTML += `<div> User: ${responseJSON.comments[m].user} </div>`;
                    var date2 = new Date(responseJSON.comments[m].date);
                    results.innerHTML += `<div> Date: ${date2} </div>`;
                }
            
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });

}

function reply_click(clicked_id, owned)
{
    console.log(clicked_id);
    localStorage.setItem( 'event', clicked_id );
    localStorage.setItem( 'owned', owned );
    window.location.href = "/pages/event.html";
}

function watchGetEventsUserForm(){
        username = localStorage.getItem('username');
        getEventsFetchUser( username );
}
