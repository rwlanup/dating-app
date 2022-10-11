import { Container, Grid, Typography, Link } from '@mui/material';
import type { FC } from 'react';

export const HeaderNote: FC = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        bgcolor: 'grey.900',
        pb: 1,
        pt: 1,
        borderTop: 1,
        mt: 'auto',
        borderColor: 'divider',
        color: 'grey.300',
      }}
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
          >
            <Typography
              component="span"
              variant="inherit"
              fontWeight="Medium"
              color="grey.100"
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
            color="grey.100"
          >
            Built by: Anup Rawal
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};
