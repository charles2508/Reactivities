import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";
import { IProfile, Profile, ProfileFormValues } from "../models/profile";
import { Photo } from "../models/photo";
import { PaginatedResult } from "../models/Pagination";
import { UserActivity } from "../models/UserActivity";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
// the interceptors can distinguish between good response vs bad reponse
// Any response's status code in range 200 will follow the onFulfilled path
// Otherwise, it will get into onRejected path
axios.interceptors.response.use(async (response) => { 
    if (import.meta.env.DEV) await sleep(1000);
    const pagination = response.headers["pagination"];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<unknown>>;
    }
    return response;
}, (error: AxiosError) => {
    const { data, status, config, headers } = error.response as AxiosResponse;
    switch(status) {
        case 400:
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
            if (headers["www-authenticate"]?.startsWith('Bearer error="invalid_token"')) {
                store.userStore.logout();
                toast.error("Expired session - please login again");
            } else {
                toast.error('unauthorised');
            }
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
});

axios.interceptors.request.use((config) => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(response => responseBody(response)),
    post: <T> (url: string, body: object) => axios.post<T>(url, body).then(response => responseBody(response)),
    put: <T> (url: string, body: object) => axios.put<T>(url, body).then(response => responseBody(response)),
    delete: <T> (url: string) => axios.delete<T>(url).then(response => responseBody(response))
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params}).then(response => responseBody(response)),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    post: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    login: (userLogin: UserFormValues) => requests.post<User>('/account/login', userLogin),
    register: (userRegister: UserFormValues) => requests.post<User>('/account/register', userRegister),
    currentUser: () => requests.get<User>('/account'),
    refreshToken: () => requests.post<User>('/account/refreshToken', {})
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    update: (profile: ProfileFormValues) => requests.put<void>('/profiles', profile),
    uploadPhoto: (file: Blob) => {
        const formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
    },
    setMain: (id: string) => requests.post<void>(`/photos/${id}/setMain`, {}),
    delete: (id: string) => requests.delete<void>(`/photos/${id}`),
    updateFollowing: (username: string) => requests.post<void>(`/follow/${username}`, {}),
    loadFollowings: (username: string, predicate: string) => requests.get<IProfile[]>(`follow/${username}?predicate=${predicate}`),
    loadEvents: (username: string, predicate: string) => requests.get<UserActivity[]>(`profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;