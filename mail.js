const nodemailer = require("nodemailer");
var FS = require('fs');
const { promisify } = require('util');

const readFile = promisify(FS.readFile);
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "YTI-Alert@yokogawa.com", // generated ethereal user
            pass: "Iwan2send@lerts;", // generated ethereal password
        },
    });

    var maillist = [
        "shridhara.ramaswamy@yokogawa.com",
        "kushbu.mundra@yokogawa.com",
        "manoj.shivashankar@yokogawa.com",
        "jomon.mathew@yokogawa.com",
        "prince.jose@yokogawa.com",
        "m.krishnan@yokogawa.com",
        "renganathan.vijayasarathy@yokogawa.com",
        "harish.arumalla@yokogawa.com"
    ];

    var options = {

        from: '"YTI-Alert@yokogawa.com', // sender address
        to: maillist, // list of receivers
        subject: "ELN Automation Suite Report", // Subject line
        // text: "Hello world?", // plain text body
        html: "<head> <title>Test Suite Execution Report</title></head><P>Hi Team,<br><br> Please find the attached test execution report for <strong>ELN Automation Suite</strong><br><br>Best Regards,<br>Testing Team</P></head>",// html body
        attachments: [

            {
                filename: 'report.html',
                path: './cypress/reports/html/report.html'
            }
        ]
    }

    // send mail with defined transport object
    let info = await transporter.sendMail(options);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);