import { useState, useEffect, createRef } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { Trans, useTranslation } from 'react-i18next';
import { useStyles } from '../hooks/useStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import JSONInput from 'react-json-editor-ajrm';
import Locale from './Locale';
import Colors from './Colors';
import { useGlobalState } from './GlobalState';
import { RouterComponent } from '../components/RouterComponent';
import { QueryParameters } from '../components/QueryParameters';
import { MakeData } from '../components/MakeData';
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import Ajv from "ajv";
import ace from "brace";
import "brace/mode/json";
import "brace/theme/github";
const ajv = new Ajv({ allErrors: true, verbose: true });
const json = {
  paymentId: "int_2019092712173302010099020003_5631456419257906",
  requestId: "2019092712201901011099020005_5631456419257906",
  userIpAddress: "123.90.0.1",
  userType: "",
  card: {
    cardToken: "",
    expirationMonth: "05",
    expirationYear: "2019",
    cardType: "CREDIT",
    bin: "123456",
    cardBrand: "LOCAL BRAND",
    issuingOrganization: "",
    cardCategory: "UATP",
    issuingCountryCode: "NI",
    issuingOrgWebsite: "",
    issuingOrgPhone: "",
    panReserved: "14",
    commercial: "COMMERCIAL",
    regulated: "N"
  },
  billTo: {
    firstName: "Jim",
    lastName: "He",
    street1: "",
    street2: "",
    city: "Shanghai",
    state: "Shanghai",
    postalCode: "201304",
    country: "CN",
    email: "jim631@sina.com"
  },
  merchant: {
    id: "19621303213"
  }
};

export function ReportTools() {
  const test = createRef<any>();
  const { t } = useTranslation();
  const classes = useStyles();
  const [expanded, setExpanded] = useState('panel1');
  const [newQuery, setNewQuery]: any = useState({});
  const [updateView, setUpdateView] = useState(false);
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [isParameter, setIsParameter] = useGlobalState('isParameter');
  const [queryParameters, setQueryParameters]: any = useGlobalState('queryParameters');
  const [updatedParameters, setUpdatedParameters]: any = useGlobalState('updatedParameters');
  const [modelName, setModelName]: any = useGlobalState('modelName');
  const [updateAddReport, setUpdateAddReport]: any = useGlobalState('updateAddReport');
  const [editorQuery, setEditorQuery]: any = useState({});

  const handleJSONChange = (v: any) => {
    console.log(v);
  };

  useEffect(() => {
    if (modelName !== '') {
      setUpdateAddReport(!updateAddReport);
      return;
    }
    if (isParameter) setIsParameter(false);
    if (Object.keys(queryComponent).length > 0) setQueryComponent({});
    // eslint-disable-next-line
  }, [updateView]);

  useEffect(() => {
    if (Object.keys(queryComponent).length === 0) return;
    test.current.jsonEditor.set(queryComponent);
    setEditorQuery(queryComponent);
  }, [queryComponent]);

  const handleChange = (event: any) => {
    // checks the JSON syntax
    try {
      setNewQuery(JSON.parse(event.json));
    } catch {
      // does nothing
    }
  };

  const handleDiscard = (event: any) => {
    if (Object.keys(newQuery).length > 0) setNewQuery({});
    else return;
    setUpdateView(!updateView);
    event.target.style.backgroundColor = 'black';
    setTimeout(() => {
      event.target.style.backgroundColor = '#4001FF';
    }, 1000);
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
    }, 1000);
  };

  return (
    <div>
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
      <br />
      <RouterComponent />
      <QueryParameters />
      <br />
      <MakeData />
      <div className='jsoneditor'>
        <Editor
          value={json}
          onChange={handleJSONChange}
          ace={ace}
          theme="ace/theme/github"
          ref={test}
          mode="code"
        />
      </div>
    </div>
  );
}
