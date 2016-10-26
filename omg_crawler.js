//Import stuffs, prepare views, etc
var express = require('express');

var request = require('request');

var cheerio = require('cheerio');

var url = require('url-parse');

var bodyParser = require('body-parser');

var app = express();

app.set('views', __dirname + '/views/');

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended:true}));

var port = process.env.PORT || 8000;

app.set('port',port);

app.use(express.static(__dirname + '/public'));

//Entry point
app.get('/', function(req, res) {
	res.render('index');

});

var hashmap = {};

app.post('/crawl', function(req, res){
	var url = req.body.url;
	
	//Check if given url is valid
	request(url, function(error, response, html){

		if(error) {
			console.log(error);	
}
		console.log("Status code: "+response.statusCode);
		if(response.statusCode == 200){
			//Load web content
			var $ = cheerio.load(html);

			//Create array to store discovered content
			var anchors = [];
			var images = [];
			var scripts = [];
			var links = [];
			
			
			//Get anchor
			$('a').each(function(i, elem) {
				console.log($(this).attr('href'));
				anchors[i] = $(this).attr('href');
				hashmap["a "+anchors[i]] = 1;
});
			//Get images
			$('img').each(function(i, elem) {
				console.log($(this).attr('src'));
				images[i] = $(this).attr('src');
				hashmap["i "+images[i]] = 1;
});

			//Get scripts
			$('script').each(function(i, elem) {
				console.log($(this).attr('src'));
				scripts[i] = $(this).attr('src');
				hashmap["s "+scripts[i]] = 1;
});

			//Get links
			$('link').each(function(i, elem) {
				console.log($(this).attr('href'));
				links[i] = $(this).attr('href');
				hashmap["l "+links[i]] = 1;
});
			var text ='';

			for(x in anchors){
				text += 'Anchor: ' + anchors[x] + '<br>';
}
			for(x in images){
				text += 'Image: ' + images[x] + '<br>';
}	
			for(x in scripts){
				text += 'Script: ' + scripts[x] + '<br>';
}	
			for(x in links){
				text += 'Link: ' + links[x] + '<br>';
}
			text += "Hashmap of entire sites: " + hashmap;
			res.send(text);		
}
});

});

app.listen(app.get('port'), function() {
	console.log("Starting web service");
});


