import React, { useEffect, useState } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  Typography,
  TextFieldProps,
  Button,
  Snackbar,
  IconButton,
  Link,
  Tooltip,
} from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';

import { StateType } from '../Reducers/main';
import { SettingsState, SETTINGS_KEY } from '../Reducers/settings';
import { Page } from '../Utils/Page';
import { getCurrentUrl } from '../Utils/AuthenticationLinks';
import { setSettings } from '../Utils/actionCreators';
import {
  SetterField,
  SetterFieldOwnProps,
  SetterCheckbox,
} from '../Utils/SetterField';
import { QueryObject } from '../Utils/queryUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(-1),
    },
    buttonContainer: {
      marginTop: theme.spacing(3),
      textAlign: 'right',
    },
    title: {
      marginBottom: theme.spacing(3),
    },
    settingsField: {
      marginBottom: theme.spacing(3),
    },
  })
);

const SettingsStringField = (
  props: Omit<SetterFieldOwnProps<string, SettingsState>, 'modifier'> &
    TextFieldProps
): React.ReactElement => (
  <SetterField<string, SettingsState>
    {...props}
    modifier={(value: string) => String(value)}
  />
);

const SettingsNumberField = (
  props: Omit<SetterFieldOwnProps<number, SettingsState>, 'modifier'> &
    TextFieldProps
): React.ReactElement => (
  <SetterField<number, SettingsState>
    {...props}
    modifier={(value: string) => Number(value)}
  />
);

interface FieldDefinition {
  field: keyof SettingsState;
  label: string;
  type: 'string' | 'number' | 'boolean';
}

const FIELDS: FieldDefinition[] = [
  { field: 'apiUrl', label: 'Statistics URL', type: 'string' },
  { field: 'authUrl', label: 'Authentication URL', type: 'string' },
  { field: 'clientId', label: 'Authentication client ID', type: 'string' },
  { field: 'title', label: 'Page title', type: 'string' },
  { field: 'limit', label: 'Limit', type: 'number' },
  { field: 'aggregateTo', label: 'Chart resolution', type: 'number' },
  { field: 'showQueryBar', label: 'Display query bar', type: 'boolean' },
  {
    field: 'tableDecimals',
    label: 'Number of decimals in tables',
    type: 'number',
  },
  {
    field: 'tableSingleCellValues',
    label: 'Show aggregated values of a label in single table cell',
    type: 'boolean',
  },
];

export interface SettingsProps {
  settings: SettingsState;
  setSettings: (settings: Partial<SettingsState>) => void;
}

interface Message {
  severity: 'success' | 'error';
  message: string;
}
type MessageType = Message | undefined;

export const Settings = ({
  settings,
  setSettings,
}: SettingsProps): React.ReactElement => {
  const classes = useStyles();
  const history = useHistory();
  const [message, setMessage] = useState<MessageType>(undefined);
  const clearMessage = () => setMessage(undefined);

  useEffect(() => {
    const query = window.location.href.match(/\/settings\?(.*)/);
    if (!query) {
      return;
    }
    const keys = FIELDS.map(({ field }): string => field);
    const paramSettings = query[1]
      .split('&')
      .map((keyValue: string): string[] => keyValue.split('='))
      .filter(([key]: string[]): boolean => keys.includes(key))
      .reduce((settingsObj: QueryObject, [key, value]: string[]) => {
        switch (FIELDS.find((i) => i.field === key)?.type) {
          case 'number':
            settingsObj[key] = Number(decodeURI(value));
            break;
          case 'boolean':
            settingsObj[key] = decodeURI(value) === 'true';
            break;
          default:
            settingsObj[key] = decodeURI(value);
        }
        return settingsObj;
      }, {});
    setSettings(paramSettings as Partial<SettingsState>);
    history.replace('/settings');
  }, [setSettings, history]);

  const saveToLocalStorage = (): void => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {
      setMessage({
        severity: 'error',
        message: 'Saving settins to local storage failed.',
      });
      return;
    }
    setMessage({
      severity: 'success',
      message: 'Saved settins to local storage.',
    });
  };

  const copySettingsLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(getLinkWithCurrentSettings());
      setMessage({ severity: 'success', message: 'Copied link to clipboard.' });
    } catch (_) {
      setMessage({
        severity: 'error',
        message: 'Copying link to clipboard failed.',
      });
    }
  };

  const getLinkWithCurrentSettings = () => {
    const query = Object.keys(settings)
      .filter((key) => FIELDS.map(({ field }): string => field).includes(key))
      .map(
        (key) =>
          `${key}=${encodeURI(settings[key as keyof SettingsState] as string)}`
      )
      .join('&');
    return `${getCurrentUrl()}/settings?${query}`;
  };

  return (
    <Page>
      <Typography className={classes.title} component="h2" variant="h5">
        Settings
      </Typography>
      <form>
        {FIELDS.map(
          ({ field, label, type }): React.ReactElement => {
            switch (type) {
              default:
              case 'string':
                return (
                  <SettingsStringField
                    key={`${field}:${settings[field]}`}
                    className={classes.settingsField}
                    defaultValue={settings[field] as string}
                    field={field}
                    fullWidth
                    label={label}
                    setter={setSettings}
                  />
                );
              case 'number':
                return (
                  <SettingsNumberField
                    key={`${field}:${settings[field]}`}
                    className={classes.settingsField}
                    defaultValue={settings[field] as number}
                    field={field}
                    fullWidth
                    label={label}
                    setter={setSettings}
                  />
                );
              case 'boolean':
                return (
                  <SetterCheckbox
                    key={`${field}:${settings[field]}`}
                    className={classes.settingsField}
                    checked={settings[field] as boolean}
                    field={field}
                    label={label}
                    setter={setSettings}
                  />
                );
            }
          }
        )}
        <p>
          Copy <Link href={getLinkWithCurrentSettings()}>link</Link> to current
          settings
          <Tooltip title="Copy to clipboard">
            <IconButton
              onClick={copySettingsLink}
              data-testid="copy-link-button"
            >
              <FileCopy />
            </IconButton>
          </Tooltip>
        </p>
        <div className={classes.buttonContainer}>
          <Button className={classes.button} onClick={() => history.push('/')}>
            Done
          </Button>
          <Button
            className={classes.button}
            color="primary"
            onClick={saveToLocalStorage}
          >
            Save to local storage
          </Button>
        </div>
      </form>
      {/* <code>{JSON.stringify(settings, null, 2)}</code> */}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={2500}
        onClose={clearMessage}
      >
        {message && (
          <Alert onClose={clearMessage} severity={message.severity}>
            {message.message}
          </Alert>
        )}
      </Snackbar>
    </Page>
  );
};

const mapStateToProps = (state: StateType) => ({
  settings: state.settings,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setSettings }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
