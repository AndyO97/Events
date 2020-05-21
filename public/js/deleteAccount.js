const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';


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

//For deleting

function userDeleteFetch( username ){
    let url = `/event-manager/delete-user/${username}`;

    let settings = {
        method : 'DELETE',
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

            //Call function to delete events by owner's username
            localStorage.removeItem( 'token');
            localStorage.removeItem( 'username');
            localStorage.removeItem( 'id');
            window.location.href = "./../index.html";
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}


function watchDeleteForm(){
    let deleteForm = document.querySelector( '.register-form' );
    //let results = document.querySelector( '.results' );
    let username = localStorage.getItem( 'username' );

    deleteForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        
        userDeleteFetch( username);
    })
}

function init(){
    watchDeleteForm();
}

init();



