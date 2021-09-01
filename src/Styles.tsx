import styled from 'styled-components';

const Styles = styled.div`

  padding: 1rem;
  display: block;
  max-width: 100%;

  .tableWrap {
    overflow-y: auto;
    height: 500px;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-collapse: collapse;
    border: 1px solid black;
    border-spacing: 0;

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
      border-bottom: 1px solid black;
      border-right: 1px solid black;

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
`

export default Styles;