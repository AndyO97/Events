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


function getEventsFetchTitle(title, owned){
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
            console.log(responseJSON.length);
            results.innerHTML = "";
            //let i=0;
            results.innerHTML += `<div class="event" >`;
            infoWindows = [];
            for(let i=0; i<responseJSON.length; i++){
                results.innerHTML += `<h2> Event: </h2>`;
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
                    results.innerHTML += `<div> Title: ${responseJSON[i].comments[m].title} </div>`;
                    results.innerHTML += `<div> Content: ${responseJSON[i].comments[m].content} </div>`;
                    results.innerHTML += `<div> User: ${responseJSON[i].comments[m].user.username} </div>`;
                    var date2 = new Date(responseJSON[i].comments[m].date);
                    results.innerHTML += `<div> Date: ${date2} </div>`;
                }
                if(responseJSON[i].creator.username == localStorage.getItem( 'username' )){
                    owned = true;
                }
                else{
                    owned = false;
                }
                
                //results.innerHTML +=`<button id="${responseJSON[i].title}" onClick="reply_click(this.id, owned)">See event</button>`;
                results.innerHTML += `</div>`;
                localStorage.setItem( 'EventId', responseJSON[i]._id );
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}



function watchGetEventDataForm(){
   
        let title = localStorage.getItem( 'event');
        let owned = localStorage.getItem( 'owned');
        
        getEventsFetchTitle( title, owned );
}

function commentCreateFetch(title, content, user, event, date){
    let url = `/event-manager/add-comment`;

    let data = {
        title,
        content, 
        user, 
        event,
        date
    }

    console.log("The data being sent:");
    console.log(data);

    let settings = {
        method : 'POST',
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
            //return res.status( 200 ).json( responseJSON )
            //function to patch event
            let id = localStorage.getItem( 'EventId');
            addCommentToEventFetch(id, responseJSON._id)
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function addCommentToEventFetch(id, comments){
    let url = `/event-manager/update-event/${id}`;

    let data = {
        comments
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
            
            console.log("El json actualizado:");
            console.log(responseJSON);
            //return res.status( 200 ).json( responseJSON )
            //function to patch event
            let title = localStorage.getItem( 'event');
            let owned = localStorage.getItem( 'owned');
            getEventsFetchTitle(title, owned);

        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchCommentForm(){
    let registerForm = document.querySelector( '.register-form' );
    let results = document.querySelector( '.results' );

    registerForm.addEventListener( 'submit' , ( e ) => {
        e.preventDefault();
        let title = document.getElementById( 'commentTitle' ).value;
        let content = document.getElementById( 'commentContent' ).value;
        let userId = localStorage.getItem( 'id' );
        let event = localStorage.getItem( 'EventId' );
        let date = new Date();

        commentCreateFetch(title, content, userId, event, date);
    })
}


function init(){
    watchCommentForm()
}

init();