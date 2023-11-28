import axios from 'axios';
import './styles.css';
import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid'; 

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities/')
        .then((response) => {
          console.log(response);
          setActivities(response.data)
        });
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
      const uniqueId = uuid();
      activity.id ? setActivities(activities.map((currentActivity) => {
        if (currentActivity.id === activity.id) {
          return activity;
        }
        return currentActivity;
      })) : setActivities([...activities, {...activity, id: uniqueId}]);
      console.log(activities);
      setEditMode(false);
      setSelectedActivity({...activity, id: uniqueId});
    }

    const handleDeleteActivity = (id: string) => {
      setActivities(activities.filter(currentActivity => currentActivity.id !== id));
      setEditMode(false);
      setSelectedActivity(undefined);
    }


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
        />
      </Container>
    </>
  )
}

export default App
