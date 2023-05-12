import axios from 'axios';

import { Box, Button, Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { Icon } from '@mui/material';

import { Diagnosis, EntryFormValues, Patient } from '../../types'
import EntryDetails from './EntryDetails';
import React, { useState } from 'react';
import AddEntryModal from '../AddEntryModal';

import patientService from '../../services/patients'

interface Props {
  patient: Patient | null;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>
  diagnoses: Diagnosis[];
}

const PatientPage = ({ patient, diagnoses, setPatient }:Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const submitNewPatient = async (values: EntryFormValues) => {
    if(!patient)
      return;

    try {
      console.log(values)
      const entry = await patientService.createEntry(patient.id, values);
      setPatient({
        ...patient,
        entries: patient.entries.concat(entry)
      });
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  }


  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const handleDiagnosis = (code: string): string => {
    const diagnosis = diagnoses.find(diagnosis => diagnosis.code === code);
    if(diagnosis)
      return diagnosis.name
    return "";
  }

  const patientInfo = (patient:Patient) => (
    <Box>
      <Typography variant="h4">
        {patient.name}
        <Icon>
          {patient.gender === "male" && <MaleIcon/>}
          {patient.gender === "female" && <FemaleIcon/>}
        </Icon>
      </Typography>
      ssn: {patient.ssn}<br/>
      occupation: {patient.occupation}
      <Typography variant="h6">
        entries
      </Typography>
      {
        patient.entries.map((entry) => (
          <Box key={entry.id}>
            <EntryDetails entry={entry} handleDiagnosis={handleDiagnosis}/>
          </Box>
        ))
      }
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
        diagnoses={diagnoses}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </Box>
  )

  const notFound = () => (
    <Box>
      <Typography variant="h4">
        404 not found
      </Typography>
    </Box>
  )  

  return (
    <div className="App">
      {patient && patientInfo(patient)}
      {!patient && notFound()}
    </div>
  )
}

export default PatientPage;