import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { createTheme } from '@mui/material/styles';
import { useColorSchemeShim } from './ThemeContext';
import { getDesignTokens, inputsCustomizations } from './customTheme';

const providers = [
  { id: 'github', name: 'GitHub' },
  { id: 'google', name: 'Google' },
  { id: 'credentials', name: 'Email and Password' },
];

const signIn = async (provider) => {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Sign in with ${provider.id}`);
      resolve({ error: 'This is a mock error message.' });
    }, 500);
  });
  return promise;
};

export default function ThemeSignInPage() {
  const { mode, systemMode } = useColorSchemeShim();
  const calculatedMode = (mode === 'system' ? systemMode : mode) ?? 'light';
  const brandingDesignTokens = getDesignTokens(calculatedMode);
  // preview-start
  const THEME = createTheme({
    ...brandingDesignTokens,
    palette: {
      ...brandingDesignTokens.palette,
      mode: calculatedMode,
    },
    components: {
      ...inputsCustomizations,
    },
  });
  // preview-end

  return (
    // preview-start
    <>
    <div className='header bg-gradient-info pb-5 pt-5 pt-md-8'>
    <AppProvider theme={THEME}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{ form: { noValidate: true } }}
        sx={{
          '& form > .MuiStack-root': {
            marginTop: '2rem',
            rowGap: '0.5rem',
          },
        }}
      />
    </AppProvider>
    </div>
    </>
    // preview-end
  );
}
