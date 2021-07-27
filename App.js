import './App.css';
import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import { CSVLink } from "react-csv";
import "react-datepicker/dist/react-datepicker.css";

const baseURL = "https://localhost:5001";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    thead {
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      background-color: white;
      padding: 50px;
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`
const defaultPropGetter = () => ({})

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function Table({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) {
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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.

      pageCount: controlledPageCount,
    },
    usePagination
  )

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps(getRowProps(row))}>
              {row.cells.map(cell => {
                return (
                  <td
                    // Return an array of prop objects and react-table will merge them appropriately
                    {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style,
                      },
                      getColumnProps(cell.column),
                      getCellProps(cell),
                    ])}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
            )
          })}
          <tr>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <td colSpan="10000">Loading...</td>
            ) : (
              <td colSpan="10000">
                Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                results
              </td>
            )}
          </tr>
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
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
          Page{' '}
          <strong>
            {pageIndex + 1}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
 
function App() {
  const [pageCount, setPageCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [queryData, setQueryData] = useState([]);
  const [queryParameters, setQueryParameters] = useState([]);
  const [isParameter, setIsParameter] = useState(false);
  const [isParameterChanged, setIsParameterChanged] = useState(false);
  const [parameterValues, setParameterValues] = useState({});
  const [serverData, setServerData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [savedQuery, setSavedQuery] = useState({});
  const [savedColumns, setSavedColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    async function getData() {
      await axios
        .get(`${baseURL}/Queries`)
        .then((response) => {
          setQueryData(response.data);
        });
    }
    getData();
  }, []);

  const fetchAPIData = async ({ limit, skip }) => {
    try {
      const headers = {
        'Accept': 'text/csv'
      }
      const query = {"queryId": savedQuery.queryId, "pageSize": limit, "rowOffset": skip, "parameters": parameterValues};
      // request saved data to paginate
      await axios
        .post(`${baseURL}/Executive/saved`, query)
        .then((response) => {
          setSavedData(response.data);
        });
      // request csv data
      await axios
        .post(`${baseURL}/Executive/saved`, query, {headers:headers})
        .then((response) => {
          setCsvData(response.data);
        });
    } catch (e) {
      console.log("Error while fetching", e)
    }
  }

  useEffect(() => {
    if (!savedQuery.queryId) {
      return;
    }
    async function getData() {
      await axios
        .get(`${baseURL}/Queries/${savedQuery.queryId}`)
        .then((response) => {
          setQueryParameters(response.data.parameters);
          const parameters = response.data.parameters
          const parameterNames = parameters.map((parameter) => {
            return parameter.name;
          });
          const newArr = {};
          parameterNames.map((parameterName) =>
            newArr[parameterName] = ""
          );
          setParameterValues(newArr);
        });
    }
    async function postData() {
      await axios
        .post(`${baseURL}/Executive/saved`, savedQuery)
        .then((response) => {
          if (response.data.length === 0) {
            alert("Empty data response!");
          } else {
            setServerData(response.data);
          }
        })
        .catch((error) => {
          alert(error);
        });
      const queryId = savedQuery.queryId;
      const headers = {
        'Accept': 'ovation/rowcount+json',
        "Content-Type": "application/json"
      }
      await axios
        .post(`${baseURL}/Executive/saved`, {"queryId": queryId, "parameters": parameterValues}, {headers:headers})
        .then((response) => {
          setRowCount(response.data.count);
        });
      }
      if (!isParameter) {
        getData();
      } else if (isParameter && isParameterChanged) {
        postData();
      }
  }, [savedQuery,isParameter,isParameterChanged]);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    // Set the loading state
    setLoading(true)

    setTimeout(() => {
      // Only update the data if this is the latest fetch
      if (serverData.length === 0 || rowCount === 0) {
        return;
      }
      if (fetchId === fetchIdRef.current) {
        fetchAPIData({
          limit: pageSize,
          skip: pageSize * pageIndex,
        })
        setPageCount(Math.ceil(rowCount / pageSize));

        const columns = Object.keys(serverData[0]).map((key, id)=>{
          return {
            Header: key,
            accessor: key
          }
        });
        setSavedColumns(columns);

        setLoading(false)
      }
    }, 1000)
  }, [serverData, rowCount])

  const updateQuery = (event) => {
    if (event.target.value) {
      if (isParameter) {
        setIsParameter(false);
      }
      setSavedQuery({"queryId": event.target.value,"pageSize": 10,"rowOffset": 0,"parameters": parameterValues});
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    savedQuery.parameters = parameterValues;
    setIsParameterChanged(true);
    setIsParameter(true);
  }

  const handleChange = (index, event) => {
    if (isParameterChanged) {
      setIsParameterChanged(false);
    }
    parameterValues[event.target.name] = event.target.value;
  }

  return (
    <Styles>
      <label>
        Pick a query:
        <select onChange={e => updateQuery(e)} style={{ marginLeft: 5}}>
          <option key="" value="" name="">
            Select
          </option>
          {queryData.map(({ name, queryId }) => (
          <option key={queryId} value={queryId} name={name}>
            {name}
            </option>
            ))}
        </select>
      </label>
      {
        queryParameters.length > 0 ?
        <>
        <form onSubmit={e => {handleSubmit(e)}}>
          {queryParameters.map((queryParameter, index) => {
            return (
              <div key={index}>
                <p  style={{ marginBottom: 5}}>{queryParameter.name}</p>
                <input key={index} name={queryParameter.name} onChange={e => handleChange(index,e)} required/>
              </div>
            );
          })}
          <br/>
          <button type="submit">Submit</button>
        </form>
        <br/>
        </>
        : null
      }
      {
        csvData.length > 0 ?
        <>
        <CSVLink data={csvData}>Export page to CSV</CSVLink>
        <br/>
        <br/>
        </>
        : null
      }
      <Table
        columns={savedColumns}
        data={savedData}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
      />
    </Styles>
  )
}

 export default App;