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



function userDeleteFetch( username  ){
    let url = `/event-manager/update-user/${username2}`;

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

            //delete owned events

            localStorage.removeItem( 'token');
            localStorage.removeItem( 'username');
            localStorage.removeItem( 'id');
            window.location.href = "./../index.html";
            
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}


function watchUpdateForm(){
    let registerForm = document.querySelector( '.register-form' );
    //let results = document.querySelector( '.results' );

    registerForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let username = localStorage.getItem( 'username' );
        
        userDeleteFetch( username);
    })
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

function init(){
    watchUpdateForm();
}

init();



