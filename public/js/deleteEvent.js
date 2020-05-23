const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';


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

function userDeleteFetch( title, id ){
    let url = `/event-manager/delete-event/`;

    console.log("The data being sent:");
    console.log(data);

    let settings = {
        method : 'DELETE',
        headers : {
            sessiontoken : localStorage.getItem( 'token' ),
            'Content-Type' : 'application/json'
        },
        //body : JSON.stringify( data )
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
            
            //let i = 0;
            //for(let i=0; i<responseJSON.length; i++){
                results.innerHTML += `<h2> The Event deleted: </h2>`;
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

                results.innerHTML += `<div> Creator: ${responseJSON.creator.username} </div>`;
                for(let l=0; l<responseJSON.participants.length; l++){
                    results.innerHTML += `<div> Participant ${l+1}: ${responseJSON.participants[l].username} </div>`;
                }
                
                for(let m=0; m<responseJSON.comments.length; m++){
                    results.innerHTML += `<h4> Comment ${m+1}: </h4>`;
                    results.innerHTML += `<div> Participants: ${responseJSON.comments[m].title} </div>`;
                    results.innerHTML += `<div> Participants: ${responseJSON.comments[m].contentent} </div>`;
                    results.innerHTML += `<div> Participants: ${responseJSON.comments[m].user} </div>`;
                    var date2 = new Date(responseJSON.comments[m].date);
                    results.innerHTML += `<div> Participants: ${date2} </div>`;
                }
            //}

        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}


function watchDeleteForm(){
    let registerForm = document.querySelector( '.register-form' );
    let results = document.querySelector( '.results' );

    registerForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let id = localStorage.getItem( 'id' );
        let title = document.getElementById( 'eventTitle' ).value;
        userDeleteFetch( title, id );
    })
}

function init(){
    watchDeleteForm();
}

init();



