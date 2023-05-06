import express from 'express';
import { Request } from 'express';
import cors from 'cors';

import pingRouter from './controllers/ping';
import diagnosesRouter from './controllers/diagnoses';
import patientsRouter from './controllers/patients';

const app = express();
app.use(express.json());
app.use(cors<Request>());

const PORT = 3001;

app.use('/api/ping', pingRouter);
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);



app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`);
});