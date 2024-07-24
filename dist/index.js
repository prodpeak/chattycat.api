"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
// @ts-ignore
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const telegramToken = '7317707626:AAFeGcA5u1gtLb4QzZr6wdnrTumob9tAG1o';
const createServer = () => {
    const app = (0, express_1.default)();
    const port = 8080;
    const prisma = new client_1.PrismaClient();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.get('/', (req, res) => {
        res.send('Hello Chatty Cats!');
    });
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 1 * 60 * 1000,
        limit: 10,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests, please try again later.',
    });
    app.get('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const chat = yield prisma
            .chat
            .findFirst({
            orderBy: {
                id: 'desc'
            }
        });
        // @ts-ignore
        res.json({ text: chat.text });
        console.log(chat);
    }));
    app.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { text } = req.body;
        console.log(text);
        if (!text || text.trim() === '') {
            res.status(400).json({ message: 'Bad cat' });
        }
        // Save the chat message to the database
        const chat = yield prisma
            .chat
            .create({ data: { text } });
        console.log(chat);
        // Send a response back to the client
        res.status(200);
    }));
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
};
createServer();
