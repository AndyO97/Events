const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const mongoose = require( 'mongoose' );
const bcrypt = require ( 'bcryptjs' );
const jsonwebtoken = require( 'jsonwebtoken' );
const validateToken = require('./middleware/validateToken.js');
const cors = require( './middleware/cors' );
const { Users } = require( './models/users-model' );
const { Comments } = require( './models/comments-model' );
const { Events } = require( './models/events-model' );
const { DATABASE_URL, PORT, TOKEN } = require( './config' );
//const nodemailer = require('nodemailer');


const app = express();
const jsonParser = bodyParser.json();

app.use( cors );
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ) );
//app.use( validateToken );

//For events:

app.get( '/event-manager/eventss', ( req, res ) => {

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

app.get( '/event-manager/events', ( req, res ) => {
    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
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
});

app.get( '/event-manager/events/:CreatorId', ( req, res ) => {
    const { sessiontoken } = req.headers;

    const id = req.params.CreatorId;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
    Events
        .getAllEvents2(id)
        .then( events => {
            return res.status( 200 ).json( events );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
    });
});

app.get( '/event-manager/events-by-keyword', ( req, res ) => {
    let creatorId = req.query.creatorId;
    let keyword = req.query.keyword;
    
    const { sessiontoken } = req.headers;
    
    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
    
        if( !creatorId ){
            res.statusMessage = "Please send the 'creatorId' as parameter.";
            return res.status( 406 ).end();
        }

        if( !keyword ){
            res.statusMessage = "Please send the 'keyword' as parameter.";
            return res.status( 406 ).end();
        }

    Events
        .getEventsByKeyword2( keyword, creatorId )
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
});

app.get( '/event-manager/events-by-title/:title', ( req, res ) => {
    let title = req.params.title;

    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        if( !title ){
            res.statusMessage = "Please send the 'title' as parameter.";
            return res.status( 406 ).end();
        }

    Events
        .getEventsByTitle( title)
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
});

app.get( '/event-manager/events-by-title', ( req, res ) => {
    let creatorId = req.query.creatorId;
    let title = req.query.title;

    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        if( !title ){
            res.statusMessage = "Please send the 'title' as parameter.";
            return res.status( 406 ).end();
        }
        if( !creatorId ){
            res.statusMessage = "Please send the 'creatorId' as parameter.";
            return res.status( 406 ).end();
        }

    Events
        .getEventsByTitle2( title, creatorId )
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
});

app.get( '/event-manager/events-by-id/:id', ( req, res ) => {
    const id = req.params.id;

    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        if( !id ){
            res.statusMessage = "Please send the 'id' as parameter.";
            return res.status( 406 ).end();
        }

    Events
        .getEventById( id )
        .then( event => {
            if( !event ){
                res.statusMessage = `There are no events with the provided 'id=${id}'.`;
                return res.status( 404 ).end();
            }
            return res.status( 200 ).json( event );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
    });
});

app.get( '/event-manager/events-by-userId/:userId', ( req, res ) => {
    const userId = req.params.userId;

    const { sessiontoken } = req.headers;
    
    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
    
        if( !userId ){
            res.statusMessage = "Please send the 'userId' as parameter.";
            return res.status( 406 ).end();
        }

    Events
        .getAllEventsByUserId( userId )
        .then( event => {
            if( !event ){
                res.statusMessage = `There are no events with the provided 'userId=${userId}'.`;
                return res.status( 404 ).end();
            }
            return res.status( 200 ).json( event );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
    });
});

app.get( '/event-manager/events-by-tag/:tag', ( req, res ) => {

    let tag = req.params.tag;

    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }    

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
});

app.get( '/event-manager/events-by-tag', ( req, res ) => {
    let creatorId = req.query.creatorId;
    let tag = req.query.tags;

    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }    

        if( !tag ){
            res.statusMessage = "Please send the 'tag' as parameter.";
            return res.status( 406 ).end();
        }

        if( !creatorId ){
            res.statusMessage = "Please send the 'creatorId' as parameter.";
            return res.status( 406 ).end();
        }

    Events
        .getEventsByTag2( tag, creatorId )
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
});

