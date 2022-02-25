import { Theme, createStyles, makeStyles, StyleRules } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    },
    details: {
      flexDirection: 'column'
    },
    fab: {
      '&$disabled': {
        backgroundColor: 'white'
      }
    },
    disabled: {}
  } as StyleRules)
);
