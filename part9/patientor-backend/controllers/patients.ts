/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Router } from 'express';
import  patientsServices from '../services/patientsService';
import { toNewPatientEntry } from '../utils';
const patientsRouter = Router();

patientsRouter.get('/', (_req, res) => {
    res.send(patientsServices.getNonsensitivePatientEntries());
});

patientsRouter.post('/', (req, res) => {
    try {
        const newPatientEntry = toNewPatientEntry(req.body);
        const addedEntry = patientsServices.addPatient(newPatientEntry);
        res.json(addedEntry);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong';
        if(error instanceof Error) {
            errorMessage += "Error: " + error.message;
        }
        res.status(400).send(errorMessage);
    }
});
export default patientsRouter;