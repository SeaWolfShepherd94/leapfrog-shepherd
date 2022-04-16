import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalState } from '../components/GlobalState';
import axios from 'axios';
import { baseURL } from './MenuItemTools';
import { customStyles } from './MenuItemTools';
import i18n from 'i18next';
import { Trans, useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useStyles } from '../hooks/useStyles';

export const SaveAs: React.FC<{ props: any }> = ({ props }) => {
  const history = useHistory();
  const { getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState('');
  const classes = useStyles();
  const { t } = useTranslation();

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');

  const [saveAsModalIsOpen, setSaveAsIsOpen]: any = useGlobalState('saveAsModalIsOpen');

  function closeSaveAsModal() {
    setSaveAsIsOpen(false);
  }

  useEffect(() => {
    closeSaveAsModal();
    // eslint-disable-next-line
  }, [window.location]);

  function handleCloseSaveAsModal(event: any) {
    event.target.style.backgroundColor = 'black';
    setTimeout(() => {
      event.target.style.backgroundColor = '#4001FF';
    }, 100);
    closeSaveAsModal();
  }

  async function getApiToken() {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch {
      // do nothing
    }
  }

  const handleChange = (event: any) => {
    setName(event.target.value);
  };

  const handleSaveAs = async (event: any) => {
    event.target.style.backgroundColor = 'black';
    setTimeout(() => {
      event.target.style.backgroundColor = '#4001FF';
    }, 100);
    queryComponent.name = name;
    const headers = {
      Authorization: `Bearer ${await getApiToken()}`,
      'Access-Control-Allow-Origin': '*'
    };
    event.preventDefault();
    await axios.post(`${baseURL}/api/Queries`, queryComponent, { headers: headers });
    closeSaveAsModal();
  };

  let cancel: any | undefined = '';
  cancel = i18n.t('cancel');

  return (
    <div>
      <Modal
        isOpen={saveAsModalIsOpen}
        onRequestClose={closeSaveAsModal}
        style={customStyles}
        contentLabel='Save Modal'
        ariaHideApp={false}
      >
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingTop: '20px'
            }}
          >
            <div className={classes.heading}>
              <Trans t={t}>name-report</Trans>
            </div>
            <IconButton
              onClick={e => {
                handleCloseSaveAsModal(e);
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }}>
            <Trans t={t}>enter-your-new-report-name</Trans>:
          </div>
          <div>
            <form onSubmit={handleSaveAs}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: '20px', paddingRight: '20px' }}>
                <input defaultValue='' onChange={handleChange} style={{ width: '100%' }} />
              </div>
              <br />
              <Divider />
              <br />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  paddingBottom: '20px'
                }}
              >
                <input
                  type='submit'
                  style={{
                    marginRight: 5,
                    backgroundColor: '#4001FF',
                    fontFamily: 'gt_americabold, sans-serif',
                    fontSize: '18px',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 10px',
                    width: '100px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                  onClick={e => {
                    handleCloseSaveAsModal(e);
                  }}
                  value={cancel}
                />
                <input
                  type='submit'
                  style={{
                    backgroundColor: '#4001FF',
                    fontFamily: 'gt_americabold, sans-serif',
                    fontSize: '18px',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 10px',
                    width: '100px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                  value='OK'
                  onClick={e => {
                    handleSaveAs(e);
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};
