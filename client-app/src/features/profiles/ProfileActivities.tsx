import { Card, Grid, Header, Tab, Image, TabProps } from "semantic-ui-react";
import { UserActivity } from "../../app/models/UserActivity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import useStore from "../../app/stores/store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

const panes = [
    { menuItem: 'Future Events', pane: { key: 'future' } },
    { menuItem: 'Past Events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'hosting' } }
];

export default observer(function ProfileActivities() {
    const {profileStore} = useStore();
    const {loadingEvents, loadUserActivities, userActivities}= profileStore;

    function handleTabChange(data: TabProps) {
        loadUserActivities(panes[data.activeIndex as number].pane.key)
    }

    useEffect(() => {
        loadUserActivities('future');
    }, [loadUserActivities]);

    return (
        <Tab.Pane loading={loadingEvents}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar'
                        content={'Activities'} 
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(_, data) => handleTabChange(data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userActivities.map((activity: UserActivity) => ( 
                            <Card
                                as={Link}
                                to={`/activities/${activity.id}`} key={activity.id}>
                                <Image
                                    src={`/assets/categoryImages/${activity.category}.jpg`}
                                    style={{ minHeight: 100, objectFit: 'cover'}}
                                />
                                <Card.Content>
                                    <Card.Header textAlign='center'>
                                        {activity.title}
                                    </Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div>{format(new Date(activity.date as Date),'do LLL')}</div>
                                        <div>{format(new Date(activity.date as Date), 'h:mm a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card> ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
})