import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;
    refreshTokenTimeout?: number;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    }

    login = async (creds: UserFormValues) => {
        const user = await agent.Account.login(creds);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        this.startCountingRefreshTokenTimeout();
        router.navigate('/activities');
        store.modalStore.closeModal();
    }

    logout = () => {
        store.commonStore.setToken(null);
        runInAction(() => this.user = null);
        router.navigate('/');
    }

    getCurrentUser = async () => {
        try {
            const user = await agent.Account.currentUser();
            store.commonStore.setToken(user.token);
            runInAction(() => {this.user = user});
            this.startCountingRefreshTokenTimeout();
        } catch (error) {
            console.log(error);
        }
    }

    setDisplayName = (displayName: string) => {
        if (this.user) this.user.displayName = displayName;
    }


    register = async (creds: UserFormValues) => {
        const user = await agent.Account.register(creds);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        this.startCountingRefreshTokenTimeout();
        router.navigate('/activities');
        store.modalStore.closeModal();
    }

    refreshToken = async () => {
        this.resetRefreshTokenTimeout();
        try {
            const user = await agent.Account.refreshToken();
            runInAction(() => {
                this.user = user;
            });
            store.commonStore.setToken(user.token);
            this.startCountingRefreshTokenTimeout();
        } catch (error) {
            console.log(error);
        }
    }

    private startCountingRefreshTokenTimeout = () => {
        const jwtTokenClaim = JSON.parse(atob(this.user!.token.split(".")[1]));
        const expires = new Date(jwtTokenClaim.exp * 1000);
        const timeout = expires.getTime() - Date.now() - 60 * 1000;
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }
    
    private resetRefreshTokenTimeout = () => {
        clearTimeout(this.refreshTokenTimeout);
    }
}