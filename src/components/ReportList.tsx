import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { baseURL } from '../menuitems/MenuItemTools';
import { useGlobalState } from './GlobalState';
import { useAuth0 } from '@auth0/auth0-react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { useTable } from 'react-table';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useStyles } from '../hooks/useStyles';

function Table({ data, columns }: any) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ data, columns });
  let key = 0;

  return (
    <div className='tableWrap'>
      <div className='child'>
        <table {...getTableProps()} className='child'>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={key++}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} key={key++}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={key++}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()} key={key++}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ReportList() {
  const { t } = useTranslation();
  const columns = useMemo(
    () => [
      {
        Header: <Trans t={t}>link</Trans>,
        accessor: 'link' // accessor is the "key" in the data
      },
      {
        Header: <Trans t={t}>name</Trans>,
        accessor: 'name'
      },
      {
        Header: <Trans t={t}>description</Trans>,
        accessor: 'description'
      }
    ],
    [t]
  );
  const { getAccessTokenSilently } = useAuth0();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [queryData, setQueryData]: any = useGlobalState('queryData');
  const [tableData, setTableData]: any = useState([]);
  const [expanded, setExpanded] = useState('panel1');
  const [disableHomeComponent, setDisableHomeComponent]: any = useGlobalState('disableHomeComponent');
  const [disableHomeLink, setDisableHomeLink]: any = useGlobalState('disableHomeLink');
  const classes = useStyles();

  async function getApiToken() {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch {
      // do nothing
    }
  }

  const handleClick = () => {
    setDisableHomeComponent(false);
    setDisableHomeLink('auto');
  };

  useEffect(() => {
    async function getData() {
      const headers = {
        Authorization: `Bearer ${await getApiToken()}`,
        'Access-Control-Allow-Origin': '*'
      };

      await axios.get(`${baseURL}/api/Queries`, { headers: headers }).then(response => {
        setQueryData(response.data);
        const data = response.data.map((d: any, id: number) => {
          return {
            link: (
              <Link
                to={{ pathname: `/report/${d.queryId}`, state: { id: d.queryId, name: d.name } }}
                onClick={handleClick}
              >
                Report
              </Link>
            ),
            id: d.queryId,
            name: d.name,
            description: d.description
          };
        });
        setTableData(data);
      });
    }
    getData();
    // eslint-disable-next-line
  }, []);
  return (
    <div className={classes.root}>
      <Accordion expanded={expanded === 'panel1'} disabled classes={{ root: classes.fab, disabled: classes.disabled }}>
        <AccordionSummary aria-controls='panel1a-content' id='panel1a-header' style={{ overflow: 'auto' }}>
          <Typography className={classes.heading}>
            <Trans t={t}>reports</Trans>
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Table data={tableData} columns={columns} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
