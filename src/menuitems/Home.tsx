import { useEffect } from 'react';
import { useGlobalState } from '../components/GlobalState';
import { useLocation } from 'react-router-dom';
import ReportList from '../components/ReportList';
import { RouterComponent } from '../components/RouterComponent';

export const Home: React.FC = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [disableHomeComponent, setDisableHomeComponent]: any = useGlobalState('disableHomeComponent');
  const [disableHomeLink, setDisableHomeLink]: any = useGlobalState('disableHomeLink');
  const [disableComponent, setDisableComponent]: any = useGlobalState('disableComponent');
  const [disableLink, setDisableLink]: any = useGlobalState('disableLink');
  const [disableSaveAsComponent, setDisableSaveAsComponent]: any = useGlobalState('disableSaveAsComponent');
  const [disableSaveAsLink, setDisableSaveAsLink]: any = useGlobalState('disableSaveAsLink');
  const location = useLocation();
  useEffect(() => {
    setDisableHomeComponent(true);
    setDisableHomeLink('none');
    setDisableSaveAsComponent(true);
    setDisableSaveAsLink('none');
    setDisableComponent(true);
    setDisableLink('none');
    // eslint-disable-next-line
  }, [location.pathname]);
  return (
    <div>
      <ReportList />
      <RouterComponent />
    </div>
  );
};
