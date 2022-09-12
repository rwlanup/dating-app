import { Button, Grid, Theme, useMediaQuery } from '@mui/material';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { AuthActions, AuthDialog } from '../../../pages/auth-dialog/AuthDialog';

export const HeaderAuthAction: FC = () => {
  const session = useSession();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authAction, setAuthAction] = useState<typeof AuthActions[number]>('login');
  const closeAuthDialog = (): void => {
    setIsAuthDialogOpen(false);
  };
  const openAuthDialog = (authAction?: typeof AuthActions[number]): void => {
    setIsAuthDialogOpen(true);
    if (authAction) {
      setAuthAction(authAction);
    }
  };

  if (session.status === 'authenticated') return <div>Auth Name</div>;

  return (
    <>
      {isMobile ? (
        <Button>Log in</Button>
      ) : (
        <Grid
          container
          spacing={2}
        >
          <Grid item>
            <Button
              variant="outlined"
              onClick={openAuthDialog.bind(null, 'login')}
            >
              Log in
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={openAuthDialog.bind(null, 'register')}>Create account</Button>
          </Grid>
        </Grid>
      )}
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={closeAuthDialog}
        authAction={authAction}
        setAuthAction={setAuthAction}
      />
    </>
  );
};
