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
        required : true
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
                .then( users => {
                    return users;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getUserByUsername : function( username ){
        return userModel
                .findOne( { username : username } )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getUserById : function( id ){
        return userModel
                .findOne( { id } )
                .then( user => {
                    return user;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    }
}

module.exports = {
    Users
};