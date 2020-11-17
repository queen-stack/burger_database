//import models needed
const { Comment, Pizza } = require('../models');

// create object

const commentController = {
    // add comment to pizza, return a pizza Promise
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    // -- update the array with $push method, $ sign denotes MongoDB-based function
                    { $push: { comments: _id } }, // -- push method will add comments' ID to the pizza
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // add reply method resides within the commentController, 
    // note: new replies are NOT adding, are Updating an existing Comment
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            //adding validation
            { new: true, runValidators: true }
            // { new: true }
        )
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // remove comment, remove comment & remove comment ID from its pizza 
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' });
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // remove reply with $pull operator
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err));
    }
};



module.exports = commentController;