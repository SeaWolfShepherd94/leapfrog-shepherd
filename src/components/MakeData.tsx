import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Table from './Table';
import { useAuth0 } from '@auth0/auth0-react';
import { baseURL } from '../menuitems/MenuItemTools';
import { useGlobalState } from './GlobalState';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from 'react-bootstrap/Button';
import Typography from '@material-ui/core/Typography';
import { Trans, useTranslation } from 'react-i18next';
import { useStyles } from '../hooks/useStyles';
import { StoredQueryDto } from '@physion/leapfrog-ts-api/dist/api';

export const MakeData: React.FC = () => {
  const { t } = useTranslation();
  const [rowCount, setRowCount] = useState(0);
  const [pageCount, setPageCount]: any = useGlobalState('pageCount');
  const [queryParameters, setQueryParameters]: any = useGlobalState('queryParameters');
  const [isParameter, setIsParameter] = useGlobalState('isParameter');
  const [isParameterChanged, setIsParameterChanged] = useGlobalState('isParameterChanged');
  const [parameterValues, setParameterValues]: any = useGlobalState('parameterValues');
  const [isServerDataSet, setIsServerDataSet]: any = useGlobalState('isServerDataSet');
  const [savedData, setSavedData] = useGlobalState('savedData');
  const [savedColumns, setSavedColumns]: any = useGlobalState('savedColumns');
  const [loading, setLoading] = useGlobalState('loading');
  const [csvData, setCsvData] = useGlobalState('csvData');
  const fetchIdRef = useRef(0);

  const initialDates: any[] = [];
  const [isDate, setIsDate]: any = useGlobalState('isDate');
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [dates, setDates]: any = useGlobalState('dates');

  const initialInputValues: any[] = [];
  const [inputValues, setInputValues]: any = useGlobalState('inputValues');

  const [queryData, setQueryData]: any = useGlobalState('queryData');
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [queryOptions, setQueryOptions]: any = useGlobalState('queryOptions');
  const [requestComponent, setRequestComponent]: any = useGlobalState('requestComponent');
  const [updatedParameters, setUpdatedParameters]: any = useGlobalState('updatedParameters');
  const { getAccessTokenSilently } = useAuth0();
  const [expanded, setExpanded] = React.useState('panel2');
  const [isDisabled, setIsDisabled]: any = useState(true);
  const [isBadRequest, setIsBadRequest]: any = useState(false);
  const classes = useStyles();
  const [storedquerydto, setStoredquerydto]: any = useGlobalState('storedquerydto');
  const [updateView, setUpdateView]: any = useState(false);

  async function getApiToken() {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    async function getData() {
      const headers = {
        Authorization: `Bearer ${await getApiToken()}`,
        'Access-Control-Allow-Origin': '*'
      };

      await axios.get(`${baseURL}/api/Queries`, { headers: headers }).then(response => {
        setQueryData(response.data);
      });
    }

    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    function setData() {
      const newArr: any = [];
      queryData.forEach((query: any, index: number) => {
        const option = {
          label: query.name,
          value: query.name,
          key: query.queryId
        };
        newArr.push(option);
      });
      setQueryOptions(newArr);
    }
    if (queryData.length > 0) {
      setData();
    }
    // eslint-disable-next-line
  }, [queryData]);

  const fetchAPIData = async ({ limit, skip }: any) => {
    if (Object.keys(queryComponent).length === 0) {
      return;
    }
    if (!isParameter) {
      return;
    }
    try {
      const headers = {
        Authorization: `Bearer ${await getApiToken()}`,
        'Access-Control-Allow-Origin': '*'
      };
      requestComponent.pageSize = limit;
      requestComponent.rowOffset = skip;
      const developmentQuery = { queryComponent: queryComponent, requestComponent: requestComponent };
      // request saved data to paginate
      await axios
        .post(`${baseURL}/api/Executive/development`, developmentQuery, { headers: headers })
        .then(response => {
          setIsBadRequest(false);
          setSavedData(response.data);
        });
    } catch (e) {
      setIsBadRequest(true);
      console.log('Error while fetching', e);
    }
  };

  const setCSV = async () => {
    const csvheaders = {
      Accept: 'text/csv',
      Authorization: `Bearer ${await getApiToken()}`,
      'Access-Control-Allow-Origin': '*'
    };
    const csvQuery: any = {
      queryComponent: queryComponent,
      requestComponent: { parameters: requestComponent.parameters }
    };
    await axios.post(`${baseURL}/api/Executive/development`, csvQuery, { headers: csvheaders }).then(response => {
      setCsvData(response.data);
    });
  };

  useEffect(() => {
    if (csvData.length > 0) {
      const csvbtn = document.getElementById('csv-btn');
      setTimeout(() => {
        csvbtn?.click();
        setCsvData([]);
      }, 1000);
    }
  }, [csvData]);

  const resetQuery = (name: string) => {
    if (isParameter) {
      setIsParameter(false);
    }
    if (isParameterChanged) {
      setIsParameterChanged(false);
    }
    if (isServerDataSet) {
      setIsServerDataSet(false);
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
    setRequestComponent({ queryName: name, pageSize: 10, rowOffset: 0, parameters: parameterValues });
  };

  useEffect(() => {
    if (!requestComponent.queryName) {
      return;
    }
    async function getData() {
      const headers = {
        Authorization: `Bearer ${await getApiToken()}`,
        'Access-Control-Allow-Origin': '*'
      };
      await axios.get(`${baseURL}/api/Queries/${requestComponent.queryName}`, { headers: headers }).then(response => {
        setQueryComponent(response.data);
        if (!response.data.parameters) {
          setIsParameterChanged(true);
          setIsParameter(true);
          return;
        }
        setQueryParameters(response.data.parameters);
        const parameters = response.data.parameters;
        const newArr: any = {};
        parameters.forEach((parameter: any) => {
          if (parameter.dataType === 'date') {
            const date = new Date();
            newArr[parameter.name] = moment(date).format('YYYY-MM-DD');
          } else {
            newArr[parameter.name] = '';
          }
        });
        parameters.forEach((parameter: any) => {
          if (parameter.dataType === 'date') {
            const date = new Date();
            setDates((dates: any) => [...dates, date]);
            setIsDate(true);
          } else {
            const inputValue = '';
            setInputValues((inputValues: any) => [...inputValues, inputValue]);
          }
        });
        setParameterValues(newArr);
      });
    }
    async function editData() {
      if (!queryComponent.parameters) {
        setIsParameterChanged(true);
        setIsParameter(true);
        setUpdatedParameters(false);
        return;
      }
      setExpanded('panel2');
      setIsDisabled(true);
      setQueryParameters(queryComponent.parameters);
      const parameters = queryComponent.parameters;
      const newArr: any = {};
      parameters.forEach((parameter: any) => {
        if (parameter.dataType === 'date') {
          const date = new Date();
          newArr[parameter.name] = moment(date).format('YYYY-MM-DD');
        } else {
          newArr[parameter.name] = '';
        }
      });
      parameters.forEach((parameter: any) => {
        if (parameter.dataType === 'date') {
          const date = new Date();
          setDates((dates: any) => [...dates, date]);
          setIsDate(true);
        } else {
          const inputValue = '';
          setInputValues((inputValues: any) => [...inputValues, inputValue]);
        }
      });
      setParameterValues(newArr);
      setUpdatedParameters(false);
    }
    async function postData() {
      if (Object.keys(queryComponent).length === 0) {
        return;
      }
      const developmentQuery = { queryComponent: queryComponent, requestComponent: requestComponent };
      const rowCountHeaders = {
        Accept: 'ovation/rowcount+json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getApiToken()}`
      };
      setStoredquerydto(StoredQueryDto.fromJson(JSON.stringify(queryComponent)));
      await axios
        .post(`${baseURL}/api/Executive/development`, developmentQuery, { headers: rowCountHeaders })
        .then(response => {
          if (response.data.count === 0) {
            setIsServerDataSet(false);
          } else {
            setIsServerDataSet(true);
          }
          setRowCount(response.data.count);
          setUpdateView(!updateView);
        })
        .catch(() => setIsBadRequest(true));
      setExpanded('panel1');
      setIsDisabled(false);
    }
    if (updatedParameters) {
      if (isParameter && isParameterChanged) {
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
  }, [requestComponent, isParameter, isParameterChanged, queryComponent]);

  const fetchData = React.useCallback(
    ({ pageSize, pageIndex }) => {
      if (!isParameter) {
        setIsServerDataSet(false);
        return;
      }
      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // Set the loading state
      setLoading(true);

      setTimeout(() => {
        // Only update the data if this is the latest fetch
        if (rowCount === 0) {
          return;
        }
        if (fetchId === fetchIdRef.current) {
          fetchAPIData({
            limit: pageSize,
            skip: pageSize * pageIndex
          });
          setPageCount(Math.ceil(rowCount / pageSize));

          const columns = queryComponent.query.project.map((item: any) => {
            if (typeof item === 'object') {
              const key = Object.keys(item)[0];
              return {
                Header: item[key][0],
                accessor: item[key][0]
              };
            } else {
              return {
                Header: item,
                accessor: item
              };
            }
          });

          columns.push({ Header: '', accessor: 'extra' });

          setSavedColumns(columns);

          setLoading(false);
        }
      }, 1000);
    },
    // eslint-disable-next-line
    [storedquerydto, updateView]
  );
  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === 'panel1'}
        disabled={isDisabled}
        classes={{ root: classes.fab, disabled: classes.disabled }}
      >
        <AccordionSummary aria-controls='panel1a-content' id='panel1a-header'>
          <Typography className={classes.heading}>
            <Trans t={t}>report</Trans>
          </Typography>
          <div style={{ marginLeft: 'auto' }}>
            <CSVLink
              data={csvData}
              filename={`${requestComponent.queryName}.csv`}
              target='_blank'
              style={{ display: 'none' }}
              id='csv-btn'
            />
            <Button
              onClick={() => {
                setCSV();
              }}
              style={{ display: isDisabled ? 'none' : 'block' }}
            >
              <Trans t={t}>export-to-csv</Trans>
            </Button>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          {isServerDataSet ? (
            <div>
              {isBadRequest ? (
                <div style={{ color: 'red' }}>
                  <Trans t={t}>bad-request</Trans>
                  <br />
                  <br />
                </div>
              ) : null}
              <Table
                columns={savedColumns}
                data={savedData}
                fetchData={fetchData}
                loading={loading}
                pageCount={pageCount}
              />
            </div>
          ) : (
            <Trans t={t}>empty-data-response</Trans>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