app.get( '/event-manager/events-by-proximity', ( req, res ) => {

    let lat = req.query.lat;
    let lng = req.query.lng;
    let dist = req.query.dist;
    let creatorId = req.query.creatorId;

    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }

    if( !dist){
        res.statusMessage = "Please send the 'distance' as parameter.";
        return res.status( 406 ).end();
    }
    if( !lat ){
        res.statusMessage = "Please send the 'latitude'  as parameter.";
        return res.status( 406 ).end();
    }
    if( !lng ){
        res.statusMessage = "Please send the 'longitude' as parameter.";
        return res.status( 406 ).end();
    }
    if( !creatorId ){
        res.statusMessage = "Please send the 'creatorId' as parameter.";
        return res.status( 406 ).end();
    }
    

    Events
        .getEventsByProximity2( lat, lng, dist, creatorId )
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
});

app.get( '/event-manager/events-by-dates', ( req, res ) => {
    let date1 = req.query.date1;
    let date2 = req.query.date2;
    let creatorId = req.query.creatorId;

    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }

    if( !date1 ){
        res.statusMessage = "Please send the 'date1' as parameter.";
        return res.status( 406 ).end();
    }
    if( !date2 ){
        res.statusMessage = "Please send the 'date2' as parameter.";
        return res.status( 406 ).end();
    }
    if( !creatorId ){
        res.statusMessage = "Please send the 'creatorId' as parameter.";
        return res.status( 406 ).end();
    }

    Events
        .getEventsBetweenDates2( date1, date2, creatorId )
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
});

//Not used
app.get( '/event-manager/events-by-user/:username', ( req, res ) => {
    const username = req.params.username;

    const { sessiontoken } = req.headers;
    /*
    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
    */
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
    //});
});

app.post( '/event-manager/add-event', jsonParser, ( req, res ) => {
    var { title, description, pictures, tags, date, private, location, creator, participants, comments } = req.body;

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
    if(!private){
        private = false;
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
        private, 
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

app.post( '/event-manager/create-event', jsonParser, ( req, res ) => {
    var { title, description, pictures, tags, date, private, location, creator, participants, comments } = req.body;

    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        
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
        if(!private){
            private = false;
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
            private, 
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
});

app.delete( '/event-manager/delete-event', ( req, res ) => {
    
    let id = req.query.id;
    let title= req.query.title;

    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }

        if( !id ){
            res.statusMessage = "Please send the creator's 'id' to delete an event";
            return res.status( 406 ).end();
        }
    
        if( !title ){
            res.statusMessage = "Please send the 'title' to delete a event";
            return res.status( 406 ).end();
        }
    
        Events
                .deleteEventByTitleAndCreatorId( title, id )
                .then( result => {
                    // Handle id no id found error
                    //console.log(result);
                    if( !result ){
                        res.statusMessage = `There are no events with the provided 'title=${title}'.`+
                                            result.errmsg;
                        return res.status( 409 ).end();
                    }
                    return res.status( 202 ).json( result ); 
                })
                .catch( err => {
                    res.statusMessage = `There are no events with the provided 'title=${title}'.`;
                    return res.status( 404 ).end();
                    //res.statusMessage = "Something is wrong with the Database. Try again later";
                    //return res.status( 500 ).end();
                });

    });
    
});

app.patch( '/event-manager/update-event/:id', jsonParser, ( req, res ) => {
    var { title, description, pictures, tags, date, private, location, creator, participants, comments } = req.body;  
    let id = req.params.id;
    //const { sessiontoken } = req.headers;

        if( !(title ||description ||pictures ||tags ||date ||private ||location ||creator ||participants ||comments) ){
            res.statusMessage = "At least an element should be send to be modified.";
            return res.status( 406 ).end();
        }
        Events
        .getEventById( id )
        .then( result => {
            if( !result){
                res.statusMessage = `There are no events with the provided 'id=${id}'.`+
                                    result.errmsg;
                return res.status( 404 ).end();
            }

            if(title){
                result.title = title;
            }
            if(description){
                result.description = description;
            }
            if(pictures){
                result.pictures.push(pictures);
            }
            if(tags){
                result.tags.push(tags);
            }
            if(date){
                result.date = date;
            }
            if(private!=null){
                result.private = private;
            }
            if(location){
                result.location = location;
            }
            if(creator){
                result.creator = creator;
            }
            if(participants){
                result.participants.push(participants);
            }
            if(comments){
                result.comments.push(comments);
            }
            //.save()
            result.save();
            //result.save(function(){})

            return res.status( 202 ).json( result );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 404 ).end();
        })                           
});

