
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
        let greeting = document.querySelector( '.results' );
        greeting.innerHTML = `Welcome back ${responseJSON.firstName} ${responseJSON.lastName}!`;
    })
    .catch( err => {
        console.log( err.message );
        window.location.href = "/index.html";
    });