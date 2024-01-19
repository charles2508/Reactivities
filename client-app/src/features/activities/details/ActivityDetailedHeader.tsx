import {Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import {Activity} from "../../../app/models/activity";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import useStore from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

export default observer(function ActivityDetailedHeader({activity}: Props) {
    const {activityStore: {submitting, updateAttendance, cancelActivity}} = useStore();
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {
                    activity.isCancelled &&
                        <Label 
                            style={{position: 'absolute', zIndex: 1000, left: -14, top: 20}}
                            color='red'
                            content='Cancelled'
                            ribbon/>
                }
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(activity.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong><Link to={`/profiles/${activity.host?.username}`}>{activity.host?.displayName}</Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {
                    activity.isHost ? (
                        <>
                            <Button
                                onClick={cancelActivity}
                                loading={submitting} 
                                content={activity.isCancelled ? 'Re-activate Activity' : 'Cancel Activity'}
                                color={activity.isCancelled ? 'green' : 'red'} 
                                floated='left'
                                basic/>
                            <Button
                                disabled={activity.isCancelled}
                                as={Link} to={`/manage/${activity.id}`}
                                color='orange'
                                floated='right'
                            >
                                Manage Event
                            </Button>
                        </>
                    ) : activity.isGoing ? (
                        <Button loading={submitting} onClick={updateAttendance}>Cancel attendance</Button>
                    ) :  (
                        <Button disabled={activity.isCancelled} loading={submitting} onClick={updateAttendance} color='teal'>Join Activity</Button>
                    )
                }
            </Segment>
        </Segment.Group>
    )
})