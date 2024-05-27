import express, { Response, Request, Application } from "express";
import z, { number } from "zod";
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
import menuRouter from "./menu";
import { authenticateJwt } from "../middleware/Auth";

const app: Application = express();
app.use("/menu", menuRouter)
dotenv.config();
const router = express.Router()
const prisma = new PrismaClient();
const disconnectPrisma = async () => {
    await prisma.$disconnect();
};

const handleInternalError = (res: Response) => {
    res.status(500).json({ error: "Internal Server Error" });
};





router.post("/", authenticateJwt, async (req: Request, res, Response) => {
    try {
        const userId = req.headers['userId'];
        const { street, housenumber, postalcode, city } = req.body
        await prisma.address.create({
            data: {
                userId: parseInt(userId as string),
                street,
                housenumber,
                city,
                postalcode,
                country: "india"

            }

        })
        res.status(201).json({ message: "address added successfully" })
    }
    catch (error) {
        console.error("Error adding address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma()
    }
})
router.get("/", authenticateJwt, async (req: Request, res, Response) => {
    try {
        const userId = req.headers['userId'];

        const address = await prisma.address.findMany({
            where: { userId: parseInt(userId as string) }
        })
        res.status(201).send(address)
    }
    catch (error) {
        console.error("Error getting user address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma()
    }
})
router.get("/:id", authenticateJwt, async (req: Request, res, Response) => {
    try {
        const userId = req.headers['userId'];
        const { id } = req.params
        const address = await prisma.address.findUnique({
            where: { id: Number(id), userId: parseInt(userId as string) }
        })
        res.status(201).send(address)
    }
    catch (error) {
        console.error("Error getting user address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma()
    }
})
router.put("/:id", authenticateJwt, async (req: Request, res, Response) => {
    try {
        const userId = req.headers['userId'];
        const { street, housenumber, postalcode, city } = req.body
        const { id } = req.params
        await prisma.address.update({
            where: { id: Number(id), userId: parseInt(userId as string) },
            data: {
                street,
                housenumber,
                postalcode,
                city
            }
        })
        res.status(201).json({ message: "address updated " })
    }
    catch (error) {
        console.error("Error getting user address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma()
    }
})
router.delete("/:id", authenticateJwt, async (req: Request, res, Response) => {
    try {
        const userId = req.headers['userId'];
        const { id } = req.params
        const address = await prisma.address.delete({
            where: { id: Number(id), userId: parseInt(userId as string) }
        })
        res.status(201).json({ message: "address deleted " })
    }
    catch (error) {
        console.error("Error getting user address:", error);
        handleInternalError(res);
    }
    finally {
        await disconnectPrisma()
    }
})
export default router;