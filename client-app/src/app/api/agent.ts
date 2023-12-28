import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";

axios.defaults.baseURL = 'http://localhost:5000/api';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
// the interceptors can distinguish between good response vs bad reponse
// Any response's status code in range 200 will follow the onFulfilled path
// Otherwise, it will get into onRejected path
axios.interceptors.response.use(async (response) => { 
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch(status) {
        case 400:
            console.log(error);
            if (config.method === 'get' && data.errors && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('/not-found');
            }
            else if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key])
                        modalStateErrors.push(data.errors[key]);
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 403:
            toast.error('forbidden');
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
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