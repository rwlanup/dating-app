import { Avatar, Box, Button, Grid, IconButton, Skeleton, Theme, useMediaQuery } from '@mui/material';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { toggleProfileDrawerOnMobileVisible } from '../../../../store/layoutUIStore';
import { resolveBase64ImageUrl } from '../../../../util/string';
import { trpc } from '../../../../util/trpc';
import { AuthActions, AuthDialog } from '../../../pages/auth-dialog/AuthDialog';

export const HeaderAuthAction: FC = () => {
  const { data: profilePicture } = trpc.useQuery(['profile.me'], {
    ssr: false,
    select(data) {
      return data.profilePicture;
    },
  });
  const session = useSession();

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

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

  if (session.status === 'loading') {
    return (
      <Skeleton
        variant="circular"
        height={40}
        width={40}
      />
    );
  }

  if (session.status === 'authenticated') {
    const url = resolveBase64ImageUrl(profilePicture);
    if (isTablet) {
      return (
        <Box>
          <IconButton
            onClick={toggleProfileDrawerOnMobileVisible}
            aria-label="Open profile menu"
          >
            <Avatar
              alt={session.data.user.fullName}
              src={url}
            ></Avatar>
          </IconButton>
        </Box>
      );
    }

    return (
      <Box>
        <Avatar
          src={url}
          alt={session.data.user.fullName}
        ></Avatar>
      </Box>
    );
  }

  return (
    <>
      {isMobile ? (
        <Button onClick={openAuthDialog.bind(null, 'login')}>Log in</Button>
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
