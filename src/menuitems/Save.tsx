import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalState } from '../components/GlobalState';
import axios from 'axios';
import { baseURL } from './MenuItemTools';
import { customStyles } from './MenuItemTools';
import i18n from 'i18next';
import Modal from 'react-modal';

export const Save: React.FC<{ props: any; event: any }> = ({ props, event }) => {
  const history = useHistory();
  const { getAccessTokenSilently } = useAuth0();

  async function getApiToken() {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch {
      // do nothing
    }
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');

  const [saveModalIsOpen, setSaveIsOpen]: any = useGlobalState('saveModalIsOpen');

  function closeSaveModal() {
    setSaveIsOpen(false);
  }

  useEffect(() => {
    closeSaveModal();
    // eslint-disable-next-line
  }, [window.location]);

  function handleCloseSaveModal(event: any) {
    event.target.style.backgroundColor = 'black';
    setTimeout(() => {
      event.target.style.backgroundColor = '#4001FF';
    }, 100);
    closeSaveModal();
  }

  const handleSave = async (event: any) => {
    event.target.style.backgroundColor = 'black';
    setTimeout(() => {
      event.target.style.backgroundColor = '#4001FF';
    }, 100);
    const headers = {
      Authorization: `Bearer ${await getApiToken()}`,
      'Access-Control-Allow-Origin': '*'
    };
    event.preventDefault();
    await axios.put(`${baseURL}/api/Queries/${queryComponent.name}`, queryComponent, { headers: headers });
    closeSaveModal();
  };

  let save: any | undefined = '';
  save = i18n.t('save');
  let cancel: any | undefined = '';
  cancel = i18n.t('cancel');

  return (
    <div>
      <Modal
        isOpen={saveModalIsOpen}
        onRequestClose={closeSaveModal}
        style={customStyles}
        contentLabel='Save Modal'
        ariaHideApp={false}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
              handleCloseSaveModal(e);
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
            value={save}
            onClick={e => {
              handleSave(e);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
