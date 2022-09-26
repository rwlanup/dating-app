import { Box, Button, Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { UserProfile } from '../../../types/profile';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import WcTwoToneIcon from '@mui/icons-material/WcTwoTone';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import { getFormattedDate, getYearsBetweenDate } from '../../../util/date';

interface ProfileDetailHeaderProps {
  profile: Pick<UserProfile, 'address' | 'fullName' | 'profilePicture' | 'profession' | 'username' | 'dob' | 'gender'>;
}

export const ProfileDetailHeader: FC<ProfileDetailHeaderProps> = ({ profile }) => {
  return (
    <Grid
      container
      spacing={2.5}
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'center', sm: 'stretch' }}
    >
      {profile.profilePicture && (
        <Grid item>
          <Box
            component="img"
            src={profile.profilePicture}
            sx={{
              height: 240,
              width: 240,
              borderRadius: 3,
              bgcolor: 'primary.50',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </Grid>
      )}
      <Grid
        item
        xs
      >
        <Grid
          container
          direction="column"
          sx={{ maxWidth: '50rem', minHeight: 1, mt: 0 }}
          rowSpacing={2}
        >
          <Grid item>
            <Box>
              <Grid
                container
                spacing={2}
                direction={{ xs: 'column', sm: 'row' }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    color="secondary"
                    fontWeight="Medium"
                    sx={{ textAlign: { xs: 'center', sm: 'left', mb: 0.5 } }}
                  >
                    @{profile.username}
                  </Typography>
                  <Typography
                    align="center"
                    variant="h3"
                    component="h1"
                    fontWeight="Regular"
                    sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                  >
                    {profile.fullName}
                  </Typography>
                </Grid>
                <Grid
                  item
                  alignSelf={{ xs: 'stretch', sm: 'center' }}
                >
                  <Box sx={{ maxWidth: '25rem', mx: 'auto' }}>
                    <Button fullWidth>Send friend request</Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid
            item
            sx={{ mt: 'auto' }}
          >
            <Grid
              container
              spacing={1}
            >
              {profile.profession && (
                <Grid
                  item
                  xs={12}
                  lg={6}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography color="text.secondary">
                      <AccountBoxTwoToneIcon />
                    </Typography>
                    <Typography color="text.secondary">Profession: {profile.profession}</Typography>
                  </Box>
                </Grid>
              )}
              {profile.dob && (
                <Grid
                  item
                  xs={12}
                  lg={6}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography color="text.secondary">
                      <CalendarMonthTwoToneIcon />
                    </Typography>
                    <Typography color="text.secondary">
                      Age: {getYearsBetweenDate(profile.dob)} / ( {getFormattedDate(profile.dob)} )
                    </Typography>
                  </Box>
                </Grid>
              )}
              {profile.gender && (
                <Grid
                  item
                  xs={12}
                  lg={6}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography color="text.secondary">
                      <WcTwoToneIcon />
                    </Typography>
                    <Typography color="text.secondary">Gender: {profile.gender}</Typography>
                  </Box>
                </Grid>
              )}
              {profile.address && (
                <Grid
                  item
                  xs={12}
                  lg={6}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography color="text.secondary">
                      <PlaceTwoToneIcon />
                    </Typography>
                    <Typography color="text.secondary">{profile.address}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
