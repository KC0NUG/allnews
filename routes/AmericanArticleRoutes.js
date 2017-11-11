var express = require('express');
var router = express.Router();
var AmericanArticleController = require('../controllers/AmericanArticleController.js');

/*
 * GET
 */
router.get('/', AmericanArticleController.list);

/*
 * GET
 */
router.get('/:id', AmericanArticleController.show);

/*
 * POST
 */
router.post('/', AmericanArticleController.create);

/*
 * PUT
 */
router.put('/:id', AmericanArticleController.update);

/*
 * DELETE
 */
router.delete('/:id', AmericanArticleController.remove);

module.exports = router;
