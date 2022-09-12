import { Box, Container, Grid, Typography } from '@mui/material';
import type { FC } from 'react';

interface IProcess {
  title: string;
  description: string;
}

const PROCESSES: IProcess[] = [
  {
    title: 'Create your account and fill your interests',
    description:
      'Create your account and fill your personal information and interests with a beautiful profile photos.',
  },
  {
    title: 'Find your matches and send request',
    description: 'Find your matching partners with your interests and send a friend request for a chat.',
  },
  {
    title: 'Impress your matching partners',
    description: 'Chat with your matching partners and talk about life and impress them.',
  },
];

export const Process: FC = () => {
  return (
    <Container
      component="section"
      sx={{ py: { xs: 4, md: 8 } }}
    >
      <Typography
        align="center"
        variant="h2"
        sx={{ mb: { xs: 2, md: 4 } }}
      >
        How it works?
      </Typography>
      <Grid
        container
        spacing={2.5}
      >
        {PROCESSES.map((process, index) => (
          <Grid
            key={index}
            item
            xs={12}
            md={4}
          >
            <Box>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    height: '32px',
                    width: '32px',
                    bgcolor: 'secondary.100',
                    borderRadius: '50%',
                    zIndex: -1,
                    left: -20,
                    top: -8,
                  },
                }}
              >
                <Typography
                  variant="h3"
                  color="secondary"
                >
                  Step {index + 1}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ mb: 1, mt: 2 }}
                >
                  {process.title}
                </Typography>
                <Typography
                  paragraph
                  color="text.secondary"
                >
                  {process.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
