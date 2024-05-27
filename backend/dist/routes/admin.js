"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
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
    }
    catch (e) {
        console.error(e);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
exports.default = router;
