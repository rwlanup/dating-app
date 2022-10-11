import { Button, Grid, Skeleton, Theme, useMediaQuery } from '@mui/material';
import { useSession } from 'next-auth/react';
import { FC } from 'react';
import { showLoginFormInAuthDialog, showRegisterFormInAuthDialog } from '../../../../store/authDialogUIStore';
import { AuthDialog } from '../../../pages/auth-dialog/AuthDialog';
import { HeaderAvatar } from './HeaderAvatar';

export const HeaderAuthAction: FC = () => {
  const session = useSession();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  if (session.status === 'authenticated') return <HeaderAvatar />;

  if (session.status === 'loading')
    return (
      <Skeleton
        variant="circular"
        height={40}
        width={40}
      />
    );

  return (
    <>
      {isMobile ? (
        <Button onClick={showLoginFormInAuthDialog}>Log in</Button>
      ) : (
        <Grid
          container
          spacing={2}
        >
          <Grid item>
            <Button
              variant="outlined"
              onClick={showLoginFormInAuthDialog}
            >
              Log in
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={showRegisterFormInAuthDialog}>Create account</Button>
          </Grid>
        </Grid>
      )}
      <AuthDialog />
    </>
  );
};
