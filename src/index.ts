import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
// @ts-ignore
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const telegramToken = '7317707626:AAFeGcA5u1gtLb4QzZr6wdnrTumob9tAG1o';

const createServer = () => {
  const app = express();
  const port = 8080;
  const prisma: PrismaClient = new PrismaClient();

  app.use(cors());

  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello Chatty Cats!');
  });

  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
  });

  app.get('/chat', async (req: Request, res: Response) => {
    const chat = await prisma
      .chat
      .findFirst({
        orderBy: {
          id: 'desc'
        }
      });

    // @ts-ignore
    res.json({text: chat.text});

    console.log(chat);
  })

  app.post('/chat', async (req: Request, res: Response) => {
    const { text } = req.body;
    console.log(text);

    if (!text || (text as string).trim() === '') {
      res.status(400).json({message: 'Bad cat'});
    }

    // Save the chat message to the database
    const chat = await prisma
      .chat
      .create({data: {text}});
    console.log(chat);

    // Send a response back to the client
    res.status(200);
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

createServer();