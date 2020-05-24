const mongoose = require( 'mongoose' );

const eventSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
        unique : true
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
    private : {
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
        ref : 'users'
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
                //.populate('creator', ['username', 'email','firstName', 'lastName'] )
                //.populate('participants', ['username', 'email','firstName', 'lastName'] )
                //.populate('comments', ['title', 'content','user'] )
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
    getEventsById : function( id ){
        return eventModel
                .findOne( { _id : id } )
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
    getEventsByTitle : function( title ){
        return eventModel
                .find( { title : title } )
                .populate('creator', ['username', 'email','firstName', 'lastName'] )
                .populate('participants', ['username', 'email','firstName', 'lastName'] )
                .populate('comments', ['title', 'content','user','date'] )
                //.populate('user', ['username'] )
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
        lat = Number(lat);
        lng = Number(lng);
        dist = Number(dist)/111; //an aprox number
        let coordinates1 = [lat+dist, lng+dist];
        let coordinates2 = [lat, lng+dist];
        let coordinates3 = [lat+dist, lng];
        let coordinates4 = [lat-dist, lng-dist];

        return eventModel
                //.find( { 'location.coordinates[0]' : {$gte: (lat-dist), $lt: (lat+dist) }, 'location.coordinates[1]' : {$gte: (lng-dist), $lt: (lng+dist)}} )
                //.find( { 'location.coordinates[0]' : lat, 'location.coordinates[1]' : long} )
                .find( { "location.coordinates" : {$lt: coordinates1, $lt: coordinates2, $lt: coordinates3, $gte: coordinates4} })
                
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
    deleteEventByTitle : function(title){
        return eventModel
            .findOneAndDelete({title : title})
            .then( event => {
                return event;
            })
            .catch( err => {
                return err;
            });
    },
    deleteEventByTitleAndCreatorId : function(title, id){
        return eventModel
            .findOneAndDelete({title : title, creator:id })
            //.populate('creator', ['username', 'email','firstName', 'lastName'] )
            //.populate('participants', ['username', 'email','firstName', 'lastName'] )
            //.populate('comments', ['title', 'content','user'] )
            .then( event => {
                return event;
            })
            .catch( err => {
                return err;
            });
    },
    deleteEventById : function(id){
        return eventModel
            .findOneAndDelete({_id : id})
            .then( event => {
                return event;
            })
            .catch( err => {
                return err;
            });
    },
    deleteEventByCreatorId : function(id){
        return eventModel
            .deleteMany({creator : id})
            .then( event => {
                return event;
            })
            .catch( err => {
                return err;
            });
    },
    updateEventByTitle : function(title){
        return eventModel
            .findOne({title : title})
            .then( event => {
                return event;
            })
            .catch( err => {
                return err;
            });
    },
    updateEventById : function(id){
        return eventModel
            .findOne({_id : id})
            .then( event => {
                return event;
            })
            .catch( err => {
                return err;
            });
    }
}

module.exports = {
    Events
};