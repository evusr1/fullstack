import express from 'express';
import { Request, Router } from 'express';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors<Request>());

const PORT = 3001;

const pingRouter = Router();

pingRouter.get('/', (_req, res) => {
    res.send('pong');
});

app.use('/api/ping', pingRouter);

app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`);
});