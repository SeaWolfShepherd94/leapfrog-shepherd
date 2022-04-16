import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useGlobalState } from './GlobalState';
import { useEffect } from 'react';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { useStyles } from '../hooks/useStyles';
import { ReportTools } from '../components/ReportTools';

function Report(props: any) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState('panel1');
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [requestComponent, setRequestComponent]: any = useGlobalState('requestComponent');
  const [parameterValues, setParameterValues]: any = useGlobalState('parameterValues');
  const [isParameter, setIsParameter] = useGlobalState('isParameter');
  const [isParameterChanged, setIsParameterChanged] = useGlobalState('isParameterChanged');
  const [isServerDataSet, setIsServerDataSet] = useGlobalState('isServerDataSet');
  const [savedData, setSavedData] = useGlobalState('savedData');
  const [pageCount, setPageCount]: any = useGlobalState('pageCount');
  const [loading, setLoading] = useGlobalState('loading');
  const [csvData, setCsvData] = useGlobalState('csvData');
  const [queryParameters, setQueryParameters]: any = useGlobalState('queryParameters');
  const [savedColumns, setSavedColumns]: any = useGlobalState('savedColumns');
  const [isDate, setIsDate]: any = useGlobalState('isDate');
  const [dates, setDates]: any = useGlobalState('dates');
  const initialInputValues: any[] = [];
  const [inputValues, setInputValues]: any = useGlobalState('inputValues');
  const initialDates: any[] = [];
  const [disableComponent, setDisableComponent]: any = useGlobalState('disableComponent');
  const [disableLink, setDisableLink]: any = useGlobalState('disableLink');
  const [disableHomeComponent, setDisableHomeComponent]: any = useGlobalState('disableHomeComponent');
  const [disableHomeLink, setDisableHomeLink]: any = useGlobalState('disableHomeLink');
  const [disableSaveAsComponent, setDisableSaveAsComponent]: any = useGlobalState('disableSaveAsComponent');
  const [disableSaveAsLink, setDisableSaveAsLink]: any = useGlobalState('disableSaveAsLink');

  useEffect(() => {
    if (isParameter) setIsParameter(false);
    if (Object.keys(queryComponent).length > 0) setQueryComponent({});
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
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
    setRequestComponent({
      queryName: props.location.state.name,
      pageSize: 10,
      rowOffset: 0,
      parameters: parameterValues
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Object.keys(queryComponent).length > 0) {
      setQueryComponent({});
    }
    setDisableComponent(false);
    setDisableLink('auto');
    setDisableHomeComponent(false);
    setDisableHomeLink('auto');
    setDisableSaveAsComponent(false);
    setDisableSaveAsLink('auto');
    // eslint-disable-next-line
  }, []);

  const handleNameChange = (event: any) => {
    setQueryComponent({ ...queryComponent, name: event.value });
  };

  return (
    <div>
      <EditText
        type='text'
        defaultValue={props.location.state.name}
        onSave={e => {
          handleNameChange(e);
        }}
        style={{ color: 'grey', width: '25%', fontWeight: 'bold', fontSize: '18px' }}
      />
      <ReportTools />
    </div>
  );
}

export default Report;
