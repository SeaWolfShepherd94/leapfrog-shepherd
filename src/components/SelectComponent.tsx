import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { baseURL } from '../menuitems/MenuItemTools';
import Select from 'react-select';
import { useGlobalState } from './GlobalState';
import { useHistory } from 'react-router-dom';
import i18n from 'i18next';
import { Trans, useTranslation } from 'react-i18next';
import { Divider } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useStyles } from '../hooks/useStyles';
import { selectStyles } from '../menuitems/MenuItemTools';

export default function SelectComponent() {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const history = useHistory();
  const [modelData, setModelData]: any = useGlobalState('modelData');
  const [modelOptions, setModelOptions]: any = useGlobalState('modelOptions');
  const [modelName, setModelName]: any = useGlobalState('modelName');
  const [addReportModalIsOpen, setAddReportIsOpen]: any = useGlobalState('addReportModalIsOpen');
  const [updatePage, setUpdatePage]: any = useGlobalState('updatePage');
  const [propertyData, setPropertyData]: any = useGlobalState('propertyData');
  const [modelId, setModelId]: any = useState('');
  const [description, setDescription]: any = useState('');
  const [baseTableId, setBaseTableId]: any = useState('');
  const [baseTableName, setBaseTableName]: any = useState('');
  const [properties, setProperties]: any = useGlobalState('properties');
  const [newName, setNewName]: any = useState('');
  const [isSelected, setIsSelected]: any = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const { getAccessTokenSilently } = useAuth0();
  const [tiles, setTiles]: any = useState([]);

  async function getApiToken() {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch {
      // do nothing
    }
  }

  useEffect(() => {
    async function getData() {
      const headers = {
        Authorization: `Bearer ${await getApiToken()}`,
        'Access-Control-Allow-Origin': '*'
      };

      await axios.get(`${baseURL}/api/Models/list`, { headers: headers }).then(response => {
        setModelData(response.data);
      });
    }

    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    function setData() {
      const newArr: any = [];
      modelData.forEach((model: any, index: number) => {
        const option = {
          label: model.name,
          value: model.name,
          key: model.id
        };
        newArr.push(option);
      });
      setModelOptions(newArr);
    }
    if (modelData.length > 0) {
      setData();
    }
    // eslint-disable-next-line
  }, [modelData]);

  function closeAddReportModal() {
    setIsSelected(false);
    setAddReportIsOpen(false);
  }

  async function getModelData(modelId: any) {
    const headers = {
      Authorization: `Bearer ${await getApiToken()}`,
      'Access-Control-Allow-Origin': '*'
    };

    await axios.get(`${baseURL}/api/Models/${modelId}`, { headers: headers }).then(response => {
      setPropertyData(response.data.properties);
      setModelId(response.data.modelId);
      setDescription(response.data.description);
      setBaseTableId(response.data.baseTableId);
      setBaseTableName(response.data.baseTableName);
    });
  }

  const handleChange = (event: any) => {
    setIsSelected(true);
    setNewName(event.value);
    getModelData(event.key);
  };

  const handleSubmit = (event: any) => {
    setUpdatePage(true);
    setModelName(newName);
    setProperties(propertyData);
    closeAddReportModal();
  };

  let selectLabel: any | undefined = '';
  selectLabel = i18n.t('select-label');
  let cancel: any | undefined = '';
  cancel = i18n.t('cancel');

  return (
    <div style={{ width: '500px' }}>
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
          <Trans t={t}>select-model</Trans>
        </div>
        <IconButton onClick={closeAddReportModal}>
          <CloseIcon />
        </IconButton>
      </div>
      <br />
      <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <Select
          options={modelOptions}
          onChange={handleChange}
          defaultValue={{ label: selectLabel, value: selectLabel }}
          menuPortalTarget={document.body}
          styles={selectStyles}
          menuPosition='fixed'
        />
      </div>
      <br />
      {isSelected ? (
        <div>
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
              onClick={closeAddReportModal}
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
                padding: '10px 10px',
                width: '100px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              value='OK'
              onClick={e => {
                handleSubmit(e);
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
