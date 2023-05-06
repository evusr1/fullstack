import diagnoses from '../data/diagnoses';
import { DiagnosesEntry } from '../types';

const getDiagnosesEntries = (): DiagnosesEntry[] => {
    return diagnoses;
};

export default { getDiagnosesEntries };