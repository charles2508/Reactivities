import { Tab } from "semantic-ui-react"
import ProfilePhotos from "./ProfilePhotos"
import ProfileFollowings from "./ProfileFollowings"
import useStore from "../../app/stores/store"
import ProfileActivities from "./ProfileActivities";

export default function ProfileContent() {
    const {profileStore} = useStore();
    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane>},
        {menuItem: 'Photos', render: () => <Tab.Pane><ProfilePhotos/></Tab.Pane>},
        {menuItem: 'Events', render: () => <Tab.Pane><ProfileActivities/></Tab.Pane>},
        {menuItem: 'Followers', render: () => <Tab.Pane><ProfileFollowings/></Tab.Pane>},
        {menuItem: 'Following', render: () => <Tab.Pane><ProfileFollowings/></Tab.Pane>}
    ]
    return (
        <Tab menu={{fluid: true, vertical: true}} menuPosition="right" panes={panes}
            onTabChange={(_, data) => {profileStore.setActiveTab(data.activeIndex as number)}}
        />
    )
}