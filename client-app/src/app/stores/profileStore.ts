import { makeAutoObservable, runInAction } from "mobx";
import { IProfile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import { Photo } from "../models/photo";

export default class ProfileStore {
    profile: IProfile | null = null;
    loadingProfile: boolean = false;
    uploading: boolean = false;
    loading: boolean = false;
    deleting: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isCurrentUser() {
        if (this.profile && store.userStore.user) {
            return this.profile.userName === store.userStore.user.userName;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        if (username === this.profile?.userName) return;
        this.loadingProfile = true;
        try {
            const userProfile = await agent.Profiles.get(username); 
            runInAction(() => {
                this.profile = userProfile;
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.loadingProfile = false;
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            console.log(file);
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain) {
                        this.profile.image = photo.url;
                        store.userStore.setImage(photo.url);
                    }
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.uploading = false;
        }
    }

    setMain = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMain(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    const currentMain = this.profile.photos.find(p => p.isMain);
                    if (currentMain) currentMain.isMain = false;
                    photo.isMain = true;
                    this.profile.image = photo.url;
                }
            });

        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    }

    deletePhoto = async (id: string) => {
        this.deleting = true;
        try {
            await agent.Profiles.delete(id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(p => p.id !== id);
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.deleting = false;
        }
    }
}