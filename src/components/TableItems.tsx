import React, { useState } from 'react';
import { useGlobalState } from './GlobalState';
import { Menu, MenuItem, Fade } from '@material-ui/core';
import NestedMenuItem from 'material-ui-nested-menu-item';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/Check';
import Modal from 'react-modal';
import { Trans, useTranslation } from 'react-i18next';
import { Add } from './Add';
import i18n from 'i18next';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { customStyles, aggregationOptions, sortOptions } from '../menuitems/MenuItemTools';
import { dataCategories } from './DataTypes';
import { useStyles } from '../hooks/useStyles';
import { Ordering } from '@physion/leapfrog-ts-api';
import {
  QueryFactory,
  FunctionType,
  OrderingDirection,
  PropertyNameProjection,
  AverageProjection,
  CountDistinctProjection,
  CountProjection,
  MaxProjection,
  MinProjection,
  SumProjection
} from '@physion/leapfrog-ts-api/dist/queryLanguage';
import { isAggregation } from './DataTypes';

type TAggregateProjectionType =
  | FunctionType.average
  | FunctionType.count
  | FunctionType.countDistinct
  | FunctionType.max
  | FunctionType.min
  | FunctionType.sum;
type TAggregateProjection =
  | AverageProjection
  | CountDistinctProjection
  | CountProjection
  | MaxProjection
  | MinProjection
  | SumProjection
  | undefined;

export const TableData: React.FC = () => {
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [columnHeader, setColumnHeader]: any = useGlobalState('columnHeader');
  const [columnIndex, setColumnIndex]: any = useGlobalState('columnIndex');
  const [anchorEl, setAnchorEl] = useGlobalState('anchorEl');
  const [columnCategory, setColumnCategory]: any = useGlobalState('columnCategory');
  const [renameModalIsOpen, setRenameIsOpen]: any = useState(false);
  const [newName, setNewName]: any = useState('');
  const [disabledOptions, setDisabledOptions]: any = useState([]);
  const open = Boolean(anchorEl);
  const classes = useStyles();
  const { t } = useTranslation();
  const [storedquerydto, setStoredquerydto]: any = useGlobalState('storedquerydto');

  function closeRenameModal() {
    setRenameIsOpen(false);
  }

  React.useEffect(() => {
    const options: any = dataCategories.filter((dataCategory: any) => Object.keys(dataCategory)[0] === columnCategory);
    if (columnCategory === '') return;
    setDisabledOptions(options[0][columnCategory]);
  }, [columnCategory]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAggregate = (name: string) => {
    if (isAggregation(storedquerydto.query.project[columnIndex]) !== 'none') {
      storedquerydto.query.project[columnIndex] = QueryFactory.unwrapProjection(
        storedquerydto.query.project[columnIndex] as TAggregateProjection
      );
    }
    const temp = storedquerydto.query.project[columnIndex];
    const project = storedquerydto.query.project.filter(
      (p: PropertyNameProjection, index: number) => index !== columnIndex
    );
    if (name !== 'none') project.push(QueryFactory.wrapProjection(temp, name as TAggregateProjectionType));
    else project.unshift(temp);
    storedquerydto.query.clearProjections();
    storedquerydto.query.addProjections(project);
    handleEdit();
    handleClose();
  };

  const handleSort = (name: string, idx: number) => {
    const order =
      storedquerydto.query.order?.filter((ordering: Ordering) => ordering.propertyName !== columnHeader) || [];
    if (name !== 'none')
      order.unshift(new Ordering(columnHeader, idx ? OrderingDirection.descending : OrderingDirection.ascending));
    storedquerydto.query.clearOrdering();
    if (order.length > 0) storedquerydto.query.addOrderings(order);
    else delete storedquerydto.query.order;
    handleEdit();
    handleClose();
  };

  const handleRemove = () => {
    const project = storedquerydto.query.project.filter(
      (p: PropertyNameProjection, index: number) => index !== columnIndex
    );
    storedquerydto.query.clearProjections();
    storedquerydto.query.addProjections(project);
    handleEdit();
    handleClose();
  };

  const openRenameModal = () => {
    setRenameIsOpen(true);
    handleClose();
  };

  const handleChange = (event: any) => {
    setNewName(event.target.value);
  };

  const handleRename = async (event: any) => {
    const orderIndex = storedquerydto.query.order?.findIndex((ordering: Ordering) => {
      return ordering.propertyName === columnHeader;
    });
    if (orderIndex > -1) storedquerydto.query.order[orderIndex].propertyName = newName;
    storedquerydto.query.setProjectionAlias(columnIndex, newName);
    handleEdit();
    closeRenameModal();
  };

  function handleCloseRenameModal(event: any) {
    closeRenameModal();
  }

  function handleEdit() {
    const temp = { ...storedquerydto, query: storedquerydto.query.deserialize() };
    setQueryComponent({ ...queryComponent, query: temp.query });
  }

  let cancel: any | undefined = '';
  cancel = i18n.t('cancel');
  let aggregate: any | undefined = '';
  aggregate = i18n.t('aggregate');
  let sort: any | undefined = '';
  sort = i18n.t('sort');

  return (
    <div>
      {columnHeader !== '' ? (
        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <div>
            <NestedMenuItem label={aggregate} parentMenuOpen={open}>
              {aggregationOptions.map((option, idx) => (
                <div key={idx}>
                  {option.name === 'None' ? <Divider /> : null}
                  <MenuItem disabled={disabledOptions[idx]} onClick={() => handleAggregate(option.value)}>
                    <Trans t={t}>{option.value}</Trans>
                    {option.value ===
                    isAggregation(
                      storedquerydto.query.project?.filter(
                        (p: PropertyNameProjection, index: number) => index === columnIndex
                      )[0]
                    ) ? (
                      <CheckIcon />
                    ) : null}
                  </MenuItem>
                </div>
              ))}
            </NestedMenuItem>
            <NestedMenuItem label={sort} parentMenuOpen={open}>
              {sortOptions.map((option, idx) => (
                <div key={idx}>
                  {option.name === 'None' ? <Divider /> : null}
                  <MenuItem onClick={() => handleSort(option.value, idx)}>
                    <Trans t={t}>{option.value}</Trans>
                    {option.name === 'None' &&
                    (
                      storedquerydto.query.order?.filter(
                        (ordering: Ordering) => ordering.propertyName === columnHeader
                      ) || []
                    ).length === 0 ? (
                      <CheckIcon />
                    ) : null}
                    {option.name !== 'None' &&
                    (
                      storedquerydto.query.order?.filter(
                        (ordering: Ordering) =>
                          ordering.propertyName === columnHeader && ordering.direction === option.value
                      ) || []
                    ).length > 0 ? (
                      <CheckIcon />
                    ) : null}
                  </MenuItem>
                </div>
              ))}
            </NestedMenuItem>
            <MenuItem onClick={() => openRenameModal()}>
              <Trans t={t}>rename</Trans>
            </MenuItem>
            <MenuItem onClick={() => handleRemove()}>
              <Trans t={t}>remove</Trans>
            </MenuItem>
          </div>
        </Menu>
      ) : (
        <Add />
      )}
      <Modal
        isOpen={renameModalIsOpen}
        onRequestClose={closeRenameModal}
        style={customStyles}
        contentLabel='Rename Modal'
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
              <Trans t={t}>rename</Trans>
            </div>
            <IconButton
              onClick={e => {
                handleCloseRenameModal(e);
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }}>
            <Trans t={t}>enter-new-column-name</Trans>:
          </div>
          <div>
            <form onSubmit={handleRename}>
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
                  type='button'
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
                    handleCloseRenameModal(e);
                  }}
                  value={cancel}
                />
                <input
                  type='button'
                  style={{
                    backgroundColor: newName === '' ? 'grey' : '#4001FF',
                    fontFamily: 'gt_americabold, sans-serif',
                    fontSize: '18px',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 10px',
                    width: '100px',
                    borderRadius: '5px',
                    cursor: newName === '' ? 'not-allowed' : 'pointer'
                  }}
                  value='OK'
                  onClick={e => {
                    handleRename(e);
                  }}
                  disabled={newName === ''}
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};
