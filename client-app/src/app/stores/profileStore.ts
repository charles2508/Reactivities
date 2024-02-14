import { makeAutoObservable, reaction, runInAction } from "mobx";
import { IProfile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import { Photo } from "../models/photo";
import { UserActivity } from "../models/UserActivity";

export default class ProfileStore {
    profile: IProfile | null = null;
    loadingProfile: boolean = false;
    uploading: boolean = false;
    loading: boolean = false;
    deleting: boolean = false;
    followings: IProfile[] = [];
    loadingFollowings: boolean = false;
    activeTab: number = 0;
    loadingEvents: boolean = false;
    userActivities: UserActivity[] = [];

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.activeTab,
            (activeTab) => {
                if (activeTab === 3 || activeTab === 4) {
                    activeTab === 3 ? this.loadFollowings('followers') : this.loadFollowings('following');
                } else {
                    runInAction(() => this.followings = []);
                }
            }
        )
    }

    setActiveTab(activeTab: number) {
        this.activeTab = activeTab;
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

    // revisit
    updateFollowing = async (userName: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(userName);
            store.activityStore.updateAttendenceFollowing(userName);
            runInAction(() => {
                if (this.profile && this.profile.userName == store.userStore.user!.userName) {
                    following ? this.profile.followingsCount++ : this.profile.followingsCount--;
                }
                if (this.profile && this.profile.userName === userName) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                this.followings.forEach(profile => {
                    if (profile.userName === userName) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.loadFollowings(this.profile!.userName, predicate);
            runInAction(() => this.followings = followings);
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingFollowings = false);
        }
    }

    loadUserActivities = async (predicate: string) => {
        this.loadingEvents = true;
        try {
            const events = await agent.Profiles.loadEvents(this.profile!.userName, predicate);
            runInAction(() => {
                this.userActivities = events;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingEvents = false);
        }
    }
}