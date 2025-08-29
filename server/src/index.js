import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import churchRoutes from './routes/church.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/igrejas_app';
const PORT = Number(process.env.PORT || 4000);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
  });

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/church', churchRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => console.log(`Server listening on :${PORT}`));

