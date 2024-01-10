import { Grid, GridColumn } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import useStore from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useEffect } from 'react';
import ActivityFilters from './ActivityFilters';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadingInitial } = activityStore;
  
    useEffect(() => {
      activityStore.loadActivities();
    }, [activityStore]);
    
    if (loadingInitial) return <LoadingComponent content='Loading activities...'/>
    
    return(
        <Grid>
            <GridColumn width='10'>
                <ActivityList/>
            </GridColumn>
            <GridColumn width='6'>
                <ActivityFilters />
            </GridColumn>
        </Grid>
    )
})