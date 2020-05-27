const mongoose = require( 'mongoose' );

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    age : {
        type : Number,
    },
    tags : [{
        type : String,
        required : true,
    }],
    location: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    eventsOwned : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'events',
    }],
    eventsInvited : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'events',
    }],
    favorites : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'events',
    }]

});

const userModel = mongoose.model( 'users', userSchema );

const Users = {
    createUser : function( newUser ){
        return userModel
                .create( newUser )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getAllUsers : function(){
        return userModel
                .find()
                .populate('eventsOwned', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .populate('eventsInvited', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .populate('favorites', ['_id', 'title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .then( users => {
                    return users;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getUserByUsername : function( username ){
        return userModel
                .find( { username : username } )
                .populate('eventsOwned', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .populate('eventsInvited', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .populate('favorites', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getUserByUsername3 : function( username ){
        return userModel
                .find( { username : username } )
                .populate('eventsOwned', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .populate('eventsInvited', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .populate('favorites', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content', 'username', 'user', 'date'] )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getUserByUsername2 : function( username ){
        return userModel
                .findOne( { username : username } )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getUserByUsernameOrEmail : function( email ){
        return userModel
                .findOne( { $or:[ {username : email }, { email : email} ]} )
                //.findOne( {username : email } )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getUserById : function( id ){
        return userModel
                .findOne( { _id : id } )
                .populate('eventsOwned', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .populate('eventsInvited', ['title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .populate('favorites', ['_id', 'title', 'description','pictures', 'tags', 'date', 'private', 'location', 'creator', 'participants', 'comments'] )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    deleteUserByUsername : function(username){
        return userModel
            .findOneAndDelete({username : username})
            .then( user => {
                return user;
            })
            .catch( err => {
                return err;
            });
    },
    deleteUserById : function(id){
        return userModel
            .findOneAndDelete({_id : id})
            .then( user => {
                return user;
            })
            .catch( err => {
                return err;
            });
    },
    updateUserByUsername : function(username){
        return userModel
            .findOne({username : username})
            .then( user => {
                return user;
            })
            .catch( err => {
                return err;
            });
    },
    updateUserById : function(id){
        return userModel
            .findOne({_id : id})
            .then( user => {
                return user;
            })
            .catch( err => {
                return err;
            });
    }

}

module.exports = {
    Users
};