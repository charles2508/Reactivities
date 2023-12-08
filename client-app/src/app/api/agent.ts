import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

axios.defaults.baseURL = 'http://localhost:5000/api';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

axios.interceptors.response.use(async (response) => {
    return sleep(1000).then(() => {
        return response;
    }).catch((error: Error) => {
        return Promise.reject(error);
    });
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(response => responseBody(response)),
    post: <T> (url: string, body: object) => axios.post<T>(url, body).then(response => responseBody(response)),
    put: <T> (url: string, body: object) => axios.put<T>(url, body).then(response => responseBody(response)),
    delete: <T> (url: string) => axios.delete<T>(url).then(response => responseBody(response))
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    post: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;