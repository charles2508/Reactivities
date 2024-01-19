import { User } from "./user";

export interface IProfile {
    displayName: string;
    username: string;
    image?: string;
    bio?: string;
}

export class Profile implements IProfile {
    displayName: string;
    username: string;
    image?: string;
    bio?: string;

    /**
     *
     */
    constructor(user: User) {
        this.displayName = user.displayName;
        this.username = user.userName;
        this.image = user.image;
    }
}