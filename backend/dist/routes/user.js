"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
const menu_1 = __importDefault(require("./menu"));
const Auth_1 = require("../middleware/Auth");
const app = (0, express_1.default)();
app.use("/menu", menu_1.default);
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.twiliono;
const twilioClient = (0, twilio_1.default)(accountSid, authToken);
const generateAndSendOtp = async (phoneNumber) => {
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
const handleInternalError = (res) => {
    res.status(500).json({ error: "Internal Server Error" });
};
const router = express_1.default.Router();
router.post("/signup", async (req, res) => {
    try {
        const { username, phoneNumber } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { phonenumber: phoneNumber } });
        if (existingUser) {
            throw new Error("User with this phone number already exists");
        }
        await prisma.user.create({
            data: {
                name: username,
                phonenumber: phoneNumber,
                role: "user",
            },
        });
        await generateAndSendOtp(phoneNumber);
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (e) {
        console.error(e);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
router.post("/signin", async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const savedOtp = await prisma.otp.findFirst({
            where: {
                phonenumber: phoneNumber,
            },
        });
        if (savedOtp) {
            await prisma.otp.delete({
                where: {
                    id: savedOtp.id,
                },
            });
        }
        console.log(phoneNumber);
        const user = await prisma.user.findUnique({ where: { phonenumber: phoneNumber } });
        if (!user) {
            throw new Error("No user Found, please sign up");
        }
        await generateAndSendOtp(phoneNumber);
        res.status(201).json({ message: 'OTP sent successfully' });
    }
    catch (e) {
        console.error(e);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
router.put("/resnd-otp", async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        prisma.otp.update({
            where: {
                phonenumber: phoneNumber
            },
            data: {
                code: otp,
            }
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
        res.status(201).json({ msg: "otp sent success" });
    }
    catch (e) {
        console.error(e);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
router.post("/verify-otp", async (req, res) => {
    try {
        console.log(req.body);
        const { phoneNumber, otp } = req.body;
        console.log(phoneNumber, otp);
        const savedOtp = await prisma.otp.findFirst({
            where: {
                phonenumber: phoneNumber,
                code: otp,
            },
        });
        if (savedOtp) {
            const user = await prisma.user.findUnique({
                where: {
                    phonenumber: phoneNumber,
                },
            });
            const token = jsonwebtoken_1.default.sign({ id: user?.id, role: user?.role }, process.env.SECRET, { expiresIn: '24h' });
            await prisma.otp.delete({
                where: {
                    id: savedOtp.id,
                },
            });
            res.status(201).json({ message: 'Signin successful', token });
        }
        else {
            res.status(401).json({ error: "Invalid OTP" });
        }
    }
    catch (e) {
        console.error(e);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
router.get("/", Auth_1.authenticateJwt, async (req, res) => {
    try {
        const userId = req.headers['userId'];
        const userdetails = await prisma.user.findMany({
            where: {
                id: parseInt(userId),
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
        res.status(403).json({ err: "something went wrong with getting menu items" });
        console.error("Error fetching menu items:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
exports.default = router;
