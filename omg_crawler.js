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

app.get('/', function(req, res) {
	res.render('index');

});

app.post('/crawl', function(req, res){
	var url = req.body.url;
	//res.send(url);
	request(url, function(error, response, html){

		if(error) {
			console.log(error);	
}
		console.log("Status code: "+response.statusCode);
		if(response.statusCode == 200){
			var $ = cheerio.load(html);
			var links = [];
			$('a').each(function(i, elem) {
				console.log($(this).attr('href'));
				links[i] = $(this).attr('href');
});
			var text ='';
			for(x in links){
				text += links[x] + '<br>';
}
			res.send(text);		
}
});

});

app.listen(app.get('port'), function() {
	console.log("Starting web service");
});


