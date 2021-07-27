const data = require('./data');
const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodeMailer.createTransport(smtpTransport({
    service: "gmail",
    host: 'stmp.gmail.com',
    auth: {
        user: data.EMAIL,
        pass: data.PASS
    }
}));
exports.sendEmail = (email, subject, html) => {
    var opts = {
        from: data.EMAIL,
        to: email,
        subject,
        html
    }
    transporter.sendMail(opts, (err, info) => {
        if(err) {
            console.log('ERROR MAILING! ' + err);
        } else {
            console.log('Email is sent to ' + email);
        }
    });

}