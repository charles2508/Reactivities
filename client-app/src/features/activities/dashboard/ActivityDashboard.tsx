import { Grid, GridColumn, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import useStore from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/Pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceHolder';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadingInitial, setPagingParams, pagination, loadActivities} = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleLoadingNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false));
    }
  
    useEffect(() => {
        if (activityStore.activityRegistry.size <= 1) loadActivities();
    }, [activityStore, loadActivities]);
    

    return(
        <Grid>
            <GridColumn width='10'>
                {loadingInitial && !loadingNext ? (
                <>
                    <ActivityListItemPlaceholder/>
                    <ActivityListItemPlaceholder/>
                </>) : (
                    <InfiniteScroll
                    initialLoad={false}
                    loadMore={handleLoadingNext}
                    hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                    >
                        <ActivityList/>
                    </InfiniteScroll>  
                )}
            </GridColumn>
            <GridColumn width='6'>
                <ActivityFilters />
            </GridColumn>
            <Grid.Column width={10}>
                <Loader active={loadingNext}/>
            </Grid.Column>
        </Grid>
    )
})