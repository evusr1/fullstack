/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Router } from 'express';
import  patientsServices from '../services/patientsService';
import { toNewEntry, toNewPatient } from '../utils';
const patientsRouter = Router();

patientsRouter.get('/', (_req, res) => {
    res.send(patientsServices.getNonsensitivePatientEntries());
});

patientsRouter.post('/', (req, res) => {
    try {
        const newPatientEntry = toNewPatient(req.body);
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

patientsRouter.get('/:id', (req, res) => {
    const patientEntry = patientsServices.getPatient(req.params.id);
    if(patientEntry) 
        res.json(patientEntry);
    
    res.status(404).end();
});

patientsRouter.post('/:id/entries', (req, res) => {
    try {
        const newEntry = toNewEntry(req.body);
        const addedEntry = patientsServices.addEntryToPatient(req.params.id, newEntry);
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