import React, { useState } from 'react';
import { useGlobalState } from './GlobalState';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { baseURL } from '../menuitems/MenuItemTools';
import { Menu, MenuItem, Fade } from '@material-ui/core';
import Modal from 'react-modal';
import Select from 'react-select';
import { Trans, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { customStyles, selectStyles } from '../menuitems/MenuItemTools';
import { useStyles } from '../hooks/useStyles';

export const Add = React.forwardRef((props, ref) => {
  const [anchorEl, setAnchorEl] = useGlobalState('anchorEl');
  const [addModalIsOpen, setAddIsOpen]: any = useState(false);
  const [isSelected, setIsSelected]: any = useState(false);
  const [modelData, setModelData]: any = useGlobalState('modelData');
  const [modelOptions, setModelOptions]: any = useGlobalState('modelOptions');
  const [propertyOptions, setPropertyOptions]: any = useState([]);
  const [newProperty, setNewProperty]: any = useState('');
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [savedColumns, setSavedColumns]: any = useGlobalState('savedColumns');
  const { getAccessTokenSilently } = useAuth0();
  const open = Boolean(anchorEl);
  const classes = useStyles();
  const { t } = useTranslation();
  const [storedquerydto, setStoredquerydto]: any = useGlobalState('storedquerydto');

  function closeAddModal() {
    setAddIsOpen(false);
    setIsSelected(false);
  }

  async function getApiToken() {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch {
      // do nothing
    }
  }

  async function getModelData(modelId: any) {
    const headers = {
      Authorization: `Bearer ${await getApiToken()}`,
      'Access-Control-Allow-Origin': '*'
    };

    await axios.get(`${baseURL}/api/Models/${modelId}`, { headers: headers }).then(response => {
      const newArr: any = [];
      response.data.properties.forEach((property: any, index: number) => {
        const option = {
          label: property.name,
          value: property.name,
          key: property.id
        };
        if (savedColumns.filter((column: any) => column.Header === property.name).length === 0) newArr.push(option);
      });
      setPropertyOptions(newArr);
    });
  }

  React.useEffect(() => {
    async function getData() {
      const headers = {
        Authorization: `Bearer ${await getApiToken()}`,
        'Access-Control-Allow-Origin': '*'
      };

      await axios.get(`${baseURL}/api/Models/list`, { headers: headers }).then(response => {
        setModelData(response.data);
        const model: any = response.data.filter((model: any) => model.name === queryComponent.modelName);
        getModelData(model[0].id);
      });
    }

    getData();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openAddModal = () => {
    setAddIsOpen(true);
    handleClose();
  };

  const handleAdd = () => {
    openAddModal();
  };

  const handleChange = (event: any) => {
    setNewProperty(event.value);
    setIsSelected(true);
  };

  const handleSubmit = (event: any) => {
    storedquerydto.query.addProjections([newProperty]);
    const temp = { ...storedquerydto, query: storedquerydto.query.deserialize() };
    setQueryComponent({ ...queryComponent, query: temp.query });
    handleClose();
    closeAddModal();
  };

  let cancel: any | undefined = '';
  cancel = i18n.t('cancel');
  let addLabel: any | undefined = '';
  addLabel = i18n.t('add-label');

  return (
    <div>
      <Menu
        ref={ref}
        {...props}
        id='long-menu'
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => handleAdd()}>
          <Trans t={t}>add</Trans>
        </MenuItem>
      </Menu>
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        style={customStyles}
        contentLabel='Add Modal'
        ariaHideApp={false}
      >
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
              <Trans t={t}>add-column</Trans>
            </div>
            <IconButton onClick={closeAddModal}>
              <CloseIcon />
            </IconButton>
          </div>
          <br />
          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <Select
              options={propertyOptions}
              onChange={handleChange}
              defaultValue={{ label: addLabel, value: addLabel }}
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
                  onClick={closeAddModal}
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
      </Modal>
    </div>
  );
});
