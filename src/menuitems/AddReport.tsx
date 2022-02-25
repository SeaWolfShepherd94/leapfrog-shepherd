import React, { useState, useEffect } from 'react';
import { useStyles } from '../hooks/useStyles';
import { Trans, useTranslation } from 'react-i18next';
import { useGlobalState } from '../components/GlobalState';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import JSONInput from 'react-json-editor-ajrm';
import Locale from '../components/Locale';
import Colors from '../components/Colors';
import { RouterComponent } from '../components/RouterComponent';
import { QueryParameters } from '../components/QueryParameters';
import { MakeData } from '../components/MakeData';
import { useHistory } from 'react-router-dom';

export const AddReport: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [newQuery, setNewQuery]: any = useState({});
  const [expanded, setExpanded] = useState('panel1');
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [modelName, setModelName]: any = useGlobalState('modelName');
  const [properties, setProperties]: any = useGlobalState('properties');
  const [initialValue, setInitialValue]: any = useState({
    modelName: modelName,
    name: 'unknown report',
    description: '',
    query: {
      languageVersion: 'v1',
      modelName: modelName,
      project: []
    }
  });
  const [requestComponent, setRequestComponent]: any = useGlobalState('requestComponent');
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [isParameter, setIsParameter] = useGlobalState('isParameter');
  const [isParameterChanged, setIsParameterChanged] = useGlobalState('isParameterChanged');
  const [serverData, setServerData] = useGlobalState('serverData');
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
  const [disableHomeComponent, setDisableHomeComponent]: any = useGlobalState('disableHomeComponent');
  const [disableHomeLink, setDisableHomeLink]: any = useGlobalState('disableHomeLink');
  const [disableComponent, setDisableComponent]: any = useGlobalState('disableComponent');
  const [disableLink, setDisableLink]: any = useGlobalState('disableLink');
  const [disableSaveAsComponent, setDisableSaveAsComponent]: any = useGlobalState('disableSaveAsComponent');
  const [disableSaveAsLink, setDisableSaveAsLink]: any = useGlobalState('disableSaveAsLink');
  const [updatedParameters, setUpdatedParameters]: any = useGlobalState('updatedParameters');
  const [editorQuery, setEditorQuery]: any = useGlobalState('editorQuery');
  const [updateQuery, setUpdateQuery] = useState(false);
  const [editableText, setEditableText]: any = useState({});
  const history: any = useHistory();
  const [updateView, setUpdateView] = useState(false);

  useEffect(() => {
    setEditorQuery(initialValue);
    // eslint-disable-next-line
  }, [updateView]);

  useEffect(() => {
    if (modelName === '') {
      history.goBack();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (window.location.pathname !== '/add-report') {
      setModelName('');
      setProperties([]);
    }
    // eslint-disable-next-line
  }, [window.location]);

  useEffect(() => {
    if (isParameter) {
      setIsParameter(false);
    }
    if (isParameterChanged) {
      setIsParameterChanged(false);
    }
    if (serverData.length > 0) {
      setServerData([]);
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
    setRequestComponent({ queryName: '', pageSize: 10, rowOffset: 0, parameters: requestComponent.parameters });
    // eslint-disable-next-line
  }, [updateQuery]);

  useEffect(() => {
    if (modelName === '') return;
    setUpdatedParameters(true);
    setQueryComponent(initialValue);
    setRequestComponent({
      queryName: initialValue.name,
      pageSize: 10,
      rowOffset: 0,
      parameters: initialValue.parameters
    });
    setDisableHomeComponent(false);
    setDisableHomeLink('auto');
    setDisableSaveAsComponent(false);
    setDisableSaveAsLink('auto');
    setDisableComponent(true);
    setDisableLink('none');
    // eslint-disable-next-line
  }, []);

  const handleChange = (event: any) => {
    // checks the JSON syntax
    try {
      setNewQuery(JSON.parse(event.json));
    } catch {
      // do nothing
    }
  };

  const handleDiscard = (event: any) => {
    setEditorQuery({});
    setUpdateView(!updateView);
    event.target.style.backgroundColor = 'black';
    setTimeout(() => {
      event.target.style.backgroundColor = '#4001FF';
    }, 100);
  };

  const handleSubmit = (event: any) => {
    setDisableSaveAsComponent(false);
    setDisableSaveAsLink('auto');
    setUpdatedParameters(true);
    if (!newQuery.parameters) {
      setQueryParameters([]);
    }
    event.preventDefault();
    console.log(newQuery);
    setQueryComponent(newQuery);
    setEditorQuery(newQuery);
    setRequestComponent({ queryName: newQuery.name, pageSize: 10, rowOffset: 0, parameters: newQuery.parameters });
    event.target.style.backgroundColor = 'black';
    setTimeout(() => {
      event.target.style.backgroundColor = '#4001FF';
    }, 100);
  };

  useEffect(() => {
    if (modelName === '') return;
    setEditorQuery(editableText);
    setUpdatedParameters(true);
    setQueryComponent(editableText);
    setRequestComponent({
      queryName: editableText.name,
      pageSize: 10,
      rowOffset: 0,
      parameters: initialValue.parameters
    });
    // eslint-disable-next-line
  }, [editableText]);

  useEffect(() => {
    setEditableText({
      ...initialValue,
      modelName: modelName,
      query: {
        languageVersion: 'v1',
        modelName: modelName,
        project: []
      }
    });
    // eslint-disable-next-line
  }, [modelName, properties]);

  const handleClick = (event: any) => {
    const myjson = JSON.stringify(properties, null, 2);
    const x: Window | null = window.open();
    if (x) {
      x.document.open();
      x.document.write('<html><body><pre>' + myjson + '</pre></body></html>');
      x.document.close();
    }
  };

  return (
    <div className={classes.root}>
      <h2>
        <Trans t={t}>add-report</Trans>
      </h2>
      <button onClick={handleClick}>
        <Trans t={t}>properties</Trans>
      </button>
      <Accordion expanded={expanded === 'panel1'}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
          style={{ overflow: 'auto' }}
          onClick={e => {
            expanded === 'panel1' ? setExpanded('panel2') : setExpanded('panel1');
          }}
        >
          <Typography className={classes.heading}>
            <Trans t={t}>json-editor</Trans>
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ overflow: 'auto' }}>
          <div>
            <JSONInput
              id='a_unique_id'
              placeholder={editorQuery}
              colors={Colors}
              locale={Locale}
              height='550px'
              max-width='100%'
              onChange={handleChange}
              style={{ body: { fontSize: '14px' } }}
            />
            <br />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={{ marginRight: 5 }}
                className='editor-button'
                onClick={e => {
                  handleDiscard(e);
                }}
              >
                <Trans t={t}>discard-changes</Trans>
              </button>
              <button
                className='editor-button'
                onClick={e => {
                  handleSubmit(e);
                }}
              >
                <Trans t={t}>apply-changes</Trans>
              </button>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <RouterComponent />
      <QueryParameters />
      <MakeData />
    </div>
  );
};
