import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Save } from '../menuitems/Save';
import { SaveAs } from '../menuitems/SaveAs';
import { useGlobalState } from './GlobalState';
import { LogoutButton } from '../menuitems/MenuItemTools';
import Profile from './Profile';
import { IconButton, Menu, MenuItem, Fade } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router-dom';
import i18n from 'i18next';
import Modal from 'react-modal';
import SelectComponent from './SelectComponent';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: 'auto',
    overlfow: 'scroll'
  }
};

export const RouterComponent: React.FC = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [disableHomeComponent, setDisableHomeComponent]: any = useGlobalState('disableHomeComponent');
  const [disableHomeLink, setDisableHomeLink]: any = useGlobalState('disableHomeLink');
  const [disableSaveAsComponent, setDisableSaveAsComponent]: any = useGlobalState('disableSaveAsComponent');
  const [disableSaveAsLink, setDisableSaveAsLink]: any = useGlobalState('disableSaveAsLink');
  const [disableComponent, setDisableComponent]: any = useGlobalState('disableComponent');
  const [disableLink, setDisableLink]: any = useGlobalState('disableLink');

  const [saveModalIsOpen, setSaveIsOpen]: any = useGlobalState('saveModalIsOpen');
  const [saveAsModalIsOpen, setSaveAsIsOpen]: any = useGlobalState('saveAsModalIsOpen');
  const [addReportModalIsOpen, setAddReportIsOpen]: any = useGlobalState('addReportModalIsOpen');
  const [modelName, setModelName]: any = useGlobalState('modelName');
  const [updatePage, setUpdatePage]: any = useGlobalState('updatePage');

  function closeAddReportModal() {
    setAddReportIsOpen(false);
  }

  useEffect(() => {
    closeAddReportModal();
    // eslint-disable-next-line
  }, [window.location]);

  useEffect(() => {
    if (modelName === '' || !updatePage) return;
    setUpdatePage(false);
    if (window.location.pathname !== '/add-report') {
      history.push('/add-report');
    }
    // eslint-disable-next-line
  }, [modelName, updatePage]);

  function openSaveModal() {
    setSaveIsOpen(true);
  }

  function openSaveAsModal() {
    setSaveAsIsOpen(true);
  }

  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: any) => {
    if (event.target.id === i18n.t('home')) {
      history.push('/');
    }
    if (event.target.id === i18n.t('add-report')) {
      event.preventDefault();
      setAddReportIsOpen(true);
    }
    if (event.target.id === i18n.t('save')) {
      openSaveModal();
    }
    if (event.target.id === i18n.t('save-as')) {
      openSaveAsModal();
    }
    handleClose();
  };

  const options = [
    {
      name: i18n.t('home'),
      link: '/',
      disabled: disableHomeComponent,
      disabledlink: disableHomeLink
    },
    {
      name: i18n.t('save'),
      link: null,
      disabled: disableComponent,
      disabledlink: disableLink
    },
    {
      name: i18n.t('save-as'),
      link: null,
      disabled: disableSaveAsComponent,
      disabledlink: disableSaveAsLink
    },
    {
      name: i18n.t('add-report'),
      link: '/add-report',
      disabled: null,
      disabledlink: null
    },
    {
      name: i18n.t('log-out'),
      link: '/log-out',
      disabled: null,
      disabledlink: null
    }
  ];

  return (
    <div>
      <Router>
        <IconButton
          aria-label='more'
          aria-controls='long-menu'
          aria-haspopup='true'
          style={{ position: 'absolute', right: 50, top: 5 }}
          onClick={e => {
            handleClick(e);
          }}
          className='IconButton'
        >
          <MoreVertIcon />
        </IconButton>
        <Modal
          isOpen={addReportModalIsOpen}
          onRequestClose={closeAddReportModal}
          style={customStyles}
          contentLabel='Add Report Modal'
          ariaHideApp={false}
        >
          <SelectComponent />
        </Modal>
        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          {options.map((option, index) => (
            <div key={index}>
              {option.disabledlink !== null && option.disabled !== null ? (
                <>
                  {option.link !== null ? (
                    <Link
                      to={option.link}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                        color: 'black',
                        pointerEvents: option.disabledlink
                      }}
                    >
                      <MenuItem
                        selected={index === selectedIndex}
                        onClick={e => handleMenuItemClick(e)}
                        disabled={option.disabled}
                        id={option.name}
                      >
                        {option.name}
                      </MenuItem>
                    </Link>
                  ) : (
                    <MenuItem
                      selected={index === selectedIndex}
                      onClick={e => handleMenuItemClick(e)}
                      disabled={option.disabled}
                      id={option.name}
                    >
                      {option.name}
                    </MenuItem>
                  )}
                </>
              ) : (
                <>
                  {option.link !== null ? (
                    <Link to={option.link} style={{ textDecoration: 'none', display: 'block', color: 'black' }}>
                      <MenuItem
                        selected={index === selectedIndex}
                        onClick={e => handleMenuItemClick(e)}
                        id={option.name}
                      >
                        {option.name}
                      </MenuItem>
                    </Link>
                  ) : (
                    <MenuItem
                      selected={index === selectedIndex}
                      onClick={e => handleMenuItemClick(e)}
                      disabled={option.disabled}
                      id={option.name}
                    >
                      {option.name}
                    </MenuItem>
                  )}
                </>
              )}
            </div>
          ))}
        </Menu>
        <Profile />
        <div>
          <Switch>
            <Route path='/log-out/'>
              <LogoutButton />
            </Route>
          </Switch>
        </div>
      </Router>
      <Save props={{}} event={{}} />
      <SaveAs props={{}} />
    </div>
  );
};
