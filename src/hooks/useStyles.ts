import { Theme, createStyles, makeStyles, StyleRules } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& .MuiAccordionSummary-root:hover, .MuiButtonBase-root:hover': {
        cursor: 'default'
      }
    },
    heading: {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: 600
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
