const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';
var map, infoWindow;
var userlat, userlng;
//const nodemailer = require('nodemailer');   

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



function watchContactForm(){
    let registerForm = document.querySelector( '.register-form' );

    registerForm.addEventListener( 'submit' , ( e ) => {
        e.preventDefault();
        let firstName = document.getElementById( 'formFirstName' ).value;
        let lastName = document.getElementById( 'formLastName' ).value;
        let subject = document.getElementById( 'formSubject' ).value;
        let email = document.getElementById( 'formEmail' ).value;
        let content = document.getElementById( 'formContent' ).value;
        let username = localStorage.getItem( 'username' );
        //let username = localStorage.getItem( 'username' );
        //let userId = localStorage.getItem( 'id' );

            Email.send({
                Host: "smtp.gmail.com",
                Username : "eventmanagerz123@gmail.com",
                Password : "loti1234",
                To : email,
                From : "eventmanagerz123@gmail.com",
                Subject : `Copy: ${subject} from ${username}`,
                Body : `${content} 
                        Kind Regards,
                ${firstName} ${lastName}`,
                }).then(
                    message => alert("mail sent successfully")
                );
    })
}

function init(){
    watchContactForm();
}

init();