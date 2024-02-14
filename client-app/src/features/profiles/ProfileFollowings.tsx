import { observer } from "mobx-react-lite";
import useStore from "../../app/stores/store";
import { Card, Grid, GridColumn, Header } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function ProfileFollowings() {
    const {profileStore} = useStore();
    const {profile, followings, loadingFollowings, activeTab} = profileStore;

    if (loadingFollowings) return <LoadingComponent/>
    return(
        <Grid>
            <Grid.Column width={16}>
                <Header floated="left" icon="user" content={activeTab === 3? `People following ${profile?.displayName}` : `People ${profile?.displayName} is following`}/>
            </Grid.Column>
            <GridColumn width={16}>
                <Card.Group itemsPerRow={4}>
                    {followings.map(profile => (
                        <ProfileCard key={profile.userName} profile={profile}/>
                    ))}
                </Card.Group>
            </GridColumn>
        </Grid>
    )
})