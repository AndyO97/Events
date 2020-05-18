const mongoose = require( 'mongoose' );

const eventSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    pictures : [{
        type : String,
    }],
    tags : [{
        type : String,
    }],
   date : {
        type : Date,
        required : true
   },
    recurring : {
        type : Boolean
    },
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
    creator : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : true
    },
    participants : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
    }],
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'comments',
        required : true
    }]
});

const eventModel = mongoose.model( 'events', eventSchema );

const Events = {
    addEvent : function( newEvent ){
        return eventModel
                .create( newEvent )
                .then( event => {
                    return event;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getAllEvents : function(){
        return eventModel
                .find()
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content','user'] )
                .then( events => {
                    return events;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getEventsByUserId : function( id ){
        return commentModel
                .find( { creator : id } )
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content','user'] )
                .then( comments => {
                    return comments;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getEventsByTitle : function( title ){
        return eventModel
                .find( { title : title } )
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content','user'] )
                .then( events => {
                    return events;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getEventsByTag : function( tag ){
        return eventModel
                .find( { tags : tag } )
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content','user'] )
                .then( events => {
                    return events;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getEventsByDate : function( date ){
        return eventModel
                .find( { date : date} )
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content','user'] )
                .then( events => {
                    return events;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getEventsBetweenDates : function( date1, date2 ){
        return eventModel
                .find( { date : {$gte: date1, $lt: date2} } )
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content','user'] )
                .then( events => {
                    return events;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getEventsByKeyword : function( keyword ){
        return eventModel
                .find( {$or:[{title: keyword},{tags: keyword}]} )
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content','user'] )
                .then( events => {
                    return events;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getEventsByProximity : function( lat, lng, dist ){
        return eventModel
                //.find( { lat : {$gte: (lat-dist), $lt: (lat+dist) }, lng : {$gte: (lng-dist), $lt: (lng+dist)}} )
                .find({
                    location:
                      { $near:
                         {
                           $location: { type: "Point",  coordinates: [lat, lng] },
                           $minDistance: 0,
                           $maxDistance: dist
                         }
                      }
                  })
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content','user'] )
                .then( events => {
                    return events;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    }
}

module.exports = {
    Events
};