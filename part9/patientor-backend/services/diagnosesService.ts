import diagnoses from '../data/diagnoses';
import { Diagnosis } from '../types';

const getDiagnosesEntries = (): Diagnosis[] => {
    return diagnoses;
};

export default { getDiagnosesEntries };