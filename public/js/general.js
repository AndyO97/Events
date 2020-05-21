
let url = "/event-manager/validate-user";
let settings = {
    method : 'GET',
    headers : {
        sessiontoken : localStorage.getItem( 'token' )
    },
    async : false
};

fetch( url, settings )
    .then( response => {
        if( response.ok ){
            return response.json();
        }

        throw new Error( response.statusText );
    })
    .then( responseJSON => {
        console.log(`Welcome back ${responseJSON.firstName} ${responseJSON.lastName}!`);
        let greeting = document.querySelector( '.results' );
        greeting.innerHTML = `Welcome back ${responseJSON.firstName} ${responseJSON.lastName}!`;
        if(!localStorage.getItem( 'username')){
            localStorage.setItem( 'username', responseJSON.username );
        }
        if(!localStorage.getItem( 'id')){
            localStorage.setItem( 'id', responseJSON._id );
        }
    })
    .catch( err => {
        console.log( err.message );
        window.location.href = "/index.html";
    });