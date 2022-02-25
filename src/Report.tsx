import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { RouterComponent } from './components/RouterComponent';
import { QueryParameters } from './components/QueryParameters';
import { MakeData } from './components/MakeData';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import JSONInput from 'react-json-editor-ajrm';
import Locale from './components/Locale';
import Colors from './components/Colors';
import { useGlobalState } from './components/GlobalState';
import { useEffect } from 'react';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { Trans, useTranslation } from 'react-i18next';
import { useStyles } from './hooks/useStyles';

function Report(props: any) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expanded, setExpanded] = useState('panel1');
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [initialValue, setInitialValue]: any = useGlobalState('queryComponent');
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [requestComponent, setRequestComponent]: any = useGlobalState('requestComponent');
  const [parameterValues, setParameterValues]: any = useGlobalState('parameterValues');
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
  const [newQuery, setNewQuery]: any = useState({});
  const [updatedParameters, setUpdatedParameters]: any = useGlobalState('updatedParameters');
  const [editorQuery, setEditorQuery]: any = useGlobalState('editorQuery');
  const [editableText, setEditableText]: any = useState({});
  const [disableComponent, setDisableComponent]: any = useGlobalState('disableComponent');
  const [disableLink, setDisableLink]: any = useGlobalState('disableLink');
  const [disableHomeComponent, setDisableHomeComponent]: any = useGlobalState('disableHomeComponent');
  const [disableHomeLink, setDisableHomeLink]: any = useGlobalState('disableHomeLink');
  const [disableSaveAsComponent, setDisableSaveAsComponent]: any = useGlobalState('disableSaveAsComponent');
  const [disableSaveAsLink, setDisableSaveAsLink]: any = useGlobalState('disableSaveAsLink');

  const [updateView, setUpdateView] = useState(false);
  const [updateQuery, setUpdateQuery] = useState(false);

  useEffect(() => {
    setEditorQuery(initialValue);
    // eslint-disable-next-line
  }, [updateView]);

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
    setRequestComponent({
      queryName: props.location.state.name,
      pageSize: 10,
      rowOffset: 0,
      parameters: parameterValues
    });
    // eslint-disable-next-line
  }, [updateQuery]);

  useEffect(() => {
    if (Object.keys(queryComponent).length > 0) {
      setQueryComponent({});
    }
    setUpdateQuery(!updateQuery);
    setDisableComponent(false);
    setDisableLink('auto');
    setDisableHomeComponent(false);
    setDisableHomeLink('auto');
    setDisableSaveAsComponent(false);
    setDisableSaveAsLink('auto');
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setEditorQuery(editableText);
    // eslint-disable-next-line
  }, [editableText]);

  const handleChange = (event: any) => {
    // checks the JSON syntax
    try {
      setNewQuery(JSON.parse(event.json));
    } catch {
      // does nothing
    }
  };

  const handleNameChange = (event: any) => {
    setEditableText({ ...editorQuery, name: event.value });
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
    if (Object.keys(newQuery).length === 0) {
      return;
    }
    if (JSON.stringify(queryComponent.parameters) !== JSON.stringify(newQuery.parameters)) {
      setUpdatedParameters(true);
    }
    if (!newQuery.parameters) {
      setQueryParameters([]);
    }
    event.preventDefault();
    setQueryComponent(newQuery);
    event.target.style.backgroundColor = 'black';
    setTimeout(() => {
      event.target.style.backgroundColor = '#4001FF';
    }, 100);
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
      <Accordion expanded={expanded === 'panel2'}>
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
            <div style={{ display: 'inline-block' }}>
              <JSONInput
                id='a_unique_id'
                colors={Colors}
                locale={Locale}
                placeholder={editorQuery}
                height='550px'
                max-width='100%'
                onChange={handleChange}
                style={{ body: { fontSize: '14px' } }}
              />
            </div>
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
                value='Apply Changes'
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
      <br />
      <RouterComponent />
      <QueryParameters />
      <br />
      <MakeData />
    </div>
  );
}

export default Report;
