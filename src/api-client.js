import axios, { Axios } from "axios"
import { HOST } from './Constants.js';

export const apiClient = axios.create({
    baseURL: HOST,
})

export const apiClient2 = axios.create({
    baseURL: "/api"
})