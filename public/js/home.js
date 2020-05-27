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

function getEventsFetch(){
    let url = `/event-manager/events`;

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
            infoWindows = [];
            for(let i=0; i<responseJSON.length; i++){
                results.innerHTML += `<div class="event" >`;
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
                    results.innerHTML += `<div> Participant ${l+1}: ${responseJSON[i].participants[l].username} </div>`;
                }
                
                for(let m=0; m<responseJSON[i].comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Title: ${responseJSON[i].comments[m].title} </div>`;
                    results.innerHTML += `<div> Content: ${responseJSON[i].comments[m].content} </div>`;
                    results.innerHTML += `<div> User: ${responseJSON[i].comments[m].username} </div>`;
                    var date2 = new Date(responseJSON[i].comments[m].date);
                    results.innerHTML += `<div> Date: ${date2} </div>`;
                }
                if(responseJSON[i].creator.username == localStorage.getItem( 'username' )){
                    owned = true;
                }
                else{
                    owned = false;
                }
                
                results.innerHTML +=`<button id="${responseJSON[i].title}" onClick="reply_click(this.id, owned)">See event</button>`;
                results.innerHTML += `</div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getEventsFetchKeyword(keyword){
    let url = `/event-manager/events-by-keyword/${keyword}`;

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
                results.innerHTML += `<div class="event" >`;
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
                    results.innerHTML += `<div> Participant ${l+1}: ${responseJSON[i].participants[l].username} </div>`;
                }
                
                for(let m=0; m<responseJSON[i].comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Title: ${responseJSON[i].comments[m].title} </div>`;
                    results.innerHTML += `<div> Content: ${responseJSON[i].comments[m].content} </div>`;
                    results.innerHTML += `<div> User: ${responseJSON[i].comments[m].username} </div>`;
                    var date2 = new Date(responseJSON[i].comments[m].date);
                    results.innerHTML += `<div> Date: ${date2} </div>`;
                }
                if(responseJSON[i].creator.username == localStorage.getItem( 'username' )){
                    owned = true;
                }
                else{
                    owned = false;
                }
                
                results.innerHTML +=`<button id="${responseJSON[i].title}" onClick="reply_click(this.id, owned)">See event</button>`;
                results.innerHTML += `</div>`;
            }
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
            console.log(responseJSON.length);
            results.innerHTML = "";
            //let i=0;
            results.innerHTML += `<div class="event" >`;
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
                    results.innerHTML += `<div> Participant ${l+1}: ${responseJSON[i].participants[l].username} </div>`;
                }
                
                for(let m=0; m<responseJSON[i].comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Title: ${responseJSON[i].comments[m].title} </div>`;
                    results.innerHTML += `<div> Content: ${responseJSON[i].comments[m].content} </div>`;
                    results.innerHTML += `<div> User: ${responseJSON[i].comments[m].username} </div>`;
                    var date2 = new Date(responseJSON[i].comments[m].date);
                    results.innerHTML += `<div> date: ${date2} </div>`;
                }
                if(responseJSON[i].creator.username == localStorage.getItem( 'username' )){
                    owned = true;
                }
                else{
                    owned = false;
                }
                
                results.innerHTML +=`<button id="${responseJSON[i].title}" onClick="reply_click(this.id, owned)">See event</button>`;
                results.innerHTML += `</div>`;
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

function getEventsFetchTag(tag){
    let url = `/event-manager/events-by-tag/${tag}`;

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
            console.log("Tag Results:");
            console.log(responseJSON);
            results.innerHTML = "";
            infoWindows = [];
            for(let i=0; i<responseJSON.length; i++){
                results.innerHTML += `<div class="event" >`;
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
                    results.innerHTML += `<div> Participant ${l+1}: ${responseJSON[i].participants[l].username} </div>`;
                }
                
                for(let m=0; m<responseJSON[i].comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Title: ${responseJSON[i].comments[m].title} </div>`;
                    results.innerHTML += `<div> Content: ${responseJSON[i].comments[m].content} </div>`;
                    results.innerHTML += `<div> User: ${responseJSON[i].comments[m].username} </div>`;
                    var date2 = new Date(responseJSON[i].comments[m].date);
                    results.innerHTML += `<div> Date: ${date2} </div>`;
                }
                if(responseJSON[i].creator.username == localStorage.getItem( 'username' )){
                    owned = true;
                }
                else{
                    owned = false;
                }
                
                results.innerHTML +=`<button id="${responseJSON[i].title}" onClick="reply_click(this.id, owned)">See event</button>`;
                results.innerHTML += `</div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getEventsFetchProximity(lat, lng, dist){
    let url = `/event-manager/events-by-proximity?lat=${lat}&lng=${lng}&dist=${dist}`;

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
                results.innerHTML += `<div class="event" >`;
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
                    results.innerHTML += `<div> Participant ${l+1}: ${responseJSON[i].participants[l].username} </div>`;
                }
                
                for(let m=0; m<responseJSON[i].comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Title: ${responseJSON[i].comments[m].title} </div>`;
                    results.innerHTML += `<div> Content: ${responseJSON[i].comments[m].content} </div>`;
                    results.innerHTML += `<div> User: ${responseJSON[i].comments[m].username} </div>`;
                    var date2 = new Date(responseJSON[i].comments[m].date);
                    results.innerHTML += `<div> Date: ${date2} </div>`;
                }
                if(responseJSON[i].creator.username == localStorage.getItem( 'username' )){
                    owned = true;
                }
                else{
                    owned = false;
                }
                
                results.innerHTML +=`<button id="${responseJSON[i].title}" onClick="reply_click(this.id, owned)">See event</button>`;
                results.innerHTML += `</div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getEventsFetchDates(date1, date2 ){
    let url = `/event-manager/events-by-dates?date1=${date1}&date2=${date2}`;

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
                results.innerHTML += `<div class="event" >`;
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
                    results.innerHTML += `<div> Participant ${l+1}: ${responseJSON[i].participants[l].username} </div>`;
                }
                
                for(let m=0; m<responseJSON[i].comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Title: ${responseJSON[i].comments[m].title} </div>`;
                    results.innerHTML += `<div> Content: ${responseJSON[i].comments[m].content} </div>`;
                    results.innerHTML += `<div> User: ${responseJSON[i].comments[m].username} </div>`;
                    var date2 = new Date(responseJSON[i].comments[m].date);
                    results.innerHTML += `<div> Date: ${date2} </div>`;
                }
                if(responseJSON[i].creator.username == localStorage.getItem( 'username' )){
                    owned = true;
                }
                else{
                    owned = false;
                }
                
                results.innerHTML +=`<button id="${responseJSON[i].title}" onClick="reply_click(this.id, owned)">See event</button>`;
                results.innerHTML += `</div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchGetEventsForm(){
    let eventsForm = document.querySelector( '.all-event-form' );

    eventsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        
        getEventsFetch();
    })
}

function watchGetEventsTitleForm(){
    let eventsForm = document.querySelector( '.title-event-form' );

    eventsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'eventTitle' ).value;
        
        getEventsFetchTitle( title );
    })
}

function watchGetEventsKeywordForm(){
    let eventsForm = document.querySelector( '.event-form' );

    eventsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let keyword = document.getElementById( 'keyword' ).value;
        
        getEventsFetchKeyword(keyword);
    })
}

