import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalState } from '../components/GlobalState';
import axios from 'axios';
import { baseURL } from './MenuItemTools';
import { customStyles } from './MenuItemTools';
import i18n from 'i18next';
import Modal from 'react-modal';

export const SaveAs: React.FC<{ props: any }> = ({ props }) => {
  const history = useHistory();
  const { getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState('');

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

  let saveAs: any | undefined = '';
  saveAs = i18n.t('save-as');
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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <form onSubmit={handleSaveAs}>
            <input defaultValue='' onChange={handleChange} style={{ width: '100%' }} />
            <br />
            <br />
            <input
              type='submit'
              style={{
                marginRight: 5,
                backgroundColor: '#4001FF',
                fontFamily: 'gt_americabold, sans-serif',
                fontSize: '18px',
                color: '#fff',
                border: 'none',
                padding: '10px 45px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={e => {
                handleCloseSaveAsModal(e);
              }}
              value={cancel}
            />
            <input
              className='button'
              type='submit'
              style={{
                backgroundColor: '#4001FF',
                fontFamily: 'gt_americabold, sans-serif',
                fontSize: '18px',
                color: '#fff',
                border: 'none',
                padding: '10px 45px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              value={saveAs}
              onClick={e => {
                handleSaveAs(e);
              }}
            />
          </form>
        </div>
      </Modal>
    </div>
  );
};
