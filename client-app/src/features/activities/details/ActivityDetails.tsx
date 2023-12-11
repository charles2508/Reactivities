import { Button, Card, Image } from "semantic-ui-react";
import useStore from "../../../app/stores/store";
import { observer } from "mobx-react-lite";


export default observer(function ActivityDetails() {
    const { activityStore } = useStore();
    const { selectedActivity: activity } = activityStore;
    return (
        activity && (
            <Card fluid>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
                <Card.Content>
                    <Card.Header>{activity.title}</Card.Header>
                    <Card.Meta>
                        <span>{activity.date}</span>
                    </Card.Meta>
                    <Card.Description>
                        {activity.description}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button.Group widths='2'>
                        <Button basic color="blue" content='Edit' onClick={() => { activityStore.handleFormOpen(activity.id) }}/>
                        <Button basic color="grey" content='Cancel' onClick={() => { activityStore.handleCancelSelectedActivity() }}/>
                    </Button.Group>
                </Card.Content>
            </Card>
        )
        
    )
})