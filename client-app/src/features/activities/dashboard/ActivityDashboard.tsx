import { Grid, GridColumn } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface Props {
    activities: Activity[];
    selectActivity: (id: string) => void;
    cancelSelectedActivity: () => void;
    selectedActivity: Activity | undefined;
    openForm: (id: string) => void;
    closeForm: () => void;
    editMode: boolean;
    createOrEditActivity: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
}

export default function ActivityDashboard({
    activities,
    selectActivity,
    cancelSelectedActivity,
    selectedActivity,
    openForm,
    closeForm,
    editMode,
    createOrEditActivity,
    deleteActivity
}: Props) {

    return(
        <Grid>
            <GridColumn width='10'>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                    closeForm={closeForm}
                    deleteActivity={deleteActivity}/>
            </GridColumn>
            <GridColumn width='6'>
                { selectedActivity && !editMode && 
                    <ActivityDetails
                        activity={selectedActivity}
                        cancelSelectedActivity={cancelSelectedActivity}
                        openForm={openForm}
                    />
                }
                { editMode && <ActivityForm closeForm={closeForm} selectedActivity = { selectedActivity } createOrEditActivity={createOrEditActivity}/> }
            </GridColumn>
        </Grid>
    )
}