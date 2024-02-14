import { Photo } from "./photo";
import { User } from "./user";

export interface IProfile {
    displayName: string;
    userName: string;
    image?: string;
    bio?: string;
    photos?: Photo[];
    followersCount: number;
    followingsCount: number;
    following: boolean;
}

export class Profile implements IProfile {
    displayName: string;
    userName: string;
    image?: string;
    bio?: string;
    photos?: Photo[];
    followersCount: number = 0;
    followingsCount: number = 0;
    following: boolean = false;
    /**
     *
     */
    constructor(user: User) {
        this.displayName = user.displayName;
        this.userName = user.userName;
        this.image = user.image;
    }
}