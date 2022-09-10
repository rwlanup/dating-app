import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Dialog } from '../../ui/dialog/Dialog';
import { RegisterForm } from '../register-form/RegisterForm';
import styles from './AuthDialog.module.css';

export const AuthDialog: FC = () => {
  const router = useRouter();

  const isAuthDialogVisible = router.query.action === 'login' || router.query.action === 'register';
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
      <RegisterForm />
    </Dialog>
  );
};
