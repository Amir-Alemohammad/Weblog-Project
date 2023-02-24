const nodeMailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const transporterDetails = smtpTransport({
    host: "http://localhost:3000",
    port: 465,
    secure: true,
    auth: {
        user: "amirho3inalemohammad@hotmail.com",
        pass: "amir13848431",
    },
    tls:{
        rejectUnauthorized: false,
    },
});

const transporter = nodeMailer.createTransport(transporterDetails);

const options = {
    from: "amirho3inalemohammad@hotmail.com",
    to:"amirho3inalemohammad@gmail.com",
    subject: "Nodemailer Test from Local Host",
    text: "Simple test from node mailer",
}
transporter.sendMail(options,(err,info)=>{
    if(err){
        return console.log(err);
    }else{
        console.log(info);
    }
});
