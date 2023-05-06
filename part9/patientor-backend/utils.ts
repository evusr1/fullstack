import { NewPatientEntry, Gender } from "./types";

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseName = (name: unknown) => {
    if (!isString(name))
        throw new Error('Incorrect or missing name');

    return name;
};

const parseSsn = (ssn: unknown) => {
    if (!isString(ssn))
        throw new Error('Incorrect or missing SSN');
    
    return ssn;
};

const parseOccupation = (occupation: unknown) => {
    if (!isString(occupation))
        throw new Error('Incorrect or missing occupation');

    return occupation;
};

const parseDate = (date: unknown): string => {
    if(!isString(date) || !isDate(date))
        throw new Error('Incorrect or missing date');

    return date;
};

const parseGender = (gender: unknown): Gender => {
    if(!isString(gender) || !isGender(gender))
        throw new Error('Incorrect or missing gender');

    return gender;
};

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
        const newEntry: NewPatientEntry = {
            name: parseName(object.name),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseSsn(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation),
        };

        return newEntry;
    }
    throw new Error('Incorrect data: a field missing');
};
