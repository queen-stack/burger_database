// add  Types object to import ObjectID() value from the _id field
const { Schema, model, Types } = require('mongoose');
// import Moment.js to format the date
const moment = require('moment');

// adding replies to Comment.js, + adding ObjectID() 
const ReplySchema = new Schema(
      {
       // add a new customized id, different from its parent comment _id
        replyId: {
          type: Schema.Types.ObjectId,
          default: () => new Types.ObjectId()
        },
        replyBody: {
          type: String,
          required: true,
          trim: true
        },
        writtenBy: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now,
          // added getters so date is formatted with Moment method
          get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        }
      },
      {
        toJSON: {
          // virtuals: true,   
          getters: true     // moment.js date formatting set to true
        }
      }
    );



const CommentSchema = new Schema(
      {
        writtenBy: {
          type: String
        },
        commentBody: {
          type: String
        },
        createdAt: {
          type: Date,
          default: Date.now,
           // add getters to format the date through a Moment method
          get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        },
        // associate replies to comment to have fields populated by an array, validate data for a reply
        replies: [ReplySchema]
      },
      {
        toJSON: {
          virtuals: true, // (2) virtual set to true
          getters: true
        },
        id: false
      }
    );

// (1) virtual definition to add reply count
CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;
