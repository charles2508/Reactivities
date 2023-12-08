import './styles.css';
import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then((data) => {
      // Transform date part from api
      const activities: Activity[] = [];

      data.forEach((activity) => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity); 
      })

      setActivities(activities);
      setIsLoading(false);
    })
  }, []);


    const handleSelectActvity = (id: string) => {
        const selectedActivity = activities.find((activity) => activity.id === id);
        setSelectedActivity(selectedActivity);
    }

    const handleCancelSelectedActivity = () => {
        setSelectedActivity(undefined);
    }

    const handleFormOpen = (id?: string) => {
      id ? handleSelectActvity(id) : handleCancelSelectedActivity();
      setEditMode(true);
    }

    const handleFormClose = () => {
      setEditMode(false);
    }

    const handleCreateOrEditActivity = (activity: Activity) => {
      setSubmitting(true);

      if (activity.id) {
        agent.Activities.update(activity).then(() => {
          setActivities([...activities.filter((x) => x.id !== activity.id), activity]);
          setSelectedActivity(activity);
          setEditMode(false);
          setSubmitting(false);
        });
      } else {
        activity.id = uuid();
        agent.Activities.post(activity).then(() => {
          setActivities([...activities, activity]);
          setSelectedActivity(activity);
          setEditMode(false);
          setSubmitting(false);
        })
      }
    }

    const handleDeleteActivity = (id: string) => {
      setSubmitting(true);
      agent.Activities.delete(id).then(() => {
        setActivities(activities.filter(currentActivity => currentActivity.id !== id));
        setEditMode(false);
        setSelectedActivity(undefined);
        setSubmitting(false);
      })
    }
    
    if (isLoading) return <LoadingComponent/>

  return (
    <>
      <NavBar openForm = {handleFormOpen}/>
      <Container style={{marginTop: "7em"}}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActvity}
          cancelSelectedActivity={handleCancelSelectedActivity}
          selectedActivity={selectedActivity}
          openForm = {handleFormOpen}
          closeForm = {handleFormClose}
          editMode = {editMode}
          createOrEditActivity = {handleCreateOrEditActivity}
          deleteActivity = {handleDeleteActivity}
          submitting = {submitting}
        />
      </Container>
    </>
  )
}

export default App
