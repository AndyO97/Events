var userlat, userlng;

function userRegisterFetch( username, password, email, firstName, lastName, age, tags, userlat, userlng ){
    let url = '/event-manager/users/login';

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
        method : 'POST',
        headers : {
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
            alert("Account created succesfully");
            localStorage.setItem( 'token', responseJSON.token );
            window.location.href = "/pages/home.html";
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchRegisterForm(){
    let registerForm = document.querySelector( '.register-form' );
    let results = document.querySelector( '.results' );

    registerForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let username = document.getElementById( 'userUsername' ).value;
        let password = document.getElementById( 'userPassword' ).value;
        let email = document.getElementById( 'userEmail' ).value;
        let firstName = document.getElementById( 'userFirstName' ).value;
        let lastName = document.getElementById( 'userLastName' ).value;
        let age = document.getElementById( 'userAge' ).value;
        let tags = document.getElementById( 'userTags' ).value;

        /*
        if (navigator.geolocation) {
            var location_timeout = setTimeout("geolocFail()", 10000);
        
            navigator.geolocation.getCurrentPosition(function(position) {
                clearTimeout(location_timeout);
        
                userlat = position.coords.latitude;
                userlng = position.coords.longitude;
        
                //geocodeLatLng(lat, lng);
            }, function(error) {
                clearTimeout(location_timeout);
                geolocFail();
            });
        } else {
            // Fallback for no geolocation
            geolocFail();
        }
        */
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            userlat = position.coords.latitude;
            userlng = position.coords.longitude;
            console.log("Your coordinates are:");
            console.log(userlat);
            console.log(userlng);
            });
        }
        
        console.log("Your other coordinates are:");
        console.log(userlat);
        console.log(userlng);
        if( userlat && userlng){
            userRegisterFetch( username, password, email, firstName, lastName, age, tags, userlat, userlng );
        }
        else{
            results.innerHTML = `<div> Could not get your location </div>`;
        }
        
    })
}

function watchLoginForm(){
    let loginForm = document.querySelector( '.login-form' );

    loginForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        window.location.href = "/index.html";
    })
}

function init(){
    watchLoginForm();
    watchRegisterForm();
}

init();
