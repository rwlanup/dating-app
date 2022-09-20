import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import type { FC } from 'react';
import { ProfileListItem as TProfileListItem } from '../../../types/profile';
import { getFormattedDate, getYearsBetweenDate } from '../../../util/date';

interface ProfileListItemProps {
  data: TProfileListItem;
}

export const ProfileListItem: FC<ProfileListItemProps> = ({ data }) => {
  return (
    <Box>
      <Grid
        container
        alignItems="center"
        justifyContent={{ xs: 'center', sm: 'flex-start' }}
        spacing={2.5}
        sx={{ flexWrap: { sm: 'nowrap' } }}
      >
        <Grid item>
          <Box
            sx={{
              borderRadius: 2,
              display: 'flex',
              height: '200px',
              width: '200px',
              objectFit: 'contain',
              bgcolor: 'primary.50',
            }}
            component="img"
            alt={`Profile picture of ${data.fullName}`}
            src={data.profilePicture}
          />
        </Grid>
        <Grid item>
          <Grid
            container
            direction="column"
            rowSpacing={2}
          >
            {/* Username and names */}
            <Grid item>
              <Typography
                color="secondary"
                component="div"
                sx={{ mb: 0.5, textAlign: { xs: 'center', sm: 'left' } }}
              >
                @{data.username}
              </Typography>
              <Typography
                variant="h4"
                component="h3"
                sx={{ textAlign: { xs: 'center', sm: 'left' } }}
              >
                {data.fullName}
              </Typography>
            </Grid>

            {/* Age, profession and address */}
            <Grid item>
              {data.address && (
                <Typography
                  component="div"
                  fontWeight="Medium"
                  color="secondary"
                  sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                >
                  {data.profession && data.profession + ' '}
                  from {data.address}
                </Typography>
              )}
              {data.dob && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                  >
                    Age: {getYearsBetweenDate(data.dob)} ({getFormattedDate(data.dob)})
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Actions */}
            <Grid item>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  flex="1 0 auto"
                >
                  <LoadingButton fullWidth>Send friend request</LoadingButton>
                </Grid>
                <Grid
                  item
                  flex="1 0 auto"
                >
                  <Link
                    passHref
                    href={`/profile/${data.username}`}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                    >
                      View profile
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
