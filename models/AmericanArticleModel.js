var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AmericanArticleSchema = new Schema({	
	'author' : String,
	'summary' : String,
	'excerpt' : String,
	'url' : { 
		type: String,
		unique: true,
		index: true
	},
	'urlmore' : String,
	// `note` is an object that stores a Note id
	// The ref property links the ObjectId to the Note model
	// This allows us to populate the Article with an associated Note
	note: {
		type: Schema.Types.ObjectId,
	    ref: "Note"
	}
});

module.exports = mongoose.model('AmericanArticle', AmericanArticleSchema);
