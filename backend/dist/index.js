"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const cart_1 = __importDefault(require("./routes/cart"));
const orders_1 = __importDefault(require("./routes/orders"));
const address_1 = __importDefault(require("./routes/address"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const menu_1 = __importDefault(require("./routes/menu"));
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/admin", admin_1.default);
app.use("/user", user_1.default);
app.use("/user/menu", menu_1.default);
app.use("/user/cart", cart_1.default);
app.use("/user/order", orders_1.default);
app.use("/user/address", address_1.default);
app.get("/", (req, res) => res.json({ msg: "hello" }));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
