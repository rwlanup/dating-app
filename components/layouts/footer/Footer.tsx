import { Container, Grid, Typography, Link, alpha } from '@mui/material';
import type { FC } from 'react';

export const Footer: FC = () => {
  return (
    <Container
      component="footer"
      maxWidth={false}
      sx={(theme) => ({
        bgcolor: alpha(theme.palette.primary[50], 0.25),
        pb: 1,
        pt: 1,
        borderTop: 1,
        mt: 'auto',
        borderColor: 'divider',
      })}
    >
      <Grid
        container
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={1}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Grid item>
          <Typography
            paragraph
            sx={{ mb: 0 }}
            variant="content"
            color="text.secondary"
          >
            <Typography
              component="span"
              variant="inherit"
              fontWeight="Medium"
              color="primary"
            >
              Important:
            </Typography>{' '}
            This is just a hobby project and not intended to be used for real dating
          </Typography>
        </Grid>
        <Grid item>
          <Link
            underline="always"
            href="https://github.com/rwlanup"
            target="_blank"
          >
            Built by: Anup Rawal
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};
