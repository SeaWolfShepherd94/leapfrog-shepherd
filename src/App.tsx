import React, { useState, useEffect, useRef }  from "react";
import axios from 'axios';
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import Styles from './Styles';
import Table from './Table';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { createGlobalState } from 'react-hooks-global-state';
import JSONInput from 'react-json-editor-ajrm';
import Locale from './Locale';
import Colors from './Colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

const baseURL = "https://localhost:5001";

const BEARER_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MzA1MTg1MTIsImV4cCI6MTYzMDYwNDkxMiwiaXNzIjoiTGVhcEZyb2cgQmFja2Rvb3IgSXNzdWVyIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSIsInN1YiI6Im1hdHRAb3ZhdGlvbi5pbyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJtYXR0QG92YXRpb24uaW8iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiY3M6YWNjZXNzIiwibW9kZWw6d3JpdGUiXX0.R2vroQY7BfObJqSpZBwePIuEH1y_JslsBzPyQQPIfak';

const initialState = { queryComponent: {}, requestComponent: {}, updatedParameters: false, queryData: []};
const { useGlobalState } = createGlobalState(initialState);

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function AddQuery() {

  const history = useHistory();

  const [newQuery, setNewQuery]: any = useState({});
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [requestComponent, setRequestComponent]: any = useGlobalState('requestComponent');
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [queryData, setQueryData]: any = useGlobalState('queryData');

  const handleChange = (event: any) => {
    // checks the JSON syntax
    try {
      setNewQuery(JSON.parse(event.json));
    } catch {
      // does nothing
    }
  }

  const handleSubmit = (event: any) => {
    const headers = {
      'Authorization': `Bearer ${BEARER_TOKEN}`
    }
    axios
      .post(`${baseURL}/api/Queries`, newQuery, {headers:headers});
    axios
      .get(`${baseURL}/api/Queries`, {headers:headers})
      .then((response) => {
        setQueryData(response.data);
      });
    setRequestComponent({"queryName": newQuery.name,"pageSize": 10,"rowOffset": 0,"parameters": newQuery.parameters, "order": ["identifier"]});
    event.preventDefault();
    history.goBack();
  }

  return (
    <div>
      <h2>Add Query</h2>
      <form onSubmit={e => {handleSubmit(e)}}>
        <JSONInput
          id          = 'a_unique_id'
          placeholder = { {} }
          colors      = { Colors }
          locale      = { Locale }
          height      = '550px'
          onChange    = {handleChange}
        />
        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}

function Edit(props: any) {
  return (
    <div>
      <h2>Edit</h2>
    </div>
  );
}

function Child(props: any) {
  const history = useHistory();
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.

  const [newQuery, setNewQuery]: any = useState({});
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [updatedParameters, setUpdatedParameters]: any = useGlobalState('updatedParameters');

  useEffect(() => {
    if (props.location.state) {
      setNewQuery(props.location.state.queryComponent);
    }
  },[props.location.state]);

  if (!props.location.state) {
    return (<div />);
  }

  const handleChange = (event: any) => {
    // checks the JSON syntax
    try {
      setNewQuery(JSON.parse(event.json));
    } catch {
      // does nothing
    }
  }

  const handleCopy = (event: any) => {
    const headers = {
      'Authorization': `Bearer ${BEARER_TOKEN}`
    }
    axios
      .post(`${baseURL}/api/Queries`, newQuery, {headers:headers});
      history.goBack();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
  }

  const handleSubmit = (event: any) => {
    if (JSON.stringify(queryComponent.parameters) !== JSON.stringify(newQuery.parameters)) {
      setUpdatedParameters(true);
    }
    event.preventDefault();
    setQueryComponent(newQuery);
    history.goBack();
  }

  return (
    <div>
      <h3>Edit: {props.location.state.name}</h3>
      <form onSubmit={e => {handleSubmit(e)}}>
        <JSONInput
          id          = 'a_unique_id'
          placeholder = { queryComponent }
          colors      = { Colors }
          locale      = { Locale }
          height      = '550px'
          onChange    = {handleChange}
        />
        <input type="button" name="Save as" value="Save as" onClick={handleCopy} />
        <br />
        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}

function App() {
  const [pageCount, setPageCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [queryParameters, setQueryParameters]: any = useState([]);
  const [isParameter, setIsParameter] = useState(false);
  const [isParameterChanged, setIsParameterChanged] = useState(false);
  const [parameterValues, setParameterValues]: any = useState({});
  const [serverData, setServerData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [savedColumns, setSavedColumns]: any = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const fetchIdRef = useRef(0);

  const initialDates: any[] = [];
  const [isDate, setIsDate]: any = useState(0);
  const [dates, setDates]: any = useState([]);

  const [inputValue, setInputValue] = useState("");
  const initialInputValues: any[] = [];
  const [inputValues, setInputValues]: any = useState([]);

  const [queryData, setQueryData]: any = useGlobalState('queryData');
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [requestComponent, setRequestComponent]: any = useGlobalState('requestComponent');
  const [updatedParameters, setUpdatedParameters]: any = useGlobalState('updatedParameters');

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

  const fetchAPIData = async ({ limit, skip }: any) => {
    if (Object.keys(queryComponent).length === 0) {
      return;
    }
    try {
      const csvheaders = {
        'Accept': 'text/csv',
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      const headers = {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      requestComponent.pageSize = limit;
      requestComponent.rowOffset = skip;
      const developmentQuery = {"queryComponent": queryComponent, "requestComponent": requestComponent}
      // request saved data to paginate
      await axios
        .post(`${baseURL}/api/Executive/development`, developmentQuery, {headers:headers})
        .then((response) => {
          setSavedData(response.data);
        });
      // request csv data
      const csvQuery: any = {"queryComponent": queryComponent, "requestComponent": {"parameters": requestComponent.parameters, "order": ["identifier"]}};
      await axios
        .post(`${baseURL}/api/Executive/development`, csvQuery, {headers:csvheaders})
        .then((response) => {
          setCsvData(response.data);
        });
    } catch (e) {
      console.log("Error while fetching", e)
    }
  }

  const resetQuery = (name: string) => {
    if (isParameter) {
      setIsParameter(false);
    }
    if (isParameterChanged) {
      setIsParameterChanged(false);
    }
    if (savedData.length > 0) {
      setSavedData([]);
    }
    if (pageCount > 0) {
      setPageCount(0);
    }
    if (!loading) {
      setLoading(true);
    }
    if (csvData.length > 0) {
      setCsvData([]);
    }
    if (queryParameters.length > 0) {
      setQueryParameters([]);
    }
    if (savedColumns.length > 0) {
      setSavedColumns([]);
    }
    if (isDate) {
      setIsDate(false);
      setDates([...initialDates]);
    } else {
      setInputValues([...initialInputValues]);
    }
    setRequestComponent({"queryName": name,"pageSize": 10,"rowOffset": 0,"parameters": parameterValues, "order": ["identifier"]});
  }

  useEffect(() => {
    if (!requestComponent.queryName) {
      return;
    }
    async function getData() {
      const headers = {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      await axios
        .get(`${baseURL}/api/Queries/${requestComponent.queryName}`, {headers:headers})
        .then((response) => {
          setQueryComponent(response.data);
          if(!response.data.parameters) {
            setIsParameterChanged(true);
            setIsParameter(true);
            return;
          }
          setQueryParameters(response.data.parameters);
          const parameters = response.data.parameters;
          const newArr: any = {};
          parameters.forEach((parameter: any) => {
            if (parameter.dataType === "date") {
              const date = new Date();
              newArr[parameter.name] = moment(date).format('YYYY-MM-DD');
            } else {
              newArr[parameter.name] = "";
            }
          });
          parameters.forEach((parameter: any) => {
            if (parameter.dataType === "date") {
              const date = new Date();
              setDates((dates: any)=>([
                ...dates,
                date
              ]));
              setIsDate(true);
            } else {
              const inputValue = "";
              setInputValues((inputValues: any)=>([
                ...inputValues,
                inputValue
              ]));
            }
          });
          setParameterValues(newArr);
        });
    }
    async function editData() {
      const headers = {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      if(!queryComponent.parameters) {
        setIsParameterChanged(true);
        setIsParameter(true);
        setUpdatedParameters(false);
        return;
      }
      setQueryParameters(queryComponent.parameters);
      const parameters = queryComponent.parameters;
      const newArr: any = {};
      parameters.forEach((parameter: any) => {
        if (parameter.dataType === "date") {
          const date = new Date();
          newArr[parameter.name] = moment(date).format('YYYY-MM-DD');
        } else {
          newArr[parameter.name] = "";
        }
      });
      parameters.forEach((parameter: any) => {
        if (parameter.dataType === "date") {
          const date = new Date();
          setDates((dates: any)=>([
            ...dates,
            date
          ]));
          setIsDate(true);
        } else {
          const inputValue = "";
          setInputValues((inputValues: any)=>([
            ...inputValues,
            inputValue
          ]));
        }
      });
      setParameterValues(newArr);
      setUpdatedParameters(false);
    }
    async function postData() {
      if (Object.keys(queryComponent).length === 0) {
        return;
      }
      const headers = {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      const developmentQuery = {"queryComponent": queryComponent, "requestComponent": requestComponent}
      await axios
        .post(`${baseURL}/api/Executive/development`, developmentQuery, {headers:headers})
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
      const rowCountHeaders = {
        'Accept': 'ovation/rowcount+json',
        "Content-Type": "application/json",
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
      await axios
        .post(`${baseURL}/api/Executive/development`, developmentQuery, {headers:rowCountHeaders})
        .then((response) => {
          setRowCount(response.data.count);
        });
      }
      if (updatedParameters) {
        if(isParameter && isParameterChanged) {
          resetQuery(queryComponent.name);
        } else {
          editData();
        }
      } else {
        if (!isParameter && Object.keys(queryComponent).length === 0) {
          getData();
        } else if (isParameter && isParameterChanged) {
          postData();
        }
      }
    // eslint-disable-next-line
  }, [requestComponent,isParameter,isParameterChanged,queryComponent]);

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
  }, [serverData, rowCount]);

  const updateQuery = (event: any) => {
    if (event.target.value) {
      if (Object.keys(queryComponent).length > 0) {
        setQueryComponent({});
      }
      resetQuery(event.target.value);
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    requestComponent.parameters = parameterValues;
    setIsParameterChanged(true);
    setIsParameter(true);
  }

  const handleChange = (index: number, event: any) => {
    if (isParameterChanged) {
      setIsParameterChanged(false);
    }
    setInputValues([
      ...inputValues.slice(0,index),
      inputValue,
      ...inputValues.slice(index+1)
    ]);
    parameterValues[event.target.name] = event.target.value;
  }

  const handleDate = (date: any, event: any, index: number, name: string) => {
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: any, index: number) => {
    console.log(index);
    handleClose();
  }

  const options = [
    'Home',
    'Edit',
    'Add Query',
  ];

  return (
    <Styles>
      <img alt="Ovation.io" src="https://www.ovation.io/wp-content/webpc-passthru.php?src=https://www.ovation.io/wp-content/uploads/2021/07/ovationlogo@2x.png&nocache=1"/>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        style={{position: 'absolute',right: 5,top: 5,}}
        onClick={e => {handleClick(e)}}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to={{
                pathname: "/edit",
                state: { name: `${requestComponent.queryName}`, queryComponent: queryComponent }
              }}>Edit</Link>
            </li>
            <li>
              <Link to="/add-query">Add Query</Link>
            </li>
          </ul>
          <Route path="/edit/:id" children={(props) => <Child {...props}/>} />

          <hr />

          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/edit/:id">
              <Edit />
            </Route>
            <Route path="/add-query/">
              <AddQuery />
            </Route>
          </Switch>
        </div>
      </Router>
      <label>
        Pick a query:
        <select onChange={e => updateQuery(e)} style={{ marginLeft: 5, marginBottom: 5}}>
          <option key="" value="">
            Select
          </option>
          {queryData.map(({ name, queryId }: any) => (
          <option key={queryId} value={name}>
            {name}
            </option>
            ))}
        </select>
      </label>
      {
        queryParameters.length > 0 ?
        <>
        <form onSubmit={e => {handleSubmit(e)}}>
          {queryParameters.map((queryParameter: any, index: number) => {
            return (
              <div key={index}>
                <p  style={{ marginBottom: 5}}>{queryParameter.name}</p>
                {
                  queryParameter.dataType === "date" && isDate ?
                  <DatePicker selected={dates[index]} onChange={(date,event) => {handleDate(date,event,index,queryParameter.name)}} />
                  : <input key={index} defaultValue={inputValues[index] || ""} name={queryParameter.name} onChange={e => handleChange(index,e)} required/>
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
  );
}

export default App;
