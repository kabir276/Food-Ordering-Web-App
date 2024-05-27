import express, { Response, Request } from "express";
import z from "zod";
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import { authenticateJwt } from "../middleware/Auth";
const router = express.Router();
dotenv.config();
const prisma = new PrismaClient();
const disconnectPrisma = async () => {
    await prisma.$disconnect();
};

const handleInternalError = (res: Response) => {
    res.status(500).json({ error: "Internal Server Error" });
};


router.get("/", authenticateJwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers['userId'];
        const cartItems = await prisma.cart.findMany({
            where: {
                userId: parseInt(userId as string),
            },
            include: {
                menuItem: true,
            },
        });

        res.status(201).json(cartItems);
    }
    catch (error) {
        res.status(403).json({ error: "something went wrong with getting menu items" })
        console.error("Error fetching menu items:", error);
    } finally {
        await disconnectPrisma();
    }

})
router.post("/", authenticateJwt, async (req: Request, res: Response) => {
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
        const cart =await prisma.cart.create({
            data: {
                userId: parseInt(userId as string),
                menuItemId: menuItemId,
                quantity: quantity,
            },
        });

        res.status(201).json({ message: 'Item added to cart successfully' , cartId:cart.id});
    }
    catch (error) {
        res.status(403).json({ err: `something went wrong with adding cart items ${error}`})
        console.error("Error fetching menu items:", error);
        
    } finally {
        await disconnectPrisma();
    }

})
router.put("/:id", authenticateJwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers['userId'];
        const { id } = req.params;
        const { quantity } =req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }
        await prisma.cart.updateMany({
            where: { userId: parseInt(userId as string), id: Number(id) },
            data: {
                quantity: quantity
            }

        });
        res.status(201).json({ message: "cart upadted successfuly" })

    }
    catch (error) {
        res.status(403).json({ error: `something went wrong with updating cart items ${error}` })
        console.error("Error fetching menu items:", error);
    } finally {
        await disconnectPrisma();
    }

})
router.delete("/:id", authenticateJwt, async (req: Request, res: Response) => {
    try {

        const userId = req.headers['userId'];
        const { id } = req.params;

        // Delete the item from the cart
        await prisma.cart.deleteMany({
            where: { userId: parseInt(userId as string), id: Number(id) },
        });

        res.status(201).json({ message: 'Item removed from cart successfully' });

    }
    catch (error) {
        res.status(403).json({ error: `something went wrong with deleting cart items ${error}` })
        console.error("Error fetching menu items:", error);
        
    } finally {
        await disconnectPrisma();
    }

})
export default router;
