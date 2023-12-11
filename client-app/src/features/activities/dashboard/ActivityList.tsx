import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { SyntheticEvent, useState } from 'react';
import useStore from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function ActivityList() {
    const { activityStore } = useStore();
    const { deleteActivity, submitting, activitiesByDate, handleSelectActvity, handleFormClose } = activityStore; 
    const [target, setTarget] = useState('');

    const handleActivityDelete = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setTarget(event.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button floated='right' content='View' color='blue' onClick={() => { handleSelectActvity(activity.id), handleFormClose() }}/>
                                <Button
                                    name={activity.id}
                                    loading={submitting && activity.id === target}
                                    floated='right'
                                    content='Delete'
                                    color='red'
                                    onClick={(event) => { handleActivityDelete(event, activity.id), handleFormClose() }}/>
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})