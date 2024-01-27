import { useParams } from "react-router-dom"
import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useEffect } from "react";
import useStore from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function ProfilePage() {
    const { username } = useParams<string>();
    const { profileStore } = useStore();

    useEffect(() => {
        if (username) profileStore.loadProfile(username);
    }, [username, profileStore])

    if (profileStore.loadingProfile) return <LoadingComponent content='Loading profile...'/>
    return(
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader/>
                <ProfileContent/>
            </Grid.Column>
        </Grid>
    )
})