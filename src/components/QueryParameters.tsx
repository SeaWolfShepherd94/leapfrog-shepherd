import React, { useState, useEffect } from 'react';
import { useGlobalState } from './GlobalState';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Trans, useTranslation } from 'react-i18next';
import { useStyles } from '../hooks/useStyles';

export const QueryParameters: React.FC = () => {
  const { t } = useTranslation();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [expanded, setExpanded] = useState('panel2');
  const [requestComponent, setRequestComponent]: any = useGlobalState('requestComponent');
  const [queryComponent, setQueryComponent]: any = useGlobalState('queryComponent');
  const [queryParameters, setQueryParameters]: any = useGlobalState('queryParameters');
  const [parameterValues, setParameterValues]: any = useGlobalState('parameterValues');
  const [isParameter, setIsParameter] = useGlobalState('isParameter');
  const [isParameterChanged, setIsParameterChanged] = useGlobalState('isParameterChanged');
  const [isDate, setIsDate]: any = useGlobalState('isDate');
  const [dates, setDates]: any = useGlobalState('dates');
  const [inputValue, setInputValue] = useGlobalState('inputValue');
  const [inputValues, setInputValues]: any = useGlobalState('inputValues');
  const [filledInputValues, setFilledInputValues]: any = useGlobalState('filledInputValues');
  const [isDisabled, setIsDisabled]: any = useState(true);
  const classes = useStyles();

  useEffect(() => {
    setFilledInputValues(0);
    queryParameters.forEach((queryParameter: any, index: number) => {
      let count = 0;
      if (queryParameter.dataType === 'date' && isDate) {
        count += index + 1;
        setFilledInputValues(count);
      }
    });
    // eslint-disable-next-line
  }, [queryComponent]);

  useEffect(() => {
    if (queryParameters.length === 0) {
      setExpanded('panel2');
      setIsDisabled(true);
    } else {
      setExpanded('panel1');
      setIsDisabled(false);
    }
    // eslint-disable-next-line
  }, [queryParameters.length]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    requestComponent.parameters = parameterValues;
    setIsParameterChanged(true);
    setIsParameter(true);
  };

  const handleDate = (date: any, event: any, index: number, name: string) => {
    if (isParameterChanged) {
      setIsParameterChanged(false);
    }
    setDates([...dates.slice(0, index), date, ...dates.slice(index + 1)]);
    parameterValues[name] = moment(date).format('YYYY-MM-DD');
  };

  const handleChange = (index: number, event: any) => {
    if (isParameterChanged) {
      setIsParameterChanged(false);
    }
    setInputValues([...inputValues.slice(0, index), inputValue, ...inputValues.slice(index + 1)]);
    if (parameterValues[event.target.name] === '') {
      setFilledInputValues(filledInputValues + 1);
    }
    if (event.target.value === '') {
      setFilledInputValues(filledInputValues - 1);
    }
    parameterValues[event.target.name] = event.target.value;
  };

  return (
    <div>
      {queryParameters.length > 0 ? (
        <>
          <Accordion expanded={expanded === 'panel1'}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel2a-content'
              id='panel2a-header'
              style={{ overflow: 'auto' }}
              onClick={e => {
                expanded === 'panel1' ? setExpanded('panel2') : setExpanded('panel1');
              }}
            >
              <Typography className={classes.heading}>
                <Trans t={t}>filters</Trans>
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details} style={{ overflow: 'auto' }}>
              {filledInputValues < Object.keys(parameterValues).length ? (
                <div>
                  <p>
                    <Trans t={t}>required-filters</Trans>
                  </p>
                </div>
              ) : null}
              <form
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                {queryParameters.map((queryParameter: any, index: number) => {
                  return (
                    <div key={index} style={{ width: '50%', display: 'inline-block', minWidth: '75px' }}>
                      <p style={{ marginBottom: 5 }} title={queryParameter.description}>
                        {queryParameter.name}
                      </p>
                      {queryParameter.dataType === 'date' && isDate ? (
                        <DatePicker
                          selected={dates[index]}
                          onChange={(date, event) => {
                            handleDate(date, event, index, queryParameter.name);
                          }}
                        />
                      ) : (
                        <input
                          style={{ width: '50%', display: 'inline-block' }}
                          key={index}
                          defaultValue={inputValues[index] || ''}
                          name={queryParameter.name}
                          onChange={e => handleChange(index, e)}
                          required
                        />
                      )}
                    </div>
                  );
                })}
                <br />
                <br />
                <button type='submit'>
                  <Trans t={t}>submit</Trans>
                </button>
              </form>
              <br />
            </AccordionDetails>
          </Accordion>
        </>
      ) : null}
    </div>
  );
};
