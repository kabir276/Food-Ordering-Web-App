"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const menu_1 = __importDefault(require("./menu"));
const Auth_1 = require("../middleware/Auth");
const app = (0, express_1.default)();
app.use("/menu", menu_1.default);
dotenv_1.default.config();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const disconnectPrisma = async () => {
    await prisma.$disconnect();
};
const handleInternalError = (res) => {
    res.status(500).json({ error: "Internal Server Error" });
};
router.post("/", Auth_1.authenticateJwt, async (req, res, Response) => {
    try {
        const userId = req.headers['userId'];
        const { street, housenumber, postalcode, city } = req.body;
        await prisma.address.create({
            data: {
                userId: parseInt(userId),
                street,
                housenumber,
                city,
                postalcode,
                country: "india"
            }
        });
        res.status(201).json({ message: "address added successfully" });
    }
    catch (error) {
        console.error("Error adding address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
router.get("/", Auth_1.authenticateJwt, async (req, res, Response) => {
    try {
        const userId = req.headers['userId'];
        const address = await prisma.address.findMany({
            where: { userId: parseInt(userId) }
        });
        res.status(201).send(address);
    }
    catch (error) {
        console.error("Error getting user address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
router.get("/:id", Auth_1.authenticateJwt, async (req, res, Response) => {
    try {
        const userId = req.headers['userId'];
        const { id } = req.params;
        const address = await prisma.address.findUnique({
            where: { id: Number(id), userId: parseInt(userId) }
        });
        res.status(201).send(address);
    }
    catch (error) {
        console.error("Error getting user address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
router.put("/:id", Auth_1.authenticateJwt, async (req, res, Response) => {
    try {
        const userId = req.headers['userId'];
        const { street, housenumber, postalcode, city } = req.body;
        const { id } = req.params;
        await prisma.address.update({
            where: { id: Number(id), userId: parseInt(userId) },
            data: {
                street,
                housenumber,
                postalcode,
                city
            }
        });
        res.status(201).json({ message: "address updated " });
    }
    catch (error) {
        console.error("Error getting user address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
router.delete("/:id", Auth_1.authenticateJwt, async (req, res, Response) => {
    try {
        const userId = req.headers['userId'];
        const { id } = req.params;
        const address = await prisma.address.delete({
            where: { id: Number(id), userId: parseInt(userId) }
        });
        res.status(201).json({ message: "address deleted " });
    }
    catch (error) {
        console.error("Error getting user address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma();
    }
});
exports.default = router;
