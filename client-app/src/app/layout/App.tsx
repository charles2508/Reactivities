import './styles.css';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import useStore from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';

function App() {
  const location = useLocation();
  const { pathname } = location;
  const { userStore, commonStore } = useStore();
  
  useEffect(() => {
    if (commonStore.token) {
      userStore.getCurrentUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [userStore, commonStore]);

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading application...'/>
  
  return (
    <>
      <ScrollRestoration/>
      <ModalContainer/>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
      {
        pathname === '/' ? <HomePage /> : (
          <>
            <NavBar/>
            <Container style={{marginTop: "7em"}}>
              <Outlet/>
            </Container>
          </>
        )
      }
    </>
  )
}

export default observer(App);


