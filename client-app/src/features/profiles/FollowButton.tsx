import { observer } from "mobx-react-lite";
import { Button, Reveal } from "semantic-ui-react";
import { IProfile } from "../../app/models/profile";
import useStore from "../../app/stores/store";
import { SyntheticEvent } from "react";

interface Props {
    profile: IProfile | null;
}
export default observer(function FollowButton({profile}: Props) {
    const {profileStore, userStore} = useStore();
    const {loading, updateFollowing} = profileStore;

    if (userStore.user?.userName == profile?.userName) return null;

    function handleFollow(e: SyntheticEvent, username: string | undefined) {
        e.preventDefault();
        if (username) {
            profile?.following ? updateFollowing(username, false) : updateFollowing(username, true);
        }
    }

    return (
        <Reveal animated="move">
            <Reveal.Content visible style={{width: '100%'}}>
                <Button fluid color="teal" content={profile?.following ? 'Following' : 'Not Following'}/>
            </Reveal.Content>
            <Reveal.Content hidden style={{width: '100%'}}>
                <Button fluid basic color={profile?.following ? "red" : "green"} content={profile?.following ? "Unfollow" : "Follow"}
                    loading={loading}
                    onClick={(e) => handleFollow(e, profile?.userName)}
                />
            </Reveal.Content>
        </Reveal>
    )
})