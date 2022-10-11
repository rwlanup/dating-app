import { Button, Grid, Theme, useMediaQuery } from '@mui/material';
import { showLoginFormInAuthDialog, showRegisterFormInAuthDialog } from '../../../../store/authDialogUIStore';
import { AuthDialog } from '../../../pages/auth-dialog/AuthDialog';

export const HeaderAuthActionGuest = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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

export default HeaderAuthActionGuest;
