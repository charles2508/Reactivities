import { Header } from 'semantic-ui-react';
import useStore from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';
import { Fragment } from 'react';

export default observer(function ActivityList() {
    const { activityStore } = useStore();
    const { groupActivitiesByDate } = activityStore; 


    return (
        <>
            {groupActivitiesByDate.map(([date, activities]) => (
                <Fragment key={date}>
                    <Header sub color='teal'>
                        {date}
                    </Header>
                    {activities.map(activity => (
                        // With key attribute, the Target state inside each child component is independent from each other
                        <ActivityListItem key={activity.id} activity={activity} />
                    ))}
                </Fragment>
            ))}
        </>
    )
})