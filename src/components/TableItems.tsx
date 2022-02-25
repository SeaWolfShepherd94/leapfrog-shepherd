import React, { useState } from 'react';
import { useGlobalState } from './GlobalState';
import { IconButton, Menu, MenuItem, Fade, MenuList } from '@material-ui/core';
import NestedMenuItem from 'material-ui-nested-menu-item';
import Divider from '@mui/material/Divider';

export const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef: any = ref || defaultRef;
  
    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);
  
    return <input type='checkbox' ref={resolvedRef} {...rest} />;
});

const aggregationOptions = [
    {
      name: 'Count',
      value: 'count'
    },
    {
      name: 'Sum',
      value: 'sum'
    },
    {
      name: 'Min',
      value: 'min'
    },
    {
      name: 'Max',
      value: 'max'
    }
  ];

const sortOptions = [
    {
        name: 'Asc',
        value: 'asc'
    },
    {
        name: 'Desc',
        value: 'desc'
    },
];

export const TableData: React.FC = () => {
    const [editorQuery, setEditorQuery]: any = useGlobalState('editorQuery');
    const [editableText, setEditableText]: any = useGlobalState('editableText');
    const [updateView, setUpdateView]: any = useGlobalState('updateView');
    const [aggregatedColumns, setAggregatedColumns]: any = useGlobalState('aggregatedColumns');
    const [aggregatedValues, setAggregatedValues]: any = useGlobalState('aggregatedValues');
    const [columnHeader, setColumnHeader]: any = useGlobalState('columnHeader');
    const [columnIndex, setColumnIndex]: any = useGlobalState('columnIndex');
    const [anchorEl, setAnchorEl] = useGlobalState('anchorEl');
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (event: any, name: string) => {
        const tempQuery = editorQuery;
        const index = columnIndex;
        if (aggregatedColumns.indexOf(columnHeader) > -1) {
          tempQuery.query.project[index] = { [name]: aggregatedValues[aggregatedColumns.indexOf(columnHeader)] };
        } else {
          if (typeof tempQuery.query.project[index] === 'object') {
            const key = Object.keys(tempQuery.query.project[index])[0];
            const option: any = aggregationOptions.filter((item: any) => item.aggregate === key);
            const obj = {
              [Object.keys(tempQuery.query.project[index])[0]]: [
                tempQuery.query.project[index][Object.keys(tempQuery.query.project[index])[0]][1]
              ]
            };
            if (option.length > 0) {
              tempQuery.query.project.push({
                [name]: [
                  tempQuery.query.project[index][Object.keys(tempQuery.query.project[index])[0]][0],
                  tempQuery.query.project[index][Object.keys(tempQuery.query.project[index])[0]][1]
                ]
              });
              setAggregatedValues([
                ...aggregatedValues,
                [
                  tempQuery.query.project[index][Object.keys(tempQuery.query.project[index])[0]][0],
                  tempQuery.query.project[index][Object.keys(tempQuery.query.project[index])[0]][1]
                ]
              ]);
              tempQuery.query.project = tempQuery.query.project.filter((column: any, idx: number) => idx != index);
            } else {
              tempQuery.query.project.push({
                [name]: [tempQuery.query.project[index][Object.keys(tempQuery.query.project[index])[0]][0], obj]
              });
              setAggregatedValues([
                ...aggregatedValues,
                [tempQuery.query.project[index][Object.keys(tempQuery.query.project[index])[0]][0], obj]
              ]);
              tempQuery.query.project = tempQuery.query.project.filter((column: any, idx: number) => idx != index);
            }
          } else {
            tempQuery.query.project.push({ [name]: [columnHeader, columnHeader] });
            setAggregatedValues([...aggregatedValues, [columnHeader, columnHeader]]);
            tempQuery.query.project = tempQuery.query.project.filter((column: any, idx: number) => idx != index);
          }
          setAggregatedColumns([...aggregatedColumns, columnHeader]);
        }
        setEditableText(tempQuery.query);
        setEditorQuery({ ...editorQuery, query: {} });
        setUpdateView(!updateView);
        handleClose();
    };

    const handleSort = (name: string) => {
        console.log(name);
    };

    return (
        <Menu
            id='long-menu'
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            {aggregationOptions.map((option, idx) => (
              <div key={idx}>
                <MenuItem
                    onClick={e => handleMenuItemClick(e, option.value)}
                >
                    {option.name}
                </MenuItem>
              </div>
            ))}
            <Divider />
            <NestedMenuItem
                label="Sort"
                parentMenuOpen={open}            
            >
                {sortOptions.map((option, idx) => (
                    <div key={idx}>
                        <MenuItem
                            onClick={() => handleSort(option.value)}
                        >
                            {option.name}
                        </MenuItem>
                    </div>
                ))}
            </NestedMenuItem>
        </Menu>
    );
};