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

function eventUpdateFetch( id, title, description, pictures, tags, date, dateIs, private, latitude, longitude ){
    let url = `/event-manager/update-event/${id}`;

    var data;
    if(dateIs){
        data = {

            //title,
            description, 
            pictures, 
            tags, 
            date, 
            private, 
            location : {
                type : "Point",
                coordinates : [
                    latitude,
                    longitude
                ]
            },
        }
    }
    else{
        data = {

            //title,
            description, 
            pictures, 
            tags,  
            private, 
            location : {
                type : "Point",
                coordinates : [
                    latitude,
                    longitude
                ]
            },
        }
    }
    
    console.log("The data being sent:");
    console.log(data);

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
            
            console.log("El json:");
            console.log(responseJSON);
            //return res.status( 200 ).json( responseJSON );

            
            results.innerHTML = "";
            
            let infoWindow2;
            //let i = 0;
            //for(let i=0; i<responseJSON.length; i++){
                results.innerHTML += `<h2> The Event updated: </h2>`;
                results.innerHTML += `<h3> Title: ${responseJSON.title} </h3>`;
                results.innerHTML += `<div> Description: ${responseJSON.description} </div>`;
                for(let j=0; j<responseJSON.pictures.length; j++){
                    results.innerHTML += `<img src="${responseJSON.pictures[j]}" alt="Picture ${j+1} of event: ${responseJSON.title}"/>`;
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

                results.innerHTML += `<div> Creator: ${creator} </div>`;
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
            //}

        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getEventsFetchTitle(title){
    let url = `/event-manager/events-by-title/${title}`;

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
            results.innerHTML = "";
            infoWindows = [];
            for(let i=0; i<responseJSON.length; i++){
                results.innerHTML += `<h2> Event ${i+1}: </h2>`;
                results.innerHTML += `<h3> Title: ${responseJSON[i].title} </h3>`;
                results.innerHTML += `<div> Description: ${responseJSON[i].description} </div>`;
                for(let j=0; j<responseJSON[i].pictures.length; j++){
                    results.innerHTML += `<img src="${responseJSON[i].pictures[j]}" alt="Picture ${j+1} of event ${i+1}"/>`;
                }
                results.innerHTML += `<div> Tags:`;
                for(let k=0; k<responseJSON[i].tags.length; k++){
                    results.innerHTML += `${responseJSON[i].tags[k]},`;
                }
                results.innerHTML += `</div>`;
                var date = new Date(responseJSON[i].date);
                results.innerHTML += `<div> Date: ${date} </div>`;

                infoWindows[i] = new google.maps.InfoWindow;

                var position = {
                    lat: responseJSON[i].location.coordinates[0],
                    lng: responseJSON[i].location.coordinates[1]
                  };
        
                  infoWindows[i].setPosition(position);
                  infoWindows[i].setContent(responseJSON[i].title);
                  infoWindows[i].open(map);

                results.innerHTML += `<div> Creator: ${responseJSON[i].creator.username} </div>`;
                for(let l=0; l<responseJSON[i].participants.length; l++){
                    results.innerHTML += `<div> Participants: ${responseJSON[i].participants[l].username} </div>`;
                }
                
                for(let m=0; m<responseJSON[i].comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Participants: ${responseJSON[i].comments[m].title} </div>`;
                    results.innerHTML += `<div> Participants: ${responseJSON[i].comments[m].contentent} </div>`;
                    results.innerHTML += `<div> Participants: ${responseJSON[i].comments[m].user} </div>`;
                    var date2 = new Date(responseJSON[i].comments[m].date);
                    results.innerHTML += `<div> Participants: ${date2} </div>`;
                }
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getEventsCheckTitle( title, description, pictures, tags, date, dateIs, private, latitude, longitude, creator ){
    let url = `/event-manager/events-by-title/${title}`;

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
            console.log("El json del titulo:");
            console.log(responseJSON);
            console.log(responseJSON[0].creator._id);
            console.log(creator);
            if(responseJSON[0].creator._id == creator){
                let id = responseJSON[0].creator;
                console.log("Updating the event");
                eventUpdateFetch( id, title, description, pictures, tags, date, dateIs, private, latitude, longitude );
            }
            else{
                results.innerHTML = `<div> You are not the owner of these event </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}


function error() {
    let results = document.querySelector( '.results' );
    results.innerHTML = "Unable to retrieve your location";
}

function watchCreateForm(){
    let registerForm = document.querySelector( '.register-form' );
    let results = document.querySelector( '.results' );

    registerForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let creator = localStorage.getItem( 'id' );
        let title = document.getElementById( 'eventTitle' ).value;
        let description = document.getElementById( 'eventDescription' ).value;
        let pictures = document.getElementById( 'eventPicture' ).value;
        let tags = document.getElementById( 'eventTags' ).value;
        let day = document.getElementById( 'eventDay' ).value;
        let month = document.getElementById( 'eventMonth' ).value;
        month--;
        let year = document.getElementById( 'eventYear' ).value;
        let hour = document.getElementById( 'eventHour' ).value;
        let private = document.querySelector('.messageCheckbox').checked;
        let latitude = Number(document.getElementById( 'eventLatitude' ).value);
        let longitude = Number(document.getElementById( 'eventLongitude' ).value);
        var dateIs = false;
        if(year&&month&&day&&hour){
            var date = new Date(year, month, day, hour);
            dateIs = true;
        }
        
        
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
            }, error);
        }
        if(!latitude || !longitude){
            latitude = userlat;
            longitude = userlng;
        }
        
        getEventsCheckTitle( title, description, pictures, tags, date, dateIs, private, latitude, longitude, creator );           
    })
}

function init(){
    watchCreateForm();
}

init();



