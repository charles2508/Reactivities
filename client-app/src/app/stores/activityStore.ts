import {  makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore { 
    activityRegistry: Map<string, Activity>;
    selectedActivity: Activity | undefined = undefined;
    loadingInitial: boolean = false;
    submitting: boolean = false;

    constructor() {
        this.activityRegistry = new Map<string, Activity>();
        makeAutoObservable(this);
    }

    // computed function that sort activities by date
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => {
            return a.date!.getTime() - b.date!.getTime();
        })
    }

    // computed function that group activities by date
    get groupActivitiesByDate() {
        const activitiesGroupByDate = this.activitiesByDate.reduce((accumulator, activity) => {
            const date = format(activity.date!, 'dd MMM yyyy');
            if (!(date in accumulator)) {
                accumulator[date] = [ activity ]
            } else {
                accumulator[date] = [...accumulator[date], activity]
            }
            return accumulator;
        }, {} as {[key: string]: Activity[]});
        
        return Object.entries(activitiesGroupByDate);
    }

    loadActivities = async () => {
        if (this.activityRegistry.size <= 1) {
            this.loadingInitial = true;
            try {
                const data = await agent.Activities.list();
                // needed in strict-mode of mobx (alternatively, can create an action function to wrap the "set state")
                runInAction(() => {
                    data.forEach((activity) => {
                        this.setActivity(activity);
                    })
                    this.loadingInitial = false;
                });
            } catch(error) {
                console.log(error);
                runInAction(() => {
                    this.loadingInitial = false;
                });
            }
        }
    }

    loadActivity = async (id: string) => {
        if (this.activityRegistry.has(id)) {
            this.selectedActivity = this.activityRegistry.get(id);
        } else {
            this.loadingInitial = true;
            try {
                const activity = await agent.Activities.details(id);
                console.log(activity);
                runInAction(() => {
                    this.setActivity(activity);
                    this.setSelectedActivity(activity);
                    this.loadingInitial = false;
                })
            } catch (error) {
                console.log(error);
                runInAction(() => {
                    this.loadingInitial = false;
                })
            }
        }
        return this.selectedActivity;
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        console.log(user);
        if (user) {
            activity.host = activity.attendees!.find(attendee => attendee.userName == activity.hostUsername);
            activity.isHost = activity.hostUsername === user.userName;
            activity.isGoing = activity.attendees!.some(attendee => attendee.userName === user.userName);
        }
        console.log(activity);
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    createActivity = async (activity: ActivityFormValues) => {
        this.setSubmitting(true);
        try {
            await agent.Activities.post(activity);

            const user = store.userStore.user!;
            const attendee = new Profile(user);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user.userName;
            newActivity.attendees = [attendee];

            //Alternatively, can use runInAction()
            this.setActivity(newActivity);
            this.setSelectedActivity(newActivity);
            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        this.setSubmitting(true);
        try {
            await agent.Activities.update(activity);
            //Alternatively, can use runInAction()

            // const updatedActivity = new Activity(activity);
            // const oldActivity = this.activityRegistry.get(activity.id!);
            // updatedActivity.isCancelled = oldActivity!.isCancelled;
            // updatedActivity.isGoing = oldActivity!.isGoing;
            // updatedActivity.isHost = oldActivity!.isHost;
            // updatedActivity.host = oldActivity?.host;
            // updatedActivity.hostUsername = oldActivity!.hostUsername;
            // updatedActivity.attendees = oldActivity?.attendees;
            // Replaced by:
            const updatedActivity = {...this.activityRegistry.get(activity.id!), ...activity};

            this.setActivities(updatedActivity as Activity);
            this.setSelectedActivity(updatedActivity as Activity);
            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }
    
    deleteActivity = async (id: string) => {
        this.setSubmitting(true);
        try {
            await agent.Activities.delete(id);
            this.activityRegistry.delete(id);
            this.setSelectedActivity(undefined);
            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    updateAttendance = async () => {
        this.setSubmitting(true);
        const user =  store.userStore.user!;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            if (this.selectedActivity!.isGoing) {
                this.selectedActivity!.attendees = this.selectedActivity?.attendees?.filter(a => a.userName !== user.userName);
            } else {
                const attendee = new Profile(user);
                this.selectedActivity?.attendees?.push(attendee);
            }
            this.selectedActivity!.isGoing = !this.selectedActivity!.isGoing;
            this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {this.submitting = false});
        }
    }

    cancelActivity = async () => {
        this.setSubmitting(true);
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.setSubmitting(false);
        }
    }

    setSelectedActivity = (activity: Activity | undefined ) => {
        this.selectedActivity = activity;
    }

    setActivities = (activity: Activity) => {
        this.activityRegistry.set(activity.id, activity);
    }

    setSubmitting = (submitting: boolean) => {
        this.submitting = submitting;
    }

}