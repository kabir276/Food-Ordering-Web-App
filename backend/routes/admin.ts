import express, { Response, Request, Application } from "express";
import z from "zod";
import { PrismaClient } from '@prisma/client';
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();
const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.twiliono;
const twilioClient = twilio(accountSid, authToken);



const generateAndSendOtp = async (phoneNumber: number) => {
    const otp = Math.floor(100000 + Math.random() * 900000);

    await prisma.otp.create({
        data: {
            phonenumber: phoneNumber,
            code: otp,
        },
    });

    const twilioResponse = await twilioClient.messages.create({
        body: `Your signin OTP is: ${otp}`,
        to: `+91 ${phoneNumber}`,
        from: twilioNumber,
    });

    if (twilioResponse.errorCode) {
        console.error(`Twilio error: ${twilioResponse.errorMessage}`);
        throw new Error("Twilio error");
    }
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
        const { username, phoneNumber } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { phonenumber: phoneNumber } });
        if (existingUser) {
            throw new Error("admin with this phone number already exists");
        }

        await prisma.user.create({
            data: {
                name: username,
                phonenumber: phoneNumber,
                role: "admin",
            },
        });

        await generateAndSendOtp(phoneNumber);
        res.json({ message: 'User registered successfully' });
    } catch (e) {
        console.error(e);
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
});




export default router;
