import { alpha } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { SlideinDialog } from '../../ui/slidein-dialog/SlideinDialog';
import { ForgotPasswordForm } from './forgot-password-form/ForgotPasswordForm';
import { LoginForm } from './login-form/LoginForm';
import { RegisterForm } from './register-form/RegisterForm';

export const AuthActions = ['login', 'register', 'forgot-password'] as const;

interface AuthDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  authAction?: typeof AuthActions[number];
  setAuthAction?: (action: typeof AuthActions[number]) => void;
}

export const AuthDialog: FC<AuthDialogProps> = ({ isOpen, onClose, authAction }) => {
  const router = useRouter();
  const action = router.query.action as typeof AuthActions[number];

  const _isOpen = isOpen ? isOpen : AuthActions.includes(action);

  const _onClose = (): void => {
    onClose && onClose();
    if (AuthActions.includes(action)) {
      const _query = { ...router.query };
      delete _query.action;
      router.replace({
        query: _query,
      });
    }
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
      {_action === 'login' ? <LoginForm /> : _action === 'register' ? <RegisterForm /> : <ForgotPasswordForm />}
    </SlideinDialog>
  );
};
