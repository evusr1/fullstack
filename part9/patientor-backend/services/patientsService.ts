import { v1 as uuid } from 'uuid';

import patients from '../data/patients';
import { NewPatientEntry, nonSensitivePatientEntry, PatientEntry } from '../types';

const getNonsensitivePatientEntries = () :nonSensitivePatientEntry[] => {
    const patientsEntries: PatientEntry[] = patients;

    return patientsEntries.map(({id, name, dateOfBirth, gender, occupation}) => 
        ({id, name, dateOfBirth, gender, occupation})
    );
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
    const id = uuid();
    const newDiaryEntry = {
        id: id,
        ...entry
    };

    patients.push(newDiaryEntry);

    return newDiaryEntry;
};
export default { getNonsensitivePatientEntries, addPatient };