import { IProfile } from "./profile"

export interface IActivity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: IProfile;
    hostUsername: string;
    attendees?: IProfile[]
}

export class Activity implements Activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    isCancelled: boolean = false;
    isGoing: boolean = false;
    isHost: boolean = false;
    host?: IProfile = undefined;
    hostUsername: string = '';
    attendees?: IProfile[];

    /**
     *
     */
    constructor(activityForm: ActivityFormValues) {
        this.id = activityForm.id!;
        this.title = activityForm.title;
        this.date = activityForm.date;
        this.description = activityForm.description;
        this.category = activityForm.category;
        this.city = activityForm.city;
        this.venue = activityForm.venue; 
    }
}

export class ActivityFormValues {
    id?: string = undefined;
    title: string = '';
    date: Date | null = null;
    description: string = '';
    category: string = '';
    city: string = '';
    venue: string = '';

    /**
     *
     */
    constructor(activity?: Activity) {
        if (activity) {
            this.id = activity.id;
            this.title = activity.title;
            this.date = activity.date;
            this.description = activity.description;
            this.category = activity.category;
            this.city = activity.city;
            this.venue = activity.venue; 
        }
    }
}