var ping = require('ping');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');
 
// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '{Gmail Account goes here}',
        pass: '{Password goes here}'
    }
});

var hosts = ['api.plattekloof.co', 
			 'kzone.plattekloof.co', 
			 'wildfire.plattekloof.co', 
			 'plattekloof.co'];

var rule = new schedule.RecurrenceRule();
rule.hour = 00;
rule.minute = 00;

var j = schedule.scheduleJob(rule, function(){
	var content = '';
    hosts.forEach(function(host){
	    ping.sys.probe(host, function(isAlive){
	        var msg = isAlive ? 'host ' + host + ' is alive; \n' : 'host ' + host + ' is dead; \n';
	        content += msg;
	        console.log(msg);
	    });
	});

	setTimeout(function(){ 
		var mailOptions = {
		    from: 'me <example@gmail.com>', // sender address 
		    to: 'example@example.com', // list of receivers 
		    subject: 'Service Status', // Subject line 
		    text: content // plaintext body 
		};
		// send mail with defined transport object 
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log(error);
		    }else{
		        console.log('Message sent: ' + info.response);
		    }
		});

	}, 9000);
});

console.log("node app monitor is running");
