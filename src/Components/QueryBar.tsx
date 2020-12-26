import React, { useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  ButtonGroup,
  Button,
  ButtonProps,
  TextFieldProps,
  MenuItem,
  useMediaQuery,
  Hidden,
  TextField,
} from '@material-ui/core';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

import { Page } from '../Utils/Page';
import { setQuery } from '../Utils/actionCreators';
import { QueryMode, QueryState, FromNow } from '../Reducers/query';
import { StateType } from '../Reducers/main';
import {
  SetterFieldOwnProps,
  SetterField,
  ChoiceType,
} from '../Utils/SetterField';
import { getDownQuery } from '../Utils/ThemeWrapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    queryBarContainer: {
      display: 'flex',
      marginBottom: theme.spacing(-1.5),
      marginTop: theme.spacing(-1.5),
    },
    modeSelector: {
      flex: 1,
    },
    field: {
      minWidth: '20ch',
      marginLeft: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0,
      },
    },
  })
);

const queryModeOptions: QueryMode[] = ['From now', 'Month', 'Query string'];

interface QueryModeButtonProps extends ButtonProps {
  targetMode: QueryMode;
  currentMode: QueryMode;
  setMode: (targetMode: QueryMode) => void;
}
const QueryModeButton = ({
  targetMode,
  currentMode,
  setMode,
  ...props
}: QueryModeButtonProps) => {
  return (
    <Button
      {...props}
      disabled={targetMode === currentMode}
      onClick={() => setMode(targetMode)}
    >
      {targetMode}
    </Button>
  );
};

const QueryStringField = (
  props: Omit<SetterFieldOwnProps<string, QueryState>, 'modifier'> &
    TextFieldProps
): React.ReactElement => (
  <SetterField<string, QueryState>
    {...props}
    modifier={(value: string) => String(value)}
  />
);
const QueryNumberField = (
  props: Omit<SetterFieldOwnProps<number, QueryState>, 'modifier'> &
    TextFieldProps
): React.ReactElement => (
  <SetterField<number, QueryState>
    {...props}
    modifier={(value: string) => Number(value)}
  />
);

interface FieldDefinition {
  visibleIn: QueryMode;
  field: keyof QueryState;
  label: string;
  type: 'string' | 'number';
  choices?: ChoiceType[];
}

const fromNowOptions: FromNow[] = [
  'Last 12 hours',
  'Last day',
  'Last 3 days',
  'Last 7 days',
];
const fromNowChoices: ChoiceType[] = fromNowOptions.map((choice) => ({
  value: choice,
  label: choice,
}));

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const monthChoices: ChoiceType[] = months.map((label, i) => ({
  label,
  value: String(i + 1),
}));

const FIELDS: FieldDefinition[] = [
  {
    visibleIn: 'From now',
    field: 'fromNow',
    label: 'From now',
    type: 'string',
    choices: fromNowChoices,
  },
  { visibleIn: 'Month', field: 'year', label: 'Year', type: 'number' },
  {
    visibleIn: 'Month',
    field: 'month',
    label: 'Month',
    type: 'number',
    choices: monthChoices,
  },
  {
    visibleIn: 'Query string',
    field: 'queryString',
    label: 'Query string',
    type: 'string',
  },
];

export interface QueryBarProps {
  query: QueryState;
  setQuery: (query: Partial<QueryState>) => void;
}

export const QueryBar = ({
  query,
  setQuery,
}: QueryBarProps): React.ReactElement => {
  const downXs = useMediaQuery(getDownQuery('xs'));
  const classes = useStyles();
  const { mode } = query;
  const setMode = (targetMode: QueryMode) => setQuery({ mode: targetMode });

  useEffect(() => {
    if (downXs) {
      setQuery({ mode: 'From now' });
    }
  }, [downXs, setQuery]);

  return (
    <Page data-testid="query-bar">
      <div className={classes.queryBarContainer}>
        <Hidden smDown>
          <ButtonGroup
            className={classes.modeSelector}
            variant="text"
            color="primary"
          >
            {queryModeOptions.map((targetMode) => (
              <QueryModeButton
                key={targetMode}
                currentMode={mode}
                targetMode={targetMode}
                setMode={setMode}
              />
            ))}
          </ButtonGroup>
        </Hidden>
        <Hidden mdUp xsDown>
          <TextField
            key={mode}
            className={classes.modeSelector}
            label="Query"
            defaultValue={mode}
            select
            onChange={({ target }) => setMode(target.value as QueryMode)}
          >
            {queryModeOptions.map((targetMode) => (
              <MenuItem key={targetMode} value={targetMode}>
                {targetMode}
              </MenuItem>
            ))}
          </TextField>
        </Hidden>
        {FIELDS.map(({ visibleIn, field, label, type, choices }) => {
          if (mode !== visibleIn) return null;
          switch (type) {
            default:
            case 'string':
              return (
                <QueryStringField
                  key={field}
                  className={classes.field}
                  field={field}
                  label={label}
                  setter={setQuery}
                  choices={choices}
                  defaultValue={String(query[field] || '')}
                  fullWidth={downXs}
                />
              );
            case 'number':
              return (
                <QueryNumberField
                  key={field}
                  className={classes.field}
                  field={field}
                  label={label}
                  setter={setQuery}
                  choices={choices}
                  defaultValue={Number(query[field])}
                  fullWidth={downXs}
                />
              );
          }
        })}
      </div>
    </Page>
  );
};

const mapStateToProps = ({ query }: StateType) => ({
  query,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setQuery }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(QueryBar);
