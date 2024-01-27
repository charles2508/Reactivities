import { Photo } from "./photo";
import { User } from "./user";

export interface IProfile {
    displayName: string;
    userName: string;
    image?: string;
    bio?: string;
    photos?: Photo[];
}

export class Profile implements IProfile {
    displayName: string;
    userName: string;
    image?: string;
    bio?: string;
    photos?: Photo[];

    /**
     *
     */
    constructor(user: User) {
        this.displayName = user.displayName;
        this.userName = user.userName;
        this.image = user.image;
    }
}