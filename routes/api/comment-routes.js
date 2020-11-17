// import methods from comment-controller file
const router = require('express').Router();
// const { addComment, removeComment } = require('../../controllers/comment-controller');

// import methods from the comments controller
const {
    addComment,
    removeComment,
    addReply,
    removeReply
} = require('../../controllers/comment-controller');

// ---------------- routes ----------------

//      POST /api/comments/<pizzaId>
router
    .route('/:pizzaId').post(addComment);

//      GET for comment by ID
//      PUT for reply /api/comments/<pizzaId>/<commentId>  
//      DELETE for comment
router
    .route('/:pizzaId/:commentId')        // comment routes
    .put(addReply)                        // reply routes, which are within the comment controller
    .delete(removeComment)                // delete comment

//      DELETE route for Reply /api/comments/<pizzaId>/<commentId>/<replyID>    
router
    .route('/:pizzaId/:commentId/:replyId').delete(removeReply);

//export 
module.exports = router;