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



router.get("/", async (req: Request, res: Response) => {
    try {
        const menu = await prisma.menuItem.findMany({})
        res.status(201).json({menu})
    } catch (error) {
        res.status(403).json({ err: "something went wrong with getting menu items"+error })
        
      
    } finally {
        await disconnectPrisma();
    }
})
router.get("/:id", authenticateJwt, async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const menuItem = await prisma.menuItem.findUnique({
            where: {
                id: Number(id),
            }
        })
        res.status(201).json({menuItem})
    } catch (error) {
        res.status(403).json({ err: "something went wrong with getting menu item" })
     
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
})
router.post("/addItem", authenticateJwt, async (req: Request, res: Response) => {
    try {
        
        if (req.headers['role'] !== "admin") {
            res.status(403).json({ message: 'only admins can add items' });
            return
        }
        const { item, category, price ,imageLink} = req.body
        if (!item || !price) {
            return res.status(400).json({ message: 'Item and price are required fields' });
        }
        await prisma.menuItem.create({
            data: {
                item: item,
                category: category,
                price: price,
                imageLink:imageLink
            }
        })
        res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
     
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
})
router.put("/:id", authenticateJwt, async (req: Request, res: Response) => {
    try {
       
        if (req.headers['role'] !== "admin") {
            res.status(403).json({ message: 'only admins can add items' });
            return
        }
        const { id } = req.params
        const { item, category, price } = req.body
        if (!item || !price) {
            return res.status(400).json({ message: 'Item and price are required fields' });
        }
        await prisma.menuItem.updateMany({
            where: {
                id: Number(id),
            }, data: {
                item: item,
                category: category,
                price: price
            }
        })
        res.status(201).json({ msg: "menuItem updated succesfully" })

    } catch (error) {
        
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
})
router.delete("/:id", authenticateJwt, async (req: Request, res: Response) => {
    try {
       
        if (req.headers['role'] !== "admin") {
            res.status(403).json({ message: 'only admins can add items' });
            return
        }
        const { id } = req.params

        await prisma.menuItem.delete({
            where: {
                id: Number(id),
            }
        })
        res.status(201).json({ msg: "menuItem deleted succesfully" })

    } catch (error) {
       
        handleInternalError(res);
    } finally {
        await disconnectPrisma();
    }
})

export default router;
