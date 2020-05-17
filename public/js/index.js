const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';


function getEventsFetchTitle( title ){
    let url = `http://localhost:8080/event-manager/events-by-title/${title}`;

    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },

    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                console.log(response.json());
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
                results.innerHTML = "";
                results.innerHTML += `<div> Event: </div>`;
                results.innerHTML += `<div> Title: ${responseJSON[0].title} </div>`;
                results.innerHTML += `<div> Description: ${responseJSON[0].description} </div>`;
                results.innerHTML += `<div> Date: ${responseJSON[0].date} </div>`;
                results.innerHTML += `<div> Creator: ${responseJSON[0].creator.username} </div>`;
                results.innerHTML += `<div> Participants: ${responseJSON[0].participants[0].username} </div>`;
        })
        .catch( err => {
            console.log("Reached the catch");
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getEventsFetchTag( tag ){
    let url = `http://localhost:8080/event-manager/events-by-title/${tag}`;

    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },

    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                console.log(response.json());
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
                results.innerHTML = "";
                results.innerHTML += `<div> Event: </div>`;
                results.innerHTML += `<div> Title: ${responseJSON[0].title} </div>`;
                results.innerHTML += `<div> Description: ${responseJSON[0].description} </div>`;
                results.innerHTML += `<div> Date: ${responseJSON[0].date} </div>`;
                results.innerHTML += `<div> Creator: ${responseJSON[0].creator.username} </div>`;
                results.innerHTML += `<div> Participants: ${responseJSON[0].participants[0].username} </div>`;
        })
        .catch( err => {
            console.log("Reached the catch");
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}


function watchGetEventsTitleForm(){
    let bookmarksForm = document.querySelector( '.title-event-form' );

    bookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'eventTitle' ).value;
        
        getEventsFetchTitle( title );
    })
}

function watchGetEventsTagForm(){
    let bookmarksForm = document.querySelector( '.tag-event-form' );

    bookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let tag = document.getElementById( 'eventTag' ).value;
        
        getEventsFetchTag( tag );
    })
}

function init(){
    watchGetEventsTitleForm();
    watchGetEventsTagForm()
}

init();