import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { Trans, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useGlobalState } from './GlobalState';
import { IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { TableData } from './TableItems';
import axios from 'axios';
import moment from 'moment';
import { useAuth0 } from '@auth0/auth0-react';
import { baseURL } from '../menuitems/MenuItemTools';
import { characterizeProjection } from '@physion/leapfrog-ts-api/dist/utils';
import { ModelDto } from '@physion/leapfrog-ts-api/dist/api';
import { TProjectionElement } from '@physion/leapfrog-ts-api/dist/queryLanguage/projections/IProjectionElement';
import { PropertyNameProjection } from '@physion/leapfrog-ts-api/dist/queryLanguage';
import { isAggregation } from './DataTypes';

const defaultPropGetter = () => ({});

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
export default function Table({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter
}: any) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.

      pageCount: controlledPageCount
    },
    usePagination
  );

  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [columnHeader, setColumnHeader]: any = useGlobalState('columnHeader');
  const [columnIndex, setColumnIndex]: any = useGlobalState('columnIndex');
  const [columnCategory, setColumnCategory]: any = useGlobalState('columnCategory');
  const [anchorEl, setAnchorEl] = useGlobalState('anchorEl');
  const { getAccessTokenSilently } = useAuth0();
  const [propertyOptions, setPropertyOptions]: any = useState([]);
  const [modelObject, setModelObject]: any = useState({});
  const [storedquerydto, setStoredquerydto]: any = useGlobalState('storedquerydto');
  const [characterization, setCharacterization]: any = useState([]);

  async function getApiToken() {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch {
      // do nothing
    }
  }

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  const getModel = async (modelId: string): Promise<ModelDto> => {
    try {
      const headers = {
        Authorization: `Bearer ${await getApiToken()}`,
        'Access-Control-Allow-Origin': '*'
      };
      const { data } = await axios.get<ModelDto>(`${baseURL}/api/Models/${modelId}`, {
        headers: headers
      });
      const newArr: any = [];
      data.properties?.forEach((property: any, index: number) => {
        const option = {
          name: property.name,
          dataType: property.dataType
        };
        newArr.push(option);
      });
      setPropertyOptions(newArr);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
      } else {
        console.error('some other error %j', error);
      }
      return null as unknown as ModelDto;
    }
  };

  React.useEffect(() => {
    if (Object.keys(modelObject).length === 0) return;
    storedquerydto.query.project?.forEach((p: TProjectionElement) => {
      if (typeof p === 'string') {
        p = new PropertyNameProjection(p);
      }
      if (isAggregation(p) !== 'none') p = p?.propertyNameOrAlias;
      setCharacterization((characterization: any) => [...characterization, characterizeProjection(modelObject, p)]);
    });
  }, [modelObject]);

  React.useEffect(() => {
    setCharacterization([]);
    async function getData() {
      const headers = {
        Authorization: `Bearer ${await getApiToken()}`,
        'Access-Control-Allow-Origin': '*'
      };
      let model: any = {};
      await axios.get(`${baseURL}/api/Models/list`, { headers: headers }).then(response => {
        model = response.data.filter((model: any) => model.name === queryComponent.modelName);
      });
      setModelObject(await getModel(model[0].id));
    }
    getData();
  }, [storedquerydto]);

  const { t } = useTranslation();
  let key = 0;

  const handleContextMenu = (event: any, value: string, index: number, char: Array<string>) => {
    let category = '';
    setAnchorEl(event.currentTarget);
    setColumnHeader(value);
    setColumnIndex(index);
    if (value === '') return;
    if (char.includes('aggregatable')) category = 'String';
    if (char.includes('numberFormatable')) category = 'Number';
    if (char.includes('booleanFormatable')) category = 'Boolean';
    if (char.includes('instantFormatable') || char.includes('timeFormatable') || char.includes('dateFormatable'))
      category = 'Time';
    if (char.includes('json')) category = 'Undefined';
    setColumnCategory(category);
  };

  const [draggedFromIndex, setDraggedFromIndex] = useState(-1);
  const [draggedToIndex, setDraggedToIndex] = useState(-1);

  const newOnDragStart = (e: any) => {
    setDraggedFromIndex(e.currentTarget.dataset.position);
  };

  const newOnDragOver = (e: any) => {
    e.preventDefault();
    setDraggedToIndex(e.currentTarget.dataset.position);
  };

  const newOnDragEnd = (e: any) => {
    e.preventDefault();
    const temp = { ...storedquerydto, query: storedquerydto.query.deserialize() };
    const tempColumn = temp.query.project[draggedFromIndex];
    temp.query.project[draggedFromIndex] = temp.query.project[draggedToIndex];
    temp.query.project[draggedToIndex] = tempColumn;
    setQueryComponent({ ...queryComponent, query: temp.query });
  };

  // Render the UI for your table
  return (
    <>
      <div className='tableWrap'>
        <div className='child'>
          <table {...getTableProps()} className='child'>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} key={key++}>
                  {headerGroup.headers.map((column: any, index: number) => (
                    <th
                      {...column.getHeaderProps()}
                      key={key++}
                      className='drag-drop-zone'
                      draggable='true'
                      data-position={index}
                      onDragStart={e => newOnDragStart(e)}
                      onDragOver={e => newOnDragOver(e)}
                      onDragEnd={e => newOnDragEnd(e)}
                    >
                      <div className='header'>
                        <span style={{ cursor: 'grab' }}>{column.render('Header')}</span>
                        <IconButton
                          aria-label='more'
                          aria-controls='long-menu'
                          aria-haspopup='true'
                          onClick={e => {
                            handleContextMenu(e, column.render('Header'), index, characterization[index]);
                          }}
                          className='IconButton'
                          value={column.render('Header')}
                          style={{
                            padding: 0
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </div>
                      <TableData />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps(getRowProps(row))} key={key++}>
                    {row.cells.map(cell => {
                      if (Date.parse(cell.value) && isNaN(cell.value)) {
                        const property: any = propertyOptions.filter(
                          (property: any) => property.name === cell.column.Header
                        );
                        if (property.length > 0) {
                          if (property[0].dataType === 'date') cell.value = moment(cell.value).format('YYYY-MM-DD');
                          else if (property[0].dataType === 'dateTime' || property[0].dataType === 'timestamp') {
                            const testDateUtc = moment.utc(cell.value);
                            const localDate = moment(testDateUtc).local();
                            const s = localDate.format('YYYY-MM-DD HH:mm:ss');
                            cell.value = s;
                          } else if (property[0].dataType === 'timeOfDay')
                            cell.value = moment(cell.value).format('h:mm:ss');
                        }
                      }
                      if (typeof cell.value == 'boolean') {
                        cell.value = cell.value + '';
                      }
                      return (
                        <td
                          // Return an array of prop objects and react-table will merge them appropriately
                          {...cell.getCellProps([getColumnProps(cell.column), getCellProps(cell)])}
                          key={key++}
                        >
                          {cell.value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                {loading ? (
                  // Use our custom loading state to show a loading indicator
                  <td colSpan={10000}>
                    <Trans t={t}>loading</Trans>...
                  </td>
                ) : (
                  <td colSpan={10000}>
                    <Trans t={t}>showing</Trans> {page.length} <Trans t={t}>of</Trans> ~{controlledPageCount * pageSize}{' '}
                    <Trans t={t}>results</Trans>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <br />
      <div>
        <button className='pagination-button' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button className='pagination-button' onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button className='pagination-button' onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button className='pagination-button' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          <Trans t={t}>page</Trans> <strong>{pageIndex + 1}</strong>{' '}
        </span>
        <span>
          | <Trans t={t}>go-to-page</Trans>:{' '}
          <input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {i18n.t('show')} {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