//For users:
app.get( '/event-manager/user-info/:username', ( req, res ) => {
    const { sessiontoken } = req.headers;
    const username = req.params.username;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        Users
        .getUserByUsername(username)
        .then( user => {
            return res.status( 200 ).json( user );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
    });
});

app.get( '/event-manager/user-info2/:username', ( req, res ) => {
    const { sessiontoken } = req.headers;
    const username = req.params.username;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        Users
        .getUserByUsername3(username)
        .then( user => {
            return res.status( 200 ).json( user );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
    });
});



app.get( '/event-manager/validate-user', ( req, res ) => {
    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }

        return res.status( 200 ).json( decoded );
    });
});

app.post( '/event-manager/users/login', jsonParser, ( req, res ) => {
    let { email, password } = req.body;

    if( !email || !password ){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }

    Users
        .getUserByUsernameOrEmail( email )
        .then( user => {

            if( user ){
                bcrypt.compare( password, user.password )
                    .then( result => {
                        if( result ){
                            let userData = {
                                _id : user._id,
                                username : user.username,
                                email : user.email,
                                firstName : user.firstName,
                                lastName : user.lastName,
                                age : user.age,
                                tags : user.tags,
                                location : user.location,
                                eventsOwned : user.eventsOwned,
                                favorites : user.favorites
                            };

                            jsonwebtoken.sign( userData, TOKEN, { expiresIn : '15m' }, ( err, token ) => {
                                if( err ){
                                    res.statusMessage = "Something went wrong with generating the token.";
                                    return res.status( 400 ).end();
                                }
                                return res.status( 200 ).json( { token } );
                            });
                        }
                        else{
                            throw new Error( "Invalid credentials" );
                        }
                    })
                    .catch( err => {
                        res.statusMessage = err.message;
                        return res.status( 400 ).end();
                    });
            }
            else{
                throw new Error( "User doesn't exists!" );
            }
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});


app.post( '/event-manager/register', jsonParser, ( req, res ) => {
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
    
    bcrypt.hash( password, 10 )
        .then( hashedPassword => {
            let newUser = {
                username,
                password : hashedPassword,
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
                .then( result => {
                    jsonwebtoken.sign( newUser, TOKEN, { expiresIn : '15m' }, ( err, token ) => {
                        if( err ){
                            res.statusMessage = "Something went wrong with generating the token.";
                            return res.status( 400 ).end();
                        }
                        return res.status( 200 ).json( { token } );
                    }); 
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

app.patch( '/event-manager/update-user/:username', jsonParser, ( req, res ) => {
    var { username, password, email, firstName, lastName, age, tags, location, eventsOwned, eventsInvited, favorites } = req.body;
    let IsPassword = false;
    let username2 = req.params.username;
    const { sessiontoken } = req.headers;

    
    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        
        if( !(username || password || email || firstName || lastName || age ||tags || location || eventsOwned || eventsInvited || favorites) ){
            res.statusMessage = "At least an element should be send to be modified.";
            return res.status( 406 ).end();
        }

        if(password){
            IsPassword = true;
        }
        else{
            password ="123";
        }

        bcrypt.hash( password, 10 )
        .then( hashedPassword => {
            let password = hashedPassword;
            Users
                .getUserByUsername2( username2 )
                .then( result => {
                    if( !result){
                        res.statusMessage = `There are no users with the provided 'username=${username2}'.`+
                                            result.errmsg;
                        return res.status( 404 ).end();
                    }

                    if(username){
                        result.username = username;
                    }
                    if(email){
                        result.email = email;
                    }
                    if(firstName){
                        result.firstName = firstName;
                    }
                    if(lastName){
                        result.lastName = lastName;
                    }
                    if(age){
                        result.age = age;
                    }
                    if(tags){
                        result.tags.push(tags);
                    }
                    if(location){
                        result.location = location;
                    }
                    if(eventsOwned){
                        result.eventsOwned.push(eventsOwned);
                    }
                    if(eventsInvited){
                        result.eventsInvited.push(eventsInvited);
                    }
                    if(favorites){
                        result.favorites.push(favorites);
                    }

                    if(IsPassword){
                        result.password = password;
                    }
                    result.save();
                    console.log(result);
                        let newUser = {
                            username : result.username,
                            email : result.email,
                            firstName : result.firstName,
                            lastName : result.lastName,
                            age : result.age,
                            tags : result.tags,
                            location : result.location,
                            eventsOwned : result.eventsOwned,
                            favorites : result.favorites
                        };
                        jsonwebtoken.sign( newUser, TOKEN, { expiresIn : '15m' }, ( err, token ) => {
                            if( err ){
                                res.statusMessage = "Something went wrong with generating the token.";
                                return res.status( 400 ).end();
                            }
                            return res.status( 200 ).json( { token } );
                        }); 
                    //return res.status( 202 ).json( result );
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 404 ).end();
                })    

        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });            
                
    });

});

app.patch( '/event-manager/update-user2/:username', jsonParser, ( req, res ) => {
    var { username, email, firstName, lastName, age, tags, location, eventsOwned, eventsInvited, favorites } = req.body;
    let IsPassword = false;
    let username2 = req.params.username;
    const { sessiontoken } = req.headers;

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        if( !(username || email || firstName || lastName || age ||tags || location || eventsOwned || eventsInvited || favorites) ){
            res.statusMessage = "At least an element should be send to be modified.";
            return res.status( 406 ).end();
        }

        Users
                .getUserByUsername2( username2 )
                .then( result => {
                    if( !result){
                        res.statusMessage = `There are no users with the provided 'username=${username2}'.`+
                                            result.errmsg;
                        return res.status( 404 ).end();
                    }

                    if(username){
                        result.username = username;
                    }
                    if(email){
                        result.email = email;
                    }
                    if(firstName){
                        result.firstName = firstName;
                    }
                    if(lastName){
                        result.lastName = lastName;
                    }
                    if(age){
                        result.age = age;
                    }
                    if(tags){
                        result.tags.push(tags);
                    }
                    if(location){
                        result.location = location;
                    }
                    if(eventsOwned){
                        result.eventsOwned.push(eventsOwned);
                    }
                    if(eventsInvited){
                        result.eventsInvited.push(eventsInvited);
                    }
                    if(favorites){
                        result.favorites.push(favorites);
                    }
                    result.save();
                    console.log(result);
                        
                    return res.status( 200 ).json( result );
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 404 ).end();
                });                             
    });
});

app.delete( '/event-manager/delete-user/:username', ( req, res ) => {

    const { sessiontoken } = req.headers;
    let username = req.params.username;

    if( !username ){
        res.statusMessage = "Please send the 'username' to delete a user";
        return res.status( 406 ).end();
    }

    jsonwebtoken.verify( sessiontoken, TOKEN, ( err, decoded ) => {
        if( err ){
            res.statusMessage = "Session expired!";
            return res.status( 400 ).end();
        }
        Users
            .deleteUserByUsername( username )
            .then( result => {
                if( !result ){
                    res.statusMessage = `There are no users with the username 'username=${username}'.`+
                                        result.errmsg;
                    return res.status( 409 ).end();
                }
                
                return res.status( 200 ).json( result ); 
            })
            .catch( err => {
                res.statusMessage = "Something is wrong with the Database. Try again later";
                return res.status( 500 ).end();
            });
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

//For comments:

app.post( '/event-manager/add-comment', jsonParser, ( req, res ) => {
    var { title, content, username, user, event, date} = req.body;

    if( !title || !content || !username || !user || !event || !date){
        res.statusMessage = "One of these parameters is missing in the request: 'title', 'content', 'UserId', 'event' or 'date'.";
        return res.status( 406 ).end();
    }
    const newComment = {
        title, 
        content,
        username,
        user,
        event,
        date
    };
    Comments
        .addComment( newComment )
        .then( comment => {
            return res.status( 201 ).json( comment );
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


//For sending emails
/*
app.post( '/event-manager/send-email', jsonParser, ( req, res ) => {
    var {receiver, subject, text} = req.body;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'eventmanagerz123@gmail.com',
              pass: 'loti1234'
            }
        });
          
        var mailOptions = {
            from: 'eventmanagerz123@gmail.com',
            to: receiver,
            subject: subject,
            text: text
        };  
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return res.status( 400 ).end();
            } else {
                console.log('Email sent: ' + info.response);
                return res.status( 200 ).end();
            }
        });     
});
*/

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