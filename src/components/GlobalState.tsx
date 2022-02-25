import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  serverData: [],
  savedData: [],
  savedColumns: [],
  loading: false,
  csvData: [],
  pageCount: 0,
  editorQuery: {},
  queryComponent: {},
  requestComponent: {},
  updatedParameters: false,
  queryParameters: [],
  queryOptions: [],
  modelOptions: [],
  parameterValues: {},
  isParameter: false,
  isParameterChanged: false,
  isDate: false,
  dates: [],
  inputValue: '',
  inputValues: [],
  filledInputValues: 0,
  queryData: [],
  modelData: [],
  disableComponent: false,
  disableLink: 'auto',
  disableSaveAsComponent: false,
  disableSaveAsLink: 'auto',
  disableEditComponent: true,
  disableEditLink: 'none',
  disableHomeComponent: true,
  disableHomeLink: 'none',
  saveModalIsOpen: false,
  saveAsModalIsOpen: false,
  addReportModalIsOpen: false,
  modelName: '',
  properties: [],
  updatePage: false,
  propertyData: [],
  editableText: {},
  isSorted: false,
  isSortedDesc: false,
  defaultOrder: '' || {},
  sortedValue: '',
  updateView: false,
  aggregatedColumns: [],
  aggregatedValues: [],
  anchorEl: null,
  columnHeader: '' || {},
  columnIndex: -1
};
export const { useGlobalState } = createGlobalState(initialState);
