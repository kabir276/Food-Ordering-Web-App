"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const Auth_1 = require("../middleware/Auth");
const router = express_1.default.Router();
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const disconnectPrisma = async () => {
    await prisma.$disconnect();
};
const handleInternalError = (res) => {
    res.status(500).json({ error: "Internal Server Error" });
};
router.get("/", Auth_1.authenticateJwt, async (req, res) => {
    try {
        const userId = req.headers['userId'];
        const cartItems = await prisma.cart.findMany({
            where: {
                userId: parseInt(userId),
            },
            include: {
                menuItem: true,
            },
        });
        res.status(201).json(cartItems);
    }
    catch (error) {
        res.status(403).json({ error: "something went wrong with getting menu items" });
        console.error("Error fetching menu items:", error);
    }
    finally {
        await disconnectPrisma();
    }
});
router.post("/", Auth_1.authenticateJwt, async (req, res) => {
    try {
        const userId = req.headers['userId'];
        const { menuItemId, quantity } = req.body;
        if (!menuItemId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid input for adding to cart' });
        }
        const menuItem = await prisma.menuItem.findUnique({
            where: { id: menuItemId },
        });
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        const cart = await prisma.cart.create({
            data: {
                userId: parseInt(userId),
                menuItemId: menuItemId,
                quantity: quantity,
            },
        });
        res.status(201).json({ message: 'Item added to cart successfully', cartId: cart.id });
    }
    catch (error) {
        res.status(403).json({ err: `something went wrong with adding cart items ${error}` });
        console.error("Error fetching menu items:", error);
    }
    finally {
        await disconnectPrisma();
    }
});
router.put("/:id", Auth_1.authenticateJwt, async (req, res) => {
    try {
        const userId = req.headers['userId'];
        const { id } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }
        await prisma.cart.updateMany({
            where: { userId: parseInt(userId), id: Number(id) },
            data: {
                quantity: quantity
            }
        });
        res.status(201).json({ message: "cart upadted successfuly" });
    }
    catch (error) {
        res.status(403).json({ error: `something went wrong with updating cart items ${error}` });
        console.error("Error fetching menu items:", error);
    }
    finally {
        await disconnectPrisma();
    }
});
router.delete("/:id", Auth_1.authenticateJwt, async (req, res) => {
    try {
        const userId = req.headers['userId'];
        const { id } = req.params;
        // Delete the item from the cart
        await prisma.cart.deleteMany({
            where: { userId: parseInt(userId), id: Number(id) },
        });
        res.status(201).json({ message: 'Item removed from cart successfully' });
    }
    catch (error) {
        res.status(403).json({ error: `something went wrong with deleting cart items ${error}` });
        console.error("Error fetching menu items:", error);
    }
    finally {
        await disconnectPrisma();
    }
});
exports.default = router;
