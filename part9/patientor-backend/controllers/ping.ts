import { Router } from 'express';

const pingRouter = Router();

pingRouter.get('/', (_req, res) => {
    res.send('pong');
});

export default pingRouter;