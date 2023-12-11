import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';

export default class ActivityStore { 
    activityRegistry: Map<string, Activity>;
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loadingInitial: boolean = true;
    submitting: boolean = false;

    constructor() {
        this.activityRegistry = new Map<string, Activity>();
        makeAutoObservable(this);
    }

    // computed function
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date);
        })
    }

    loadActivities = async () => {

        try {
            const data = await agent.Activities.list();
            // needed in strict-mode of mobx (alternatively, can create an action function to wrap the "set state")
            runInAction(() => {
                data.forEach((activity) => {
                    activity.date = activity.date.split('T')[0];
                    this.activityRegistry.set(activity.id, activity);
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

    createActivity = async (activity: Activity) => {
        this.setSubmitting(true);
        activity.id = uuid();
          try {
            await agent.Activities.post(activity);
            //Alternatively, can use runInAction()
            this.setActivities(activity);
            this.setSelectedActivity(activity);
            this.setEditMode(false);
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
            this.setEditMode(false);
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
            this.setEditMode(false);
            this.setSelectedActivity(undefined);
            this.setSubmitting(false);
        } catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    handleSelectActvity = (id: string) => {
        const selectedActivity = this.activityRegistry.get(id);
        this.setSelectedActivity(selectedActivity);
    }

    handleCancelSelectedActivity = () => {
        this.setSelectedActivity(undefined);
    }

    handleFormOpen = (id?: string) => {
        id ? this.handleSelectActvity(id) : this.handleCancelSelectedActivity();
        this.setEditMode(true);
    }
  
    handleFormClose = () => {
        this.setEditMode(false);
    }

    setSelectedActivity = (activity: Activity | undefined ) => {
        this.selectedActivity = activity;
    }

    setActivities = (activity: Activity) => {
        this.activityRegistry.set(activity.id, activity);
    }

    setEditMode = (editMode: boolean) => {
        this.editMode = editMode;
    }

    setSubmitting = (submitting: boolean) => {
        this.submitting = submitting;
    }

}