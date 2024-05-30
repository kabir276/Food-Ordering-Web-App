import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure:false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    }
});


const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
});

const sendMail = async (email:string, username:string, otp:number) => {
   
    const emailTemplate = {
        body: {
            name: username,
            intro: `This is the OTP for your Rollup signup: ${otp}`,
            outro: 'Thanks!'
        }
    };

    const emailBody = MailGenerator.generate(emailTemplate);

    const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Signup OTP for Rollup Nutritions",
        html: emailBody
    };
    try {
         await transporter.sendMail(message);
        
        return { message: "Email sent successfully" };
    } catch (error) {
        console.error(`Error sending email: ${error}`);
        return { error: "Something went wrong with sending the email" };
    }
};

export default sendMail;
