import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import Styles from './Styles';
import Table from './Table';

const baseURL = "https://localhost:5001";
 
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

  const initialDates = [];
  var [isDate, setIsDate] = useState(0);
  const [dates, setDates] = useState([]);

  const [inputValue, setInputValue] = useState("");

  var BEARER_TOKEN = '<Bearer-Token>';

  useEffect(() => {
    const headers = {
      'Authorization': `Bearer ${BEARER_TOKEN}`
    }
    async function getData() {
      await axios
        .get(`${baseURL}/api/Queries`, {headers:headers})
        .then((response) => {
          setQueryData(response.data);
        });
    }
    getData();
    // eslint-disable-next-line
  },[]);

  const fetchAPIData = async ({ limit, skip }) => {
    try {
      const csvheaders = {
        'Accept': 'text/csv',
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      const headers = {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      const query = {"queryName": savedQuery.queryName, "pageSize": limit, "rowOffset": skip, "parameters": parameterValues};
      // request saved data to paginate
      await axios
        .post(`${baseURL}/api/Executive/saved`, query, {headers:headers})
        .then((response) => {
          setSavedData(response.data);
        });
      // request csv data
      await axios
        .post(`${baseURL}/api/Executive/saved`, query, {headers:csvheaders})
        .then((response) => {
          setCsvData(response.data);
        });
    } catch (e) {
      console.log("Error while fetching", e)
    }
  }

  useEffect(() => {
    if (!savedQuery.queryName) {
      return;
    }
    async function getData() {
      const headers = {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      await axios
        .get(`${baseURL}/api/Queries/${savedQuery.queryName}`, {headers:headers})
        .then((response) => {
          setQueryParameters(response.data.parameters);
          const parameters = response.data.parameters;
          const newArr = {};
          parameters.forEach((parameter) => {
            if (parameter.dataType === "date") {
              const date = new Date();
              newArr[parameter.name] = moment(date).format('YYYY-MM-DD');
            } else {
              newArr[parameter.name] = "";
            }
          });
          parameters.forEach((parameter) => {
            if (parameter.dataType === "date") {
              const date = new Date();
              setDates(dates=>([
                ...dates,
                date
              ]));
              setIsDate(true);
            }
          });
          setParameterValues(newArr);
        });
    }
    async function postData() {
      const headers = {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      await axios
        .post(`${baseURL}/api/Executive/saved`, savedQuery, {headers:headers})
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
      const queryName = savedQuery.queryName;
      const rowCountHeaders = {
        'Accept': 'ovation/rowcount+json',
        "Content-Type": "application/json",
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      await axios
        .post(`${baseURL}/api/Executive/saved`, {"queryName": queryName, "parameters": parameterValues}, {headers:rowCountHeaders})
        .then((response) => {
          setRowCount(response.data.count);
        });
      }
      if (!isParameter) {
        getData();
      } else if (isParameter && isParameterChanged) {
        postData();
      }
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, [serverData, rowCount])

  const updateQuery = (event) => {
    if (event.target.value) {
      if (isParameter) {
        setIsParameter(false);
      }
      if (isParameterChanged) {
        setIsParameterChanged(false);
      }
      if (isDate) {
        setIsDate(false);
        setDates([...initialDates]);
      } else {
        setInputValue("");
      }
      setSavedQuery({"queryName": event.target.value,"pageSize": 10,"rowOffset": 0,"parameters": parameterValues});
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
    setInputValue(event.target.value);
  }

  const handleDate = (date,event,index,name) => {
    if (isParameterChanged) {
      setIsParameterChanged(false);
    }
    setDates([
      ...dates.slice(0,index),
      date,
      ...dates.slice(index+1)
    ]);
   parameterValues[name] = moment(date).format('YYYY-MM-DD');
  }

  return (
    <Styles>
      <label>
        Pick a query:
        <select onChange={e => updateQuery(e)} style={{ marginLeft: 5, marginBottom: 5}}>
          <option key="" value="" name="">
            Select
          </option>
          {queryData.map(({ name, queryId }) => (
          <option key={queryId} value={name} name={name}>
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
                {
                  queryParameter.dataType === "date" && isDate ?
                  <DatePicker selected={dates[index]} onChange={(date,event) => {handleDate(date,event,index,queryParameter.name)}} />
                  : <input key={index} value={inputValue} name={queryParameter.name} onChange={e => handleChange(index,e)} required/>
                }
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
