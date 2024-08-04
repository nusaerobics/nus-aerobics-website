import { NextResponse } from "next/server";

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// var Mailgen = require('mailgen');
// var mailGenerator = new Mailgen({
//   theme: "default",
//   product: {
//     name: "NUS Aerobics",
//     link: "https://aerobics.nussportsclub.org",
//   },
// });

export async function POST(request) {
  try {
    const body = await request.json();
    const { user, type, details } = body;
    // TODO: Fix mailgen - Currently facing "invalid theme" error
    // var email = {
    //   body: {
    //     name: user.name,
    //     intro: "We received a request to reset your password on NUS Aerobics.",
    //     action: [
    //       {
    //         instructions:
    //           "Login with your temporary password and reset your password in the Profile page.",
    //       },
    //       {
    //         instructions: `Temporary password: ${details.tempPassword}`,
    //         button: {
    //           color: "#1F4776",
    //           text: "Login",
    //           link: "https://aerobics.nussportsclub.org/login",
    //         },
    //       },
    //     ],
    //   },
    // };
    // var emailHTML = mailGenerator.generate(email);
    // var emailText = mailGenerator.generatePlaintext(email);

    let emailHTML;
    let subject;
    if (type == "forgot") {
      subject = "Forgot your password?";
      emailHTML = `
      Hi ${user.name}!
      <br>We received a request to reset your password on NUS Aerobics.
      <br>
      <br>Login with your temporary password and reset your password in the Profile page.
      <br><strong>Temporary password:</strong> ${details.tempPassword}
      <br>
      <br>If you have any questions or problems, please let us know.
      <br>Kindest regards,
      <br>NUS Aerobics`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: subject,
      html: emailHTML,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info.response);
      }
    });
    return NextResponse.json("Email sent successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