function watchGetEventsProximityForm(){
    let eventsForm = document.querySelector( '.proximity-event-form' );

    eventsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let dist = document.getElementById( 'eventDistance' ).value;
        
        if(userlat && userlng){
            getEventsFetchProximity(userlat, userlng, dist);
        }
    })
}

function watchGetEventsTagForm(){
    let eventsForm = document.querySelector( '.tag-event-form' );

    eventsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let tag = document.getElementById( 'eventTag' ).value;
        
        getEventsFetchTag( tag );
    })
}

function watchGetEventsDatesForm(){
    let eventsForm = document.querySelector( '.date-event-form' );

    eventsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let day1 = document.getElementById( 'eventDayBeg' ).value;
        let month1 = document.getElementById( 'eventMonthBeg' ).value;
        let year1 = document.getElementById( 'eventYearBeg' ).value;
        let day2 = document.getElementById( 'eventDayEnd' ).value;
        let month2 = document.getElementById( 'eventMonthEnd' ).value;
        let year2 = document.getElementById( 'eventYearEnd' ).value;

        if( !day1 || !month1 || !year1 || !day2 || !month2 || !year2){
            results.innerHTML = "";
            results.innerHTML += `<div> One of the elements on the dates is missing </div>`;
        }
        else{
            month1--;
            month2--;
            let date1 = new Date(year1, month1, day1);
            let date2 = new Date(year2, month2, day2);
            console.log("dates:");
            console.log(date1);
            console.log(date2);
            /*
            var isActualDate = function (month, day, year) {
                var tempDate = new Date(year, --month, day);
                return month === tempDate.getMonth();
            };
            */
            getEventsFetchDates(date1, date2);
        }
    })
}

function getUserDataAndFavorites(user){
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
            getEventsFetchTag( responseJSON[0].tags );
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchGetEventsTagFormOnLoad(){
    let user = localStorage.getItem('username');
    getUserDataAndFavorites(user);
}

function init(){
    watchGetEventsKeywordForm();
    watchGetEventsTitleForm();
    watchGetEventsTagForm();
    watchGetEventsDatesForm();
    watchGetEventsForm();
    watchGetEventsProximityForm();
    watchGetEventsTagFormOnLoad();
    //getEvent();
}

init();