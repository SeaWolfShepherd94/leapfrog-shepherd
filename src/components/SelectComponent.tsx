import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { baseURL } from '../menuitems/MenuItemTools';
import Select from 'react-select';
import { useGlobalState } from './GlobalState';
import { useHistory } from 'react-router-dom';
import i18n from 'i18next';
import { Trans, useTranslation } from 'react-i18next';
import Simple from './Simple';

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
    setAddReportIsOpen(false);
  }

  async function getModelData(modelId: any) {
    const headers = {
      Authorization: `Bearer ${await getApiToken()}`,
      'Access-Control-Allow-Origin': '*'
    };

    await axios.get(`${baseURL}/api/Models/${modelId}`, { headers: headers }).then(response => {
      console.log(response.data.properties);
      setPropertyData(response.data.properties);
      setModelId(response.data.modelId);
      setDescription(response.data.description);
      setBaseTableId(response.data.baseTableId);
      setBaseTableName(response.data.baseTableName);
    });
  }

  const handleChange = (event: any) => {
    setNewName(event.value);
    getModelData(event.key);
  };

  const handleSubmit = (event: any) => {
    setUpdatePage(true);
    setModelName(newName);
    setProperties(propertyData);
    closeAddReportModal();
  };

  let submit: any | undefined = '';
  submit = i18n.t('submit');
  let cancel: any | undefined = '';
  cancel = i18n.t('cancel');

  return (
    <div style={{ width: '500px' }}>
      {/*<Select options={modelOptions} onChange={handleChange} />
      <br />
      {propertyData.length > 0 ? (
        <div>
          <table style={{border: '1px solid black', width: '100%'}}>
            <thead>
              <tr>
                <th style={{border: '1px solid black'}}>description</th>
                <th style={{border: '1px solid black'}}>baseTableName</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{border: '1px solid black'}}>{description}</td>
                <td style={{border: '1px solid black'}}>{baseTableName}</td>
              </tr>
            </tbody>
          </table>
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
              padding: '10px 45px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            value={submit}
            onClick={e => {
              handleSubmit(e);
            }}
          />
        </div>
          ) : null}*/}
      <Simple deviceType={'desktop'} />
    </div>
  );
}
