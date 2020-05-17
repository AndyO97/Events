const mongoose = require( 'mongoose' );

const commentSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : true
    },
    event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'events',
        required : true
    },
    date : {
        type : Date,
        required : true
   }
});

const commentModel = mongoose.model( 'comments', commentSchema );

const Comments = {
    addComment : function( newComment ){
        return commentModel
                .create( newComment )
                .then( comment => {
                    return comment;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getAllComments : function(){
        return commentModel
                .find()
                .populate('user', ['username', 'email','firstName', 'lastName'] )
                .then( comments => {
                    return comments;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getCommentsByUserId : function( id ){
        return commentModel
                .find( { user : id } )
                .populate( 'user', ['username', 'email','firstName', 'lastName'] )
                .then( comments => {
                    return comments;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
}

module.exports = {
    Comments
};