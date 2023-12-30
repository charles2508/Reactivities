import {  makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";

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
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    createActivity = async (activity: Activity) => {
        this.setSubmitting(true);
        try {
            await agent.Activities.post(activity);
            //Alternatively, can use runInAction()
            this.setActivities(activity);
            this.setSelectedActivity(activity);
            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    updateActivity = async (activity: Activity) => {
        this.setSubmitting(true);
        try {
            await agent.Activities.update(activity);
            //Alternatively, can use runInAction()
            this.setActivities(activity);
            this.setSelectedActivity(activity);
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