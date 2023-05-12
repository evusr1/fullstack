import { PatientWithoutID, EntryWithoutId, Gender, HealthCheckRating, Diagnosis, DischargeEntry, SickLeaveEntry } from "./types";

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isNumber = (num: unknown) : num is number => {
    return typeof num === 'number' || !isNaN(Number(num));
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(v => v.toString()).includes(param);
};

const isDischargeEntry = (param: object) : param is DischargeEntry => {
    return 'date' in param && 'criteria' in param;
};

const isSickLeaveEntry = (param: object) : param is SickLeaveEntry => {
    return 'startDate' in param && 'endDate' in param;
};


const isHealthCheckRating = (param: number) : param is HealthCheckRating => {
    return isNumber(param) && Object.values(HealthCheckRating).map(v => Number(v)).includes(param);
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


const parseType = (name: unknown): string => {
    if (!isString(name))
        throw new Error('Incorrect or missing type');

    return name;
};

const parseDescription = (description: unknown): string => {
    if (!isString(description))
        throw new Error('Incorrect or missing description');

    return description;
};

const parseSpecialist = (specialist: unknown): string => {
    if (!isString(specialist))
        throw new Error('Incorrect or missing specialist');

    return specialist;
};

const parseCriteria = (criteria: unknown): string => {
    if (!isString(criteria))
        throw new Error('Incorrect or missing criteria');

    return criteria;
};

const parseEmployeeName = (employeeName: unknown): string => {
    if (!isString(employeeName))
        throw new Error('Incorrect or missing employeeName');

    return employeeName;
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
    if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating))
        throw new Error('Incorrect or missing healthCheckRating');
    
    return healthCheckRating;
};

const parseDischargeEntry = (object: unknown): DischargeEntry => {
    if (!object
        || typeof object !== 'object'
        || !('discharge' in object)
        || !object.discharge
        || typeof object.discharge !== 'object'
        || !isDischargeEntry(object.discharge)) 
        throw new Error('Incorrect or missing discharge');

    return {
        date: parseDate(object.discharge.date),
        criteria: parseCriteria(object.discharge.criteria)
    };
};

const parseSickLeaveEntry = (object: unknown): SickLeaveEntry | undefined=> {
    if (!object|| typeof object !== 'object')
        throw new Error('Incorrect or missing data');
        
    if(!('sickLeave' in object) || !object.sickLeave)
        return undefined;

    if(typeof object.sickLeave !== 'object' || !isSickLeaveEntry(object.sickLeave))
        throw new Error('Incorrect or missing sick leave');

    return {
        startDate: parseDate(object.sickLeave.startDate),
        endDate: parseDate(object.sickLeave.endDate)
    };
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
      // we will just trust the data to be in correct form
      return [] as Array<Diagnosis['code']>;
    }
  
    return object.diagnosisCodes as Array<Diagnosis['code']>;
  };

export const toNewPatient = (object: unknown): PatientWithoutID => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
        const newEntry: PatientWithoutID = {
            name: parseName(object.name),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseSsn(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation),
            entries: []
        };

        return newEntry;
    }
    throw new Error('Incorrect data: a field missing');
};

export const toNewEntry = (object: unknown): EntryWithoutId => {
    if (!object || typeof object !== 'object') 
        throw new Error('Incorrect or missing data');

    let newEntry: EntryWithoutId;

    if ('description' in object
        && 'date' in object
        && 'specialist' in object
        && 'type' in object) {
            const type = parseType(object.type);
            switch(type) {
                case 'HealthCheck':
                    if(!('healthCheckRating' in object))
                        break;

                    newEntry = {
                        type: type,
                        description: parseDescription(object.description),
                        date: parseDate(object.date),
                        specialist: parseSpecialist(object.specialist),
                        diagnosisCodes: parseDiagnosisCodes(object),
                        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
                    };

                    return newEntry;
                case 'Hospital':
                    if(!('discharge' in object))
                        break;

                    newEntry = {
                        type: type,
                        description: parseDescription(object.description),
                        date: parseDate(object.date),
                        specialist: parseSpecialist(object.specialist),
                        diagnosisCodes: parseDiagnosisCodes(object),
                        discharge: parseDischargeEntry(object)
                    };

                    return newEntry;          
                case 'OccupationalHealthcare':
                    if(!('employerName' in object))
                        break;

                    newEntry = {
                        type: type,
                        description: parseDescription(object.description),
                        date: parseDate(object.date),
                        specialist: parseSpecialist(object.specialist),
                        employerName: parseEmployeeName(object.employerName),
                        sickLeave:  parseSickLeaveEntry(object),
                        diagnosisCodes: parseDiagnosisCodes(object),
                    };

                    return newEntry;
            }
    }
    throw new Error('Incorrect data: a field missing');
};
