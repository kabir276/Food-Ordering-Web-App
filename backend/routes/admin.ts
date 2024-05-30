import express, { Response, Request, Application } from "express";
import z from "zod";
import { PrismaClient } from '@prisma/client';
import twilio from "twilio";
import dotenv from "dotenv";
import sendMail from "../utils/emaillogic";
dotenv.config();
const prisma = new PrismaClient();
const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.twiliono;
const twilioClient = twilio(accountSid, authToken);



const generateAndSendOtp = async (email: string,username:string) => {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const savedOtp = await prisma.otp.findFirst({
        where: {
            email: email,

        },
    });
    if (savedOtp) {
        prisma.otp.update({
            where: {
                email: email
            },
            data: {
                code: otp,
            }
        })
    } else {
        await prisma.otp.create({
            data: {
                email: email,
                code: otp,
            },
        });
    }
    sendMail(email, username, otp)

    

   
};

const disconnectPrisma = async () => {
    await prisma.$disconnect();
};

const handleInternalError = (res: Response) => {
    res.status(500).json({ error: "Internal Server Error" });
};

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
    try {
        const { username, email } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email: email } });
        if (existingUser) {
            throw new Error("admin with this phone number already exists");
        }

        await prisma.user.create({
            data: {
                name: username,
                email: email,
                role: "admin",
            },
        });

        await generateAndSendOtp(email,username);
        res.json({ message: 'User registered successfully' });
    } catch (e) {
        console.error(e);
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
});




export default router;
