import styled from 'styled-components';

const Styles = styled.div`
  font-family: gt_americaregular, sans-serif;

  .drag-drop-zone {
    box-shadow: 5px 5px 10px #c0c0c0;
  }

  .drag-drop-zone.inside-drag-area {
    opacity: 0.7;
  }

  .jsoneditor{
    height: 550px !important;
    max-width: '100%' !important;
  }

  .header {
    display: flex;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
  }

  button:not(.IconButton):not(.editor-button):not(.react-datepicker button):not(.pagination-button),
  .button {
    background-color: #4001ff;
    font-family: gt_americabold, sans-serif;
    font-size: 18px;
    color: #fff;
    border: none;
    padding: 10px 10px;
    border-radius: 5px;
    cursor: pointer;
  }

  .editor-button {
    background-color: #4001ff;
    font-family: gt_americabold, sans-serif;
    font-size: 18px;
    color: #fff;
    border: none;
    padding: 10px 10px;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
  }

  .react-datepicker button {
    padding: 10px 10px;
    background-color: #4001ff;
  }

  .react-datepicker__input-container input {
    width: 50%;
    display: inline-block;
  }

  .pagination-button {
    background-color: #fff;
    color: #000;
    font-family: gt_americabold, sans-serif;
    font-size: 18px;
    border: 1px solid #edf2f7;
    padding: 10px 14px;
    border-radius: 5px;
    cursor: pointer;
  }

  padding: 1rem;
  display: block;
  max-width: 100%;

  .tableWrap {
    overflow-y: auto;
    height: auto;
    padding: 16px;
    padding-right: 16px;
    border: 1px solid #edf2f7;
    background-color: #edf2f7;
  }

  .child {
    display: inline-block;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #edf2f7;
    border-spacing: 0;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    thead {
      position: sticky;
      top: 0;
      background-color: white;
    }

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #edf2f7;
      border-right: 1px solid #edf2f7;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      white-space: nowrap;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

export default Styles;
