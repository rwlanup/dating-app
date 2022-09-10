import { useSession } from 'next-auth/react';
import type { FC, MouseEventHandler } from 'react';
import { AuthDialog } from '../../../auth/auth-dialog/AuthDialog';
import { Button } from '../../../ui/button/Button';
import styles from '../Header.module.css';

export const HeaderAuthAction: FC = () => {
  const session = useSession();

  if (session.status === 'authenticated') return <div>Auth Name</div>;

  return (
    <>
      <div className={styles.desktopAccountBtns}>
        <Button
          variant="outlined"
          href="/?action=login"
        >
          Log in
        </Button>
        <Button href="/?action=register">Create account</Button>
      </div>
      <Button
        href="/?action=login"
        className={styles.mobileAccountBtn}
      >
        Log in
      </Button>
      <AuthDialog />
    </>
  );
};
