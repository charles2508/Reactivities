import { observer } from "mobx-react-lite";
import { Divider, Grid, Header, Item, Segment, Statistic } from "semantic-ui-react";
import FollowButton from "./FollowButton";
import useStore from "../../app/stores/store";


export default observer(function ProfileHeader() {
    const { profileStore: {profile} } = useStore();
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size="small" src={profile?.image || '/assets/user.png'}/>
                            <Item.Content verticalAlign="middle">
                                <Header as='h1' content={profile?.displayName}/>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Followers' value={profile?.followersCount}/>
                        <Statistic label='Following' value={profile?.followingsCount}/>
                    </Statistic.Group>
                    <Divider/>
                    <FollowButton profile={profile}/>
                </Grid.Column>
            </Grid>
        </Segment>
    )
})