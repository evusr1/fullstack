import axios from "axios";
import { DiaryEntry } from "../types";
const baseUrl = `http://localhost:3001/api/diaries`

export const getAllDiaryEntries = () => {
    return axios
        .get<DiaryEntry[]>(baseUrl)
        .then(response => response.data)
}

export const createDiaryEntry = (entry: object) => {
    return axios
        .post<DiaryEntry>(baseUrl, entry)
        .then(response => response.data)
}