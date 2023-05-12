import {  Icon, Paper } from "@mui/material";
import { Entry, EntryType } from "../../types";

import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Props {
    entry: Entry;
    handleDiagnosis: (code: string) => string;
}

const HealthCheckEntry = ({entry, handleDiagnosis}:Props) => {
    if(entry.type !== EntryType.HealthCheck)
        return (<></>);
    
    const colors: string[] = ['green', 'blue', 'yellow', 'red']
    
    return (
        <Paper sx={{p: 2, mt: 2}}>
            {entry.date}<br/>
            <Icon>
                <MedicalInformationIcon/>
            </Icon>
            {entry.description}<br/>
            <ul>
                {entry.diagnosisCodes && entry.diagnosisCodes.map((code) => (
                <li key={code}>{code} {handleDiagnosis(code)}</li>
                ))}
            </ul>
            <Icon>
                <FavoriteIcon sx={{fill: colors[entry.healthCheckRating]}}/>
            </Icon>
            <br/>
            diagnose by {entry.specialist}
        </Paper>
    )
}

export default HealthCheckEntry;