import './App.css';
import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import { CSVLink } from "react-csv";

const baseURL = "<Base-URL>";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
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

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function Table({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
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
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre>
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
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
            {pageIndex + 1} of {pageOptions.length}
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
  const [queryData, setQueryData] = useState([]);
  const [serverData, setServerData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [savedQuery, setSavedQuery] = useState({});
  const [savedColumns, setSavedColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [csvData, setCsvData] = useState([]);
  const [downloadName, setDownloadName] = useState("");
  const fetchIdRef = useRef(0);

  useEffect(() => {
    async function getData() {
      await axios
        .get(`${baseURL}/<Endpoint-for-queries>`)
        .then((response) => {
          setQueryData(response.data);
        });
    }
    getData();
  }, []);
  useEffect(() => {
    async function postData() {
      await axios
        .post(`${baseURL}/<Endpoint-for-savedQuery>`, savedQuery)
        .then((response) => {
          setServerData(response.data);
          setCsvData(response.data);
        });
      }
    postData();
  }, [savedQuery]);

  const fetchAPIData = async ({ limit, skip }) => {
    try {
      const headers = {
        'Accept': 'text/csv'
      }
      const query = {"queryId": savedQuery.queryId, "pageSize": limit, "rowOffset": skip};
      // request saved data to paginate
      await axios
        .post(`${baseURL}/<Endpoint-for-savedQuery>`, query)
        .then((response) => {
          setSavedData(response.data);
        });
      // request csv data
      await axios
        .post(`${baseURL}/<Endpoint-for-savedQuery>`, query, {headers:headers})
        .then((response) => {
          console.log(response.data);
        });
    } catch (e) {
      console.log("Error while fetching", e)
    }
  }

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    // Set the loading state
    setLoading(true)

    // We'll even set a delay to simulate a server here
    setTimeout(() => {
      // Only update the data if this is the latest fetch
      if (serverData.length === 0) {
        return;
      }
      if (fetchId === fetchIdRef.current) {
        fetchAPIData({
          limit: pageSize,
          skip: pageSize * pageIndex,
        })

        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(serverData.length / pageSize))

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
  }, [serverData])

  const updateQuery = (event) => {
    if (event.target.value) {
      setSavedQuery({"queryId": event.target.value});
      async function getName() {
        await axios
          .get(`${baseURL}/<Endpoint-for-queries>/${event.target.value}`)
          .then((response) => {
            setDownloadName(response.data.name);
          });
      }
      getName();
    }
  }

  return (
    <Styles>
      <Table
        columns={savedColumns}
        data={savedData}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
      />
      <label>
        Pick a query:
        <select onChange={e => updateQuery(e)}>
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
        csvData.length > 0 ?
          <CSVLink data={csvData} filename={`${downloadName}.csv`}>Download {downloadName}</CSVLink>
          : null
      }
    </Styles>
  )
}

 export default App;
