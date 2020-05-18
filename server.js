const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const mongoose = require( 'mongoose' );
const validateToken = require('./middleware/validateToken.js');
const cors = require( './middleware/cors' );
const { Users } = require( './models/users-model' );
const { Comments } = require( './models/comments-model' );
const { Events } = require( './models/events-model' );
const { DATABASE_URL, PORT } = require( './config' );


const app = express();
const jsonParser = bodyParser.json();

app.use( cors );
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ) );
app.use( validateToken );

app.get( '/event-manager/events', ( req, res ) => {
    Events
        .getAllEvents()
        .then( events => {
            return res.status( 200 ).json( events );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/event-manager/events-by-keyword/:keyword', ( req, res ) => {
    const keyword = req.params.keyword;

    if( !keyword ){
        res.statusMessage = "Please send the 'keyword' as parameter.";
        return res.status( 406 ).end();
    }

    Events
        .getEventsByKeyword( keyword )
        .then( event => {
            if( !event ){
                res.statusMessage = `There are no events with the provided 'keyword=${keyword}'.`;
                return res.status( 404 ).end();
            }
            return res.status( 200 ).json( event );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/event-manager/events-by-title/:title', ( req, res ) => {
    const title = req.params.title;

    if( !title ){
        res.statusMessage = "Please send the 'title' as parameter.";
        return res.status( 406 ).end();
    }

    Events
        .getEventsByTitle( title )
        .then( event => {
            if( !event ){
                res.statusMessage = `There are no events with the provided 'title=${title}'.`;
                return res.status( 404 ).end();
            }
            return res.status( 200 ).json( event );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/event-manager/events-by-tag/:tag', ( req, res ) => {
    const tag = req.params.tag;

    if( !tag ){
        res.statusMessage = "Please send the 'tag' as parameter.";
        return res.status( 406 ).end();
    }

    Events
        .getEventsByTag( tag )
        .then( event => {

            if( !event ){
                res.statusMessage = `There are no events with the provided 'tag=${tag}'.`;
                return res.status( 404 ).end();
            }

            return res.status( 200 ).json( event );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/event-manager/events-by-proximity', ( req, res ) => {
    let lat = req.query.lat;
    let lng = req.query.lng;
    let dist = req.query.dist;

    if( !dist ){
        res.statusMessage = "Please send the 'distance' as parameter.";
        return res.status( 406 ).end();
    }
    if( !lat ){
        res.statusMessage = "Please send the 'latitude' as parameter.";
        return res.status( 406 ).end();
    }
    if( !lng ){
        res.statusMessage = "Please send the 'longitude' as parameter.";
        return res.status( 406 ).end();
    }
    
    var location = [lat, lng];

    Events
        .getEventsByProximity( location, dist )
        .then( event => {

            if( !event ){
                res.statusMessage = `There are no events with the provided location'.`;
                return res.status( 404 ).end();
            }

            return res.status( 200 ).json( event );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/event-manager/events-by-dates', ( req, res ) => {
    let date1 = req.query.date1;
    let date2 = req.query.date2;

    if( !date1 ){
        res.statusMessage = "Please send the 'date1' as parameter.";
        return res.status( 406 ).end();
    }
    if( !date2 ){
        res.statusMessage = "Please send the 'date2' as parameter.";
        return res.status( 406 ).end();
    }

    Events
        .getEventsBetweenDates( date1, date2 )
        .then( event => {

            if( !event ){
                res.statusMessage = `There are no events between the provided dates.`;
                return res.status( 404 ).end();
            }

            return res.status( 200 ).json( event );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/blog-post/events-by-user/:username', ( req, res ) => {
    const username = req.params.username;

    if( !username ){
        res.statusMessage = "Please send the 'username' as parameter.";
        return res.status( 406 ).end();
    }

    Users
        .getUserByUsername( username )
        .then( user => {

            if( !user ){
                res.statusMessage = `There are no users with the provided 'username=${username}'.`;
                return res.status( 404 ).end();
            }

            Events
                .getEventsByUserId( user._id )
                .then( events => {
                    return res.status( 200 ).json( events );
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                });
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.post( '/event-manager/add-event', jsonParser, ( req, res ) => {
    var { title, description, pictures, tags, date, recurring, location, creator, participants, comments } = req.body;

    if( !title || !description || !date || !location || !creator){
        res.statusMessage = "One of these parameters is missing in the request: 'username', 'email', 'tags' or 'location'.";
        return res.status( 406 ).end();
    }

    if( (typeof(location.coordinates[0]) !== 'number') && (typeof(location.coordinates[1]) !== 'number') ){
        res.statusMessage = "The coordinates for the location MUST be numbers.";
        return res.status( 409 ).end();
    }

    if( location.type !== 'Point' ){
        res.statusMessage = "The type of the location MUST be 'Point'.";
        return res.status( 409 ).end();
    }
    if(!pictures){
        pictures = [];
    }
    if(!tags){
        tags = [];
    }
    if(!recurring){
        recurring = false;
    }

    if(!participants){
        participants = [];
    }
    if(!comments){
        comments = [];
    }

    const newEvent = {
        title, 
        description, 
        pictures,
        tags, 
        date, 
        recurring, 
        location, 
        creator, 
        participants, 
        comments
    };

    Events
        .addEvent( newEvent )
        .then( event => {
            return res.status( 201 ).json( event );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});



app.post( '/event-manager/add-user', jsonParser, ( req, res ) => {
    var { username, password, email, firstName, lastName, age, tags, location, eventsOwned, eventsInvited, favorites } = req.body;

    if( !username || !password || !email || !tags || !location){
        res.statusMessage = "One of these parameters is missing in the request: 'username', 'password', 'email', 'tags' or 'location'.";
        return res.status( 406 ).end();
    }

    if((!age)&&( typeof(age) !== 'number' )){
        res.statusMessage = "The 'age' MUST be a number.";
        return res.status( 409 ).end();
    }

    if( (typeof(location.coordinates[0]) !== 'number') && (typeof(location.coordinates[1]) !== 'number') ){
        res.statusMessage = "The coordinates for the location MUST be numbers.";
        return res.status( 409 ).end();
    }

    if( location.type !== 'Point' ){
        res.statusMessage = "The type of the location MUST be 'Point'.";
        return res.status( 409 ).end();
    }


    if(!firstName){
        firstName = "";
    }
    if(!lastName){
        lastName = "";
    }
    if(!age){
        age = 0;
    }
    if(!eventsOwned){
        eventsOwned = [];
    }
    if(!eventsInvited){
        eventsInvited = [];
    }
    if(!favorites){
        favorites =[];
    }
    

    const newUser = {
        username,
        password, 
        email, 
        firstName, 
        lastName, 
        age, 
        tags, 
        location,
        eventsOwned, 
        eventsInvited,
        favorites
    };

    Users
        .createUser( newUser )
        .then( user => {
            return res.status( 201 ).json( user );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/event-manager/users', ( req, res ) => {
    Users
        .getAllUsers()
        .then( users => {
            return res.status( 200 ).json( users );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.post( '/event-manager/add-comment', jsonParser, ( req, res ) => {
    var { title, content, username, event, date} = req.body;

    if( !title || !content || !username || !event || !date){
        res.statusMessage = "One of these parameters is missing in the request: 'title', 'content', 'username', 'event' or 'date'.";
        return res.status( 406 ).end();
    }

    Users
        .getUserByUsername( username )
        .then( user => {

            if( !user ){
                res.statusMessage = `There are no user with the provided 'username=${username}'.`;
                return res.status( 404 ).end();
            }

            const newComment = {
                title, 
                content,
                user : user._id,
                event,
                date
            }
            
            Comments
                .addComment( newComment )
                .then( comment => {
                    return res.status( 201 ).json( comment );
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                });
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/event-manager/comments', ( req, res ) => {
    Comments
        .getAllComments()
        .then( comments => {
            return res.status( 200 ).json( comments );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/event-manager/comments-by-user/:username', ( req, res ) => {
    const username = req.params.username;

    if( !username ){
        res.statusMessage = "Please send the 'username' as parameter.";
        return res.status( 406 ).end();
    }

    Users
        .getUserByUsername( username )
        .then( user => {

            if( !user ){
                res.statusMessage = `There are no user with the provided 'username=${username}'.`;
                return res.status( 404 ).end();
            }

            Comments
                .getCommentsByUserId( user._id )
                .then( comments => {
                    return res.status( 200 ).json( comments );
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                });
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.listen( PORT, () =>{
    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {
        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});