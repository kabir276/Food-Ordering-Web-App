import express, { Response, Request } from "express";
import z, { any, number } from "zod";
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




router.post("/", authenticateJwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers['userId'];

        const cartItems = await prisma.cart.findMany({
            where: { userId: parseInt(userId as string) },
            include: {
                menuItem: true,
            },
        });

        const address = await prisma.address.findUnique({
            where: { id: parseInt(req.body.addressId) },

        })
        const shippingAddress = `${address?.street}, ${address?.housenumber}, ${address?.postalcode}, ${address?.city}`
        const totalPrice = cartItems.reduce((acc:number, item:any) => acc + item.menuItem.price * item.quantity, 0);
        //@ts-ignore
        const productNames: string = cartItems.map(item => item.menuItem.item).join(", ")
        // Create an order
        const newOrder = await prisma.order.create({
            data: {
                userId: parseInt(userId as string),
                status: "Pending",
                totalAmount: totalPrice,
                shippingAddress: shippingAddress,
                productName: productNames
            },
        });

        // Clear the cart
        await prisma.cart.deleteMany({ where: { userId: parseInt(userId as string) } });
        res.status(201).json({ message: 'Order placed successfully', orderId: newOrder.id });
    } catch (error) {
        console.error("Error placing order:", error);
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
});


router.get("/", authenticateJwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers['userId'];
        const orders = await prisma.order.findMany({
            where: { userId: parseInt(userId as string) }

        });
        res.status(201).send(orders);
    } catch (error) {
        console.error("Error placing order:", error);
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
});


router.get("/:id", authenticateJwt, async (req: Request, res: Response) => {
    try {
        const userId = req.headers['userId'];
        const { id } = req.params
        const order = await prisma.order.findMany({
            where: { id: Number(id), userId: parseInt(userId as string) }
        });
        res.status(201).json({orderDetails:order});
    } catch (error) {
        res.status(404).json({ msg: "order with this id not found" })
        console.error("order not found", error);
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
});


router.put("/changeStatus/:id", authenticateJwt, async (req: Request, res: Response) => {
    try {
        if (req.headers['role'] !== "admin") {
            res.status(403).json({ message: 'only admins can confirm the order' });
            return;
        }

        const userId = req.headers['userId'];
        const { id } = req.params;
        const { status } = req.body;

        await prisma.order.update({
            where: { id: Number(id), userId: parseInt(userId as string) },
            data: {
                status: status
            }
        });

        res.status(201).json({ msg: "the food is being prepared" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Invalid input data', errors: error.errors });
        } else {
            res.status(404).json({ msg: "order with this id not found" });
            console.error("order not found", error);
            handleInternalError(res);
        }
    } finally {
        await disconnectPrisma();
    }
});


export default router;
