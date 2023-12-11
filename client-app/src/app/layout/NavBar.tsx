import { Button, Container, Menu } from "semantic-ui-react";
import useStore from "../stores/store";

export default function NavBar() {
    const { activityStore } = useStore();
    
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities"/>
                <Menu.Item>
                    <Button content='Create Activity' positive onClick={() => { activityStore.handleFormOpen() }}></Button>
                </Menu.Item>
            </Container>
        </Menu>
    )
}