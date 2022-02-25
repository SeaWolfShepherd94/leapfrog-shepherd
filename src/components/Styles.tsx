import styled from 'styled-components';

const Styles = styled.div`
  font-family: gt_americaregular, sans-serif;

  button:not(.IconButton):not(.editor-button):not(.react-datepicker button),
  .button {
    background-color: #4001ff;
    font-family: gt_americabold, sans-serif;
    font-size: 18px;
    color: #fff;
    border: none;
    padding: 10px 45px;
    border-radius: 5px;
    cursor: pointer;
  }

  .editor-button {
    background-color: #4001ff;
    font-family: gt_americabold, sans-serif;
    font-size: 18px;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  .react-datepicker button {
    padding: 10px 10px;
    background-color: #4001ff;
  }

  .react-datepicker__input-container input {
    width: 50%;
    display: inline-block;
  }

  .pagination button {
    padding: 10px 22px;
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

  .pagination {
    padding: 0.5rem;
  }
`;

export default Styles;
