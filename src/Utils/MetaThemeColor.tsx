import { useTheme } from '@material-ui/core/styles';

export const MetaThemeColor = (): null => {
  const theme = useTheme();
  const themeColor =
    theme.palette.type == 'dark'
      ? theme.palette.grey[900]
      : theme.palette.primary.dark;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themeColor);

  return null;
};

export default MetaThemeColor;
