import { alpha, Box, Button, Container, Grid, styled, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import HeroIllustration from '../../../public/images/hero-illustration.svg';
import { showRegisterFormInAuthDialog } from '../../../store/authDialogUIStore';

const ImageContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  span: {
    display: 'block',
  },
}));

export const Hero: FC = () => {
  const session = useSession();
  return (
    <Box
      component="section"
      sx={(theme) => ({ bgcolor: alpha(theme.palette.primary[50], 0.25) })}
    >
      <Container sx={{ pt: 5 }}>
        <Grid
          container
          spacing={5}
          alignItems="center"
          justifyContent="space-between"
          direction={{ xs: 'column-reverse', md: 'row' }}
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Typography variant="h1">It&apos;s never too late to find your soulmate.</Typography>
            <Typography
              paragraph
              variant="body"
              color="text.secondary"
              sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2.5, md: 5 }, maxWidth: '80%' }}
            >
              Tell us about your interest and find your matching soulmates. It&apos;s never too late to fall in love
              again. Find your real feelings.
            </Typography>
            {session.status === 'authenticated' ? (
              <Link
                href="/profile"
                passHref
              >
                <Button>Go to profile</Button>
              </Link>
            ) : (
              <Button
                onClick={showRegisterFormInAuthDialog}
                disabled={session.status === 'loading'}
              >
                Create account
              </Button>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
          >
            <ImageContainer>
              <Image
                priority
                src={HeroIllustration}
                alt="Happy dating online in Ditto platform"
              />
            </ImageContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
