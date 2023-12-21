import { Grid, GridColumn } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import useStore from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useEffect } from 'react';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadingInitial } = activityStore;
  
    useEffect(() => {
      activityStore.loadActivities();
    }, [activityStore]);
    
    if (loadingInitial) return <LoadingComponent/>
    
    return(
        <Grid>
            <GridColumn width='10'>
                <ActivityList/>
            </GridColumn>
            <GridColumn width='6'>
                <h2>Activity Filters</h2>
            </GridColumn>
        </Grid>
    )
})