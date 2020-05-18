const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';


function getEventsFetch(){
    let url = `/event-manager/events`;

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
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON.length);
            results.innerHTML = "";
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
                results.innerHTML += `<div> Date: ${responseJSON[i].date} </div>`;
                results.innerHTML += `<div> Creator: ${responseJSON[i].creator.username} </div>`;
                for(let l=0; l<responseJSON[i].participants.length; l++){
                    results.innerHTML += `<div> Participants: ${responseJSON[i].participants[l].username} </div>`;
                }
                for(let m=0; m<responseJSON[i].comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Participants: ${responseJSON[i].comments[m].title} </div>`;
                    results.innerHTML += `<div> Participants: ${responseJSON[i].comments[m].contentent} </div>`;
                    results.innerHTML += `<div> Participants: ${responseJSON[i].comments[m].user} </div>`;
                    results.innerHTML += `<div> Participants: ${responseJSON[i].comments[m].date} </div>`;
                }
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getEventsFetchTitle( title ){
    //let url = `http://localhost:8080/event-manager/events-by-title/${title}`;
    let url = `/event-manager/events-by-title/${title}`;
    console.log(url);
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
            console.log(response);
            console.log(response.body);
            if( response.ok ){
                console.log(response.json());
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
                console.log("Reached then")
                results.innerHTML = "";
                results.innerHTML += `<div> Event: </div>`;
                results.innerHTML += `<div> Title: ${responseJSON[0].title} </div>`;
                results.innerHTML += `<div> Description: ${responseJSON[0].description} </div>`;
                results.innerHTML += `<div> Tags: ${responseJSON[0].tags} </div>`;
                results.innerHTML += `<div> Date: ${responseJSON[0].date} </div>`;
                results.innerHTML += `<div> Creator: ${responseJSON[0].creator.username} </div>`;
                //results.innerHTML += `<div> Participants: ${responseJSON[0].participants[0].username} </div>`;
        })
        .catch( err => {
            console.log("Reached the catch");
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function getEventsFetchTag( tag ){
    //let url = `http://localhost:8080/event-manager/events-by-title/${tag}`;
    let url = `/event-manager/events-by-title/${tag}`;

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
                //results.innerHTML += `<div> Participants: ${responseJSON[0].participants[0].username} </div>`;
        })
        .catch( err => {
            console.log("Reached the catch");
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

function watchGetEventsTagForm(){
    let eventsForm = document.querySelector( '.tag-event-form' );

    eventsForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let tag = document.getElementById( 'eventTag' ).value;
        
        getEventsFetchTag( tag );
    })
}

function init(){
    watchGetEventsTitleForm();
    watchGetEventsTagForm();
    watchGetEventsForm();
}

init();