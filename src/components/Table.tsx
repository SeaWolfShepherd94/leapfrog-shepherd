import React, { useState } from 'react';
import { useTable, usePagination, useGroupBy, useExpanded } from 'react-table';
import { Trans, useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useGlobalState } from './GlobalState';
import { IconButton, Menu, MenuItem, Fade } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IndeterminateCheckbox, TableData } from './TableItems';

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
  getHeaderProps = defaultPropGetter,
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
    allColumns,
    getToggleHideAllColumnsProps,
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

  const [editorQuery, setEditorQuery]: any = useGlobalState('editorQuery');
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [editableText, setEditableText]: any = useGlobalState('editableText');
  const [isSorted, setIsSorted]: any = useGlobalState('isSorted');
  const [isSortedDesc, setIsSortedDesc]: any = useGlobalState('isSortedDesc');
  const [defaultOrder, setDefaultOrder]: any = useGlobalState('defaultOrder');
  const [sortedValue, setSortedValue]: any = useGlobalState('sortedValue');
  const [updateView, setUpdateView]: any = useGlobalState('updateView');
  const [columnHeader, setColumnHeader]: any = useGlobalState('columnHeader');
  const [columnIndex, setColumnIndex]: any = useGlobalState('columnIndex');
  const [anchorEl, setAnchorEl] = useGlobalState('anchorEl');

  React.useEffect(() => {
    if (Object.keys(editableText).length === 0) {
      return;
    }
    setEditorQuery({ ...editorQuery, query: editableText });
    setQueryComponent({ ...queryComponent, query: editableText });
    // eslint-disable-next-line
  }, [updateView]);

  React.useEffect(() => {
    if (queryComponent.query.order) {
      setDefaultOrder(queryComponent.query.order);
    }
    // eslint-disable-next-line
  }, []);

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  const { t } = useTranslation();
  let key = 0;

  const handleSort = (value: any) => {
    if (isSortedDesc) {
      setIsSortedDesc(!isSortedDesc);
      setIsSorted(!isSorted);
      setSortedValue('');
      if (defaultOrder !== '' && defaultOrder !== {}) {
        setEditableText({ ...editorQuery.query, order: defaultOrder });
      } else {
        setEditableText({ ...editorQuery.query, order: [] });
      }
    } else {
      if (isSorted) {
        setIsSortedDesc(!isSortedDesc);
        setEditableText({ ...editorQuery.query, order: [{ [value]: 'desc' }] });
      } else {
        setIsSorted(!isSorted);
        setEditableText({ ...editorQuery.query, order: [{ [value]: 'asc' }] });
      }
    }
    setEditorQuery({ ...editorQuery, query: {} });
    setUpdateView(!updateView);
  };

  const handleClick = (value: any) => {
    if (sortedValue === '') {
      setSortedValue(value);
    } else if (sortedValue !== value) {
      setSortedValue(value);
      setIsSorted(true);
      setIsSortedDesc(false);
      setEditableText({ ...editorQuery.query, order: [{ [value]: 'asc' }] });
      setEditorQuery({ ...editorQuery, query: {} });
      setUpdateView(!updateView);
    } else {
      handleSort(value);
    }
  };

  const handleContextMenu = (event: any, value: string, index: number) => {
    setAnchorEl(event.currentTarget);
    setColumnHeader(value);
    setColumnIndex(index);
  };

  // Render the UI for your table
  return (
    <>
      <div className='tableWrap'>
        <div>
          <div>
            <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle All
          </div>
          {allColumns.map((column: any) => (
            <div key={column.id}>
              <label>
                <input type='checkbox' {...column.getToggleHiddenProps()} /> {column.id}
              </label>
            </div>
          ))}
          <br />
        </div>
        <div className='child'>
          <table {...getTableProps()} className='child'>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} key={key++}>
                  {headerGroup.headers.map((column: any, index: number) => (
                    <th {...column.getHeaderProps()} key={key++}>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          handleClick(column.render('Header'));
                        }}
                      >
                        {column.render('Header')}
                      </span>
                      <IconButton
                        aria-label='more'
                        aria-controls='long-menu'
                        aria-haspopup='true'
                        onClick={e => {
                          handleContextMenu(e, column.render('Header'), index);
                        }}
                        className='IconButton'
                        value={column.render('Header')}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <TableData />
                      <span>
                        {isSorted && sortedValue === column.render('Header') ? (isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                      </span>
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
                      return (
                        <td
                          // Return an array of prop objects and react-table will merge them appropriately
                          {...cell.getCellProps([getColumnProps(cell.column), getCellProps(cell)])}
                          key={key++}
                        >
                          {cell.render('Cell')}
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
      <div className='pagination'>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
