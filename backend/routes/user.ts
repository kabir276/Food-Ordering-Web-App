import express, { Response, Request, Application } from "express";
import z from "zod";
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";
import menuRouter from "./menu";
import { authenticateJwt } from "../middleware/Auth";
import sendMail from "../utils/emaillogic";

const app: Application = express();
app.use("/menu", menuRouter)
dotenv.config();
const prisma = new PrismaClient();

const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.twiliono;
const twilioClient = twilio(accountSid, authToken);



const generateAndSendOtp = async (email: string, username: string) => {
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
            throw new Error("User with this phone number already exists");
        }


        await prisma.user.create({
            data: {
                name: username,
                email: email,
                role: "user",
            },
        });

        await generateAndSendOtp(email, username);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (e) {
       
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
});

router.post("/signin", async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const savedOtp = await prisma.otp.findFirst({
            where: {
                email: email,

            },
        });
        if (savedOtp) {
            await prisma.otp.delete({
                where: {
                    id: savedOtp.id,
                },
            });
        }
       
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            throw new Error("No user Found, please sign up");
        }

        await generateAndSendOtp(email, user.name);
        res.status(201).json({ message: 'OTP sent successfully' });
    } catch (e) {
       
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
});
router.put("/resnd-otp", async (req: Request, res: Response) => {
    try {

        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            throw new Error("No user Found, please sign up");
        }
        const Otpsent = await generateAndSendOtp(email, user.name)
        return Otpsent

    } catch (e) {

        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
})
router.post("/verify-otp", async (req: Request, res: Response) => {
    try {

     
        const { email, otp } = req.body;
       
        const savedOtp = await prisma.otp.findFirst({
            where: {
                email: email,
                code: otp,
            },
        });

        if (savedOtp) {
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            const token = jwt.sign(
                { id: user?.id, role: user?.role },
                process.env.SECRET as string,
                { expiresIn: '24h' }
            );

            await prisma.otp.delete({
                where: {
                    id: savedOtp.id,
                },
            });

            res.status(201).json({ message: 'Signin successful', token });
        } else {
            res.status(401).json({ error: "Invalid OTP" });
        }
    } catch (e) {
       
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
});

router.get("/", authenticateJwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers['userId'];
        const userdetails = await prisma.user.findMany({
            where: {
                id: parseInt(userId as string),
            },
            include: {
                orders: true,
                addresses: true,
                cart: true
            },
        });

        res.status(201).json(userdetails);
    }
    catch (error) {
        res.status(403).json({ err: "something went wrong with getting menu items" })
       
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }

})

export default router;
