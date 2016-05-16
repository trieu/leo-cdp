var nodemailer = require("nodemailer");
var config = require('../configs/config'),
	mailer;

mailer = function(opts, fn){
	var mailOpts, smtpTransport;

	// nodemailer configuration
	try {
        smtpTransport = nodemailer.createTransport("SMTP",
		{
		   service: "Gmail",  // sets automatically host, port and connection security settings
		   auth: {
		       user: config.email,
		       pass: config.password
		   }
		});
    }
    catch (err) {
        fn('Nodemailer could not create Transport', '');
        return;
    }
	
	// mailing options
    mailOpts = {
        from: opts.from,
        replyTo: opts.from,
        to: opts.to,
        subject: opts.subject,
        html: opts.body
    };
    // Send mail

    try {
        smtpTransport.sendMail(mailOpts, function (error, response) {
            //if sending fails
            if (error) {
            fn(true, error);
            }
            //Yay!! message sent
            else {
                fn(false, response.message);
            }
        });
    }
    catch (err) {
        fn('Nodemailer could not send Mail', '');
    }

};

module.exports = mailer;