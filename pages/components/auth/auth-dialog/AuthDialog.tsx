import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Dialog } from '../../ui/dialog/Dialog';
import { ForgotPasswordForm } from '../forgot-password-form/ForgotPasswordForm';
import { LoginForm } from '../login-form/LoginForm';
import { RegisterForm } from '../register-form/RegisterForm';
import styles from './AuthDialog.module.css';

const AUTH_ACTIONS = ['login', 'register', 'forgot-password'] as const;
export const AuthDialog: FC = () => {
  const router = useRouter();
  const currentAction = router.query.action as typeof AUTH_ACTIONS[number] | undefined;
  const isAuthDialogVisible = currentAction && AUTH_ACTIONS.includes(currentAction);

  const closeAuthDialog = (): void => {
    const query = { ...router.query };
    delete query.action;
    router.replace({
      query,
    });
  };

  return (
    <Dialog
      className={styles.dialogContent}
      isOpen={isAuthDialogVisible}
      onClose={closeAuthDialog}
    >
      {currentAction === 'forgot-password' ? (
        <ForgotPasswordForm />
      ) : currentAction === 'login' ? (
        <LoginForm />
      ) : (
        <RegisterForm />
      )}
    </Dialog>
  );
};
