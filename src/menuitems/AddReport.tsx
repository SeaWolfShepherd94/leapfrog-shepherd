import React, { useState, useEffect } from 'react';
import { useStyles } from '../hooks/useStyles';
import { Trans, useTranslation } from 'react-i18next';
import { useGlobalState } from '../components/GlobalState';
import { useHistory } from 'react-router-dom';
import { ReportTools } from '../components/ReportTools';

export const AddReport: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [newQuery, setNewQuery]: any = useState({});
  const [modelName, setModelName]: any = useGlobalState('modelName');
  const [properties, setProperties]: any = useGlobalState('properties');
  const [initialValue, setInitialValue]: any = useState({
    modelName: modelName,
    name: 'unknown report',
    description: 'description',
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
  const [disableHomeComponent, setDisableHomeComponent]: any = useGlobalState('disableHomeComponent');
  const [disableHomeLink, setDisableHomeLink]: any = useGlobalState('disableHomeLink');
  const [disableComponent, setDisableComponent]: any = useGlobalState('disableComponent');
  const [disableLink, setDisableLink]: any = useGlobalState('disableLink');
  const [disableSaveAsComponent, setDisableSaveAsComponent]: any = useGlobalState('disableSaveAsComponent');
  const [disableSaveAsLink, setDisableSaveAsLink]: any = useGlobalState('disableSaveAsLink');
  const [updatedParameters, setUpdatedParameters]: any = useGlobalState('updatedParameters');
  const [editableText, setEditableText]: any = useState({});
  const history: any = useHistory();
  const [updateAddReport, setUpdateAddReport]: any = useGlobalState('updateAddReport');

  useEffect(() => {
    const defaultProps = properties.slice(0, 10).map(function (property: any) {
      return property.name;
    });
    const obj = {
      modelName: modelName,
      name: 'unknown report',
      description: 'description',
      query: {
        languageVersion: 'v1',
        modelName: modelName,
        project: defaultProps
      }
    };
    setEditableText(obj);
    // eslint-disable-next-line
  }, [updateAddReport]);

  useEffect(() => {
    if (modelName === '') {
      history.goBack();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setNewQuery(queryComponent);
    // eslint-disable-next-line
  }, [queryComponent]);

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
    setRequestComponent({ queryName: '', pageSize: 10, rowOffset: 0, parameters: requestComponent.parameters });
    // eslint-disable-next-line
  }, []);

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

  useEffect(() => {
    if (modelName === '') return;
    setQueryComponent(editableText);
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
    const defaultProps = properties.slice(0, 10).map(function (property: any) {
      return property.name;
    });
    if (defaultProps.length === 0) return;
    setEditableText({
      ...initialValue,
      modelName: modelName,
      query: {
        languageVersion: 'v1',
        modelName: modelName,
        project: defaultProps
      }
    });
    setNewQuery({
      ...initialValue,
      modelName: modelName,
      query: {
        languageVersion: 'v1',
        modelName: modelName,
        project: defaultProps
      }
    });
    // eslint-disable-next-line
  }, [modelName, properties]);

  const handleClick = () => {
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
      <ReportTools />
      <br />
      <p
        onClick={handleClick}
        style={{
          textDecoration: 'underline',
          color: 'blue'
        }}
      >
        <Trans t={t}>properties</Trans>
      </p>
    </div>
  );
};
