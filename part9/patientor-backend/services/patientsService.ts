import { v1 as uuid } from 'uuid';

import patients from '../data/patients';
import { PatientWithoutID, NonSensitivePatient, PatientEntry, EntryWithoutId, Entry } from '../types';

const getNonsensitivePatientEntries = () :NonSensitivePatient[] => {
    const patientsEntries: PatientEntry[] = patients;

    return patientsEntries.map(({id, name, dateOfBirth, gender, occupation}) => 
        ({id, name, dateOfBirth, gender, occupation})
    );
};

const addPatient = (entry: PatientWithoutID): PatientEntry => {
    const id = uuid();
    const newPatient = {
        id: id,
        ...entry
    };

    patients.push(newPatient);

    return newPatient;
};

const getPatient = (id: string) : PatientEntry | null  => {
    const patientEntry = patients.find((patient: PatientEntry) => patient.id === id);
    if(patientEntry)
        return patientEntry;
    return null;
};

const addEntryToPatient = (patientId: string, entry: EntryWithoutId): Entry | null=> {
    const id = uuid();
    const newEntry = {
        id: id,
        ...entry
    };
    
    const patient = getPatient(patientId);

    if(!patient)
        return null;

    patient.entries.push(newEntry);

    return newEntry;
};

export default { getNonsensitivePatientEntries, addPatient, getPatient, addEntryToPatient };