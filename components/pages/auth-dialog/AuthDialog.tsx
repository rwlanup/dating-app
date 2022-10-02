import { alpha } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useStore } from '../../../hooks/useStore';
import { authDialogUIStore, closeAuthDialog } from '../../../store/authDialogUIStore';
import { SlideinDialog } from '../../ui/slidein-dialog/SlideinDialog';
import { LoginForm } from './login-form/LoginForm';
import { RegisterForm } from './register-form/RegisterForm';

export const AuthActions = ['login', 'register'] as const;

export const AuthDialog: FC = () => {
  const router = useRouter();
  const { form: authAction, isOpen } = useStore(
    authDialogUIStore,
    (state) => state,
    () => ({ form: 'login', isOpen: false })
  );
  const action = router.query.action as typeof AuthActions[number];

  const _isOpen = isOpen || AuthActions.includes(action);

  const _onClose = (): void => {
    if (AuthActions.includes(action)) {
      const _query = { ...router.query };
      delete _query.action;
      router.replace({
        query: _query,
      });
    }
    closeAuthDialog();
  };

  const _action = action || authAction;

  return (
    <SlideinDialog
      open={_isOpen}
      onClose={_onClose}
      maxWidth="sm"
      scroll="paper"
      fullWidth
      sx={(theme) => ({
        bgcolor: alpha(theme.palette.primary[50], 0.25),
        '.MuiDialog-container': {
          alignItems: { xs: 'flex-end', sm: 'center' },
        },
      })}
      PaperProps={{
        sx: (theme) => ({
          m: { xs: 0, sm: '32px' },
          width: { xs: '100%', sm: 'calc(100% - 64px)' },
          borderRadius: {
            xs: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
            sm: `${theme.shape.borderRadius}px`,
          },
        }),
      }}
    >
      {_action === 'login' ? <LoginForm /> : <RegisterForm />}
    </SlideinDialog>
  );
};
