import { Box, Drawer, Button, Grid, useMediaQuery, Theme } from '@mui/material';
import Link from 'next/link';
import { FC, MouseEventHandler, ReactElement, ReactNode, useEffect } from 'react';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import Diversity1TwoToneIcon from '@mui/icons-material/Diversity1TwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import InterestsTwoToneIcon from '@mui/icons-material/InterestsTwoTone';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useStore } from '../../../hooks/useStore';
import {
  closeProfileDrawerOnMobileVisible,
  layoutUIStore,
  toggleProfileDrawerOnMobileVisible,
} from '../../../store/layoutUIStore';
import { trpc } from '../../../util/trpc';

interface ProfileLayoutProps {
  page: ReactElement;
}

interface MenuItem {
  label: string;
  icon: ReactNode;
  url?: string;
  onClick?: MouseEventHandler;
}

export const ProfileLayout: FC<ProfileLayoutProps> = ({ page }) => {
  const { status: sessionStatus } = useSession();
  const utils = trpc.useContext();
  const router = useRouter();
  const pathname = router.pathname;
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const isDrawerOnMobileVisible = useStore(
    layoutUIStore,
    (state) => state.isProfileDrawerOnMobileVisible,
    () => false
  );

  // Redirect to home page in case of unauthentication
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.replace('/');
    }
  }, [sessionStatus, router]);

  // Close drawer on navigation
  useEffect(() => {
    closeProfileDrawerOnMobileVisible();
  }, [router.pathname]);

  const MENU_LIST: MenuItem[] = [
    { label: 'Discover partners', icon: <FavoriteTwoToneIcon />, url: '/profile' },
    { label: 'Chats', icon: <ChatTwoToneIcon />, url: '/profile/chats' },
    { label: 'Friends', icon: <Diversity1TwoToneIcon />, url: '/profile/friends' },
    { label: 'Profile settings', icon: <ManageAccountsTwoToneIcon />, url: '/profile/settings' },
    { label: 'Interests', icon: <InterestsTwoToneIcon />, url: '/profile/interests' },
    {
      label: 'Log out',
      icon: <LogoutTwoToneIcon />,
      onClick: async (event) => {
        event.preventDefault();
        const response = await signOut({
          redirect: false,
        });
        await router.replace(response.url, undefined, { shallow: true });
        utils.queryClient.clear();
      },
    },
  ];

  const renderMenuButton = (menu: MenuItem): ReactElement => {
    const isActive: boolean = !menu.url ? false : menu.url === pathname;
    return (
      <Button
        startIcon={menu.icon}
        sx={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          whiteSpace: 'nowrap',
          width: 1,
          pl: { xs: '16px', sm: '24px' },
          justifyContent: 'flex-start',
        }}
        variant={isActive ? 'contained' : 'text'}
        onClick={menu.onClick}
      >
        {menu.label}
      </Button>
    );
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
      <Box
        component="aside"
        sx={{ overflowY: 'auto' }}
      >
        <Drawer
          ModalProps={{ keepMounted: true }}
          anchor={isMobile ? 'right' : 'left'}
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? isDrawerOnMobileVisible : undefined}
          onClose={isMobile ? toggleProfileDrawerOnMobileVisible : undefined}
          sx={{ height: 1, display: { xs: isMobile ? 'block' : 'none', md: 'block' } }}
          PaperProps={{
            sx: {
              position: { xs: 'fixed', md: 'static' },
              bgcolor: 'primary.100',
              borderRightWidth: 2,
              borderColor: 'primary.main',
            },
          }}
        >
          <Grid
            container
            sx={{ pt: 3, pr: 3 }}
            direction="column"
            rowSpacing={2}
          >
            {MENU_LIST.map((menu) => (
              <Grid
                item
                key={menu.label}
              >
                {menu.url ? (
                  <Link
                    passHref
                    href={menu.url}
                  >
                    {renderMenuButton(menu)}
                  </Link>
                ) : (
                  renderMenuButton(menu)
                )}
              </Grid>
            ))}
          </Grid>
        </Drawer>
      </Box>
      <Box
        sx={{ p: { xs: 2, md: 3 }, flex: 1 }}
        id="main"
        component="main"
      >
        {page}
      </Box>
    </Box>
  );
};
