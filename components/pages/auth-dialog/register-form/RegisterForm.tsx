import { Box, Button, DialogContent, DialogTitle, InputLabel, Link, TextField, Grid } from '@mui/material';
import type { FC } from 'react';
import NextLink from 'next/link';

export const RegisterForm: FC = () => {
  return (
    <>
      <DialogTitle variant="h3">Create your account</DialogTitle>
      <DialogContent>
        <Box
          sx={{ pt: 1 }}
          component="form"
        >
          <Grid
            container
            direction="column"
            rowSpacing={2.5}
            sx={{ mb: 4 }}
          >
            <Grid item>
              <InputLabel htmlFor="register-form-name-field">Full name</InputLabel>
              <TextField
                autoFocus
                placeholder="Eg. John Doe"
                required
                name="fullName"
                id="register-form-name-field"
              />
            </Grid>
            <Grid item>
              <InputLabel htmlFor="register-form-email-field">Email address</InputLabel>
              <TextField
                placeholder="Eg. johndoe@example.com"
                required
                name="email"
                type="email"
                id="register-form-email-field"
              />
            </Grid>
            <Grid item>
              <InputLabel htmlFor="register-form-password-field">Password</InputLabel>
              <TextField
                placeholder="Password"
                required
                name="password"
                type="password"
                id="register-form-password-field"
              />
            </Grid>
            <Grid item>
              <InputLabel htmlFor="register-form-confirm_password-field">Re-type password</InputLabel>
              <TextField
                placeholder="Re-type password"
                required
                name="confirmPassword"
                type="password"
                id="register-form-confirm_password-field"
              />
            </Grid>
          </Grid>
          <Button fullWidth>Create account</Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 1 }}>
            <NextLink
              href="?action=login"
              passHref
            >
              <Link>Already a member? Log in</Link>
            </NextLink>
          </Box>
        </Box>
      </DialogContent>
    </>
  );
};
