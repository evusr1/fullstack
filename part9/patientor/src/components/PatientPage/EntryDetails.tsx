import { Entry, EntryType, assertNever } from "../../types";
import HealthCheckEntry from "./HealthyCheckEntry";
import HospitalEntry from "./HospitalEntry";
import OccupationalHealthcareEntry from "./OccupationalHealthcareEntry";

interface Props {
    entry: Entry;
    handleDiagnosis: (code: string) => string;
}

const EntryDetails = ({entry, handleDiagnosis}:Props) => {
    switch(entry.type) {
        case EntryType.Hospital:
            return <HospitalEntry entry={entry} handleDiagnosis={handleDiagnosis}/>
        case EntryType.OccupationalHealthcare:
            return <OccupationalHealthcareEntry entry={entry} handleDiagnosis={handleDiagnosis}/>
        case EntryType.HealthCheck:
            return <HealthCheckEntry entry={entry} handleDiagnosis={handleDiagnosis}/>
        default:
            return assertNever(entry);
    }
}

export default EntryDetails;