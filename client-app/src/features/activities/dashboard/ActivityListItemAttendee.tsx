import { List, Image, Popup } from "semantic-ui-react";
import { IProfile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
    attendees: IProfile[]
}

export default function ActivityListItemAttendee({attendees}: Props) {
    return(
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    trigger={
                        <List.Item as={Link} to={`/profiles/${attendee.username}`}>
                            <Image size='mini' circular src={attendee.image || '/assets/user.png'}/>
                        </List.Item>
                    }
                    key={attendee.username}
                    >
                    <Popup.Content>
                        <ProfileCard profile={attendee}/>
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    )
}