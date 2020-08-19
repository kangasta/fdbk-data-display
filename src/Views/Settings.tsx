import React, { FocusEvent, KeyboardEvent, useEffect, useState } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  Typography,
  TextField,
  makeStyles,
  Theme,
  createStyles,
  Button,
  Snackbar,
  IconButton,
  Link,
  Tooltip,
} from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import { TextFieldProps } from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';

import { StateType } from '../Reducers/main';
import { SettingsState, SETTINGS_KEY } from '../Reducers/settings';
import { Page } from '../Utils/Page';
import { getCurrentUrl } from '../Utils/AuthenticationLinks';
import { setSettings } from '../Utils/actionCreators';

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

interface StringFieldDefinition {
  field: keyof SettingsState;
  label: string;
}

export interface SettingsStringFieldProps extends StringFieldDefinition {
  defaultValue?: string;
  setSettings: (settings: Partial<SettingsState>) => void;
}

const SettingsStringField = ({
  field,
  setSettings,
  ...props
}: SettingsStringFieldProps & TextFieldProps): React.ReactElement => {
  const setField = (value: string) => {
    setSettings({ [field]: value });
  };

  const onBlur = (event: FocusEvent<HTMLInputElement>) => {
    setField(event.target?.value);
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter')
      setField((event.target as HTMLInputElement)?.value);
  };

  return (
    <TextField
      id={`${field}-input`}
      name={field}
      {...props}
      onBlur={onBlur}
      onKeyUp={onKeyUp}
    />
  );
};

const FIELDS: StringFieldDefinition[] = [
  { field: 'apiUrl', label: 'Statistics URL' },
  { field: 'authUrl', label: 'Authentication URL' },
  { field: 'clientId', label: 'Authentication client ID' },
  { field: 'title', label: 'Page title' },
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
      .reduce((authObj: { [key: string]: string }, [key, value]: string[]) => {
        authObj[key] = decodeURI(value);
        return authObj;
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

  const copySettingsLink = async (): Promise<any> => {
    try {
      await navigator.clipboard.writeText(getLinkWithCurrentSettings());
    } catch (_) {
      setMessage({
        severity: 'error',
        message: 'Copying link to clipboard failed.',
      });
      return;
    }
    setMessage({ severity: 'success', message: 'Copied link to clipboard.' });
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
          ({ field, label }): React.ReactElement => (
            <SettingsStringField
              key={`${field}:${settings[field]}`}
              className={classes.settingsField}
              defaultValue={settings[field] as string}
              field={field}
              fullWidth
              label={label}
              setSettings={setSettings}
            />
          )
        )}
        <p>
          Copy <Link href={getLinkWithCurrentSettings()}>link</Link> to current
          settings
          <Tooltip title="Copy to clipboard">
            <IconButton onClick={copySettingsLink}>
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
