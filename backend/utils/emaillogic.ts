import  nodemailer from 'nodemailer';
import Mailgen from 'mailgen'

let nodeConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD,
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})
const sendMail = async (userEmail:string,username:string,otp:number) => {
   

    var email = {
        body : {
            name: username,
            intro : `This the otp for your rollup signup ${otp}`,
            outro: 'thanks!'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from : process.env.EMAIL,
        to: userEmail,
        subject : "Signup OTP for rollupntritions ",
        html : emailBody
    }

    
    transporter.sendMail(message)
        .then(() => {
           return {message:"email sent successfully"}
        })
        .catch((error)=>{return error ||"something went wrong with sending mail"})

}
export default sendMail