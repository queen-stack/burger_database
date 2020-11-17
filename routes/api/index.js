const router = require('express').Router();

// index.js file will import all of the API routes, prefix their endpoint names and package them together

const commentRoutes = require('./comment-routes');
const pizzaRoutes = require('./pizza-routes');

router.use('/comments', commentRoutes);  // add prefix of `/comment` to routes created in `comment-routes.js`
router.use('/pizzas', pizzaRoutes);      // add prefix of `/pizzas` to routes created in `pizza-routes.js`


module.exports = router;