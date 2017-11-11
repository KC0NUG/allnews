var AmericanArticleModel = require('../models/AmericanArticleModel.js');

/**
 * AmericanArticleController.js
 *
 * @description :: Server-side logic for managing AmericanArticles.
 */
module.exports = {

    /**
     * AmericanArticleController.list()
     */
    list: function (req, res) {
        AmericanArticleModel.find(function (err, AmericanArticles) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting AmericanArticle.',
                    error: err
                });
            }
            return res.json(AmericanArticles);
        });
    },

    /**
     * AmericanArticleController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        AmericanArticleModel.findOne({_id: id}, function (err, AmericanArticle) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting AmericanArticle.',
                    error: err
                });
            }
            if (!AmericanArticle) {
                return res.status(404).json({
                    message: 'No such AmericanArticle'
                });
            }
            return res.json(AmericanArticle);
        });
    },

    /**
     * AmericanArticleController.create()
     */
    create: function (req, res) {
        var AmericanArticle = new AmericanArticleModel({
			author : req.body.author,
			summary : req.body.summary,
			excerpt : req.body.excerpt,
			url : req.body.url,
			urlmore : req.body.urlmore

        });

        AmericanArticle.save(function (err, AmericanArticle) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating AmericanArticle',
                    error: err
                });
            }
            return res.status(201).json(AmericanArticle);
        });
    },

    /**
     * AmericanArticleController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        AmericanArticleModel.findOne({_id: id}, function (err, AmericanArticle) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting AmericanArticle',
                    error: err
                });
            }
            if (!AmericanArticle) {
                return res.status(404).json({
                    message: 'No such AmericanArticle'
                });
            }           
            AmericanArticle.author = req.body.author ? req.body.author : AmericanArticle.author;
			AmericanArticle.summary = req.body.summary ? req.body.summary : AmericanArticle.summary;
			AmericanArticle.excerpt = req.body.excerpt ? req.body.excerpt : AmericanArticle.excerpt;
			AmericanArticle.url = req.body.url ? req.body.url : AmericanArticle.url;
			AmericanArticle.urlmore = req.body.urlmore ? req.body.urlmore : AmericanArticle.urlmore;
			
            AmericanArticle.save(function (err, AmericanArticle) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating AmericanArticle.',
                        error: err
                    });
                }

                return res.json(AmericanArticle);
            });
        });
    },

    /**
     * AmericanArticleController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        AmericanArticleModel.findByIdAndRemove(id, function (err, AmericanArticle) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the AmericanArticle.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
