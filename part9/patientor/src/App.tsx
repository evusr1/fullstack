import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Diagnosis, Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

import diagnosesService from "./services/diagnoses";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const matchPatient = useMatch('/patients/:id')

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    const fetchPatient = async () => {
      if(!matchPatient)
        return;
      if(!matchPatient.params.id)
        return;

      const patient = await patientService.getById(matchPatient.params.id)
      setPatient(patient);
    }

    const fetchDiagnosesList = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    }

    void fetchPatientList();
    void fetchPatient();
    
    void fetchDiagnosesList();
  }, [matchPatient]);
  
  

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
          <Route path="/patients/:id" element={
            <PatientPage
              patient={patient}
              setPatient={setPatient}
              diagnoses={diagnoses}
            />
          }
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
