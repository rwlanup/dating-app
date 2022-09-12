import { Box, Button, DialogContent, DialogTitle, InputLabel, Link, TextField } from '@mui/material';
import type { FC } from 'react';
import NextLink from 'next/link';

export const LoginForm: FC = () => {
  return (
    <>
      <DialogTitle variant="h3">Log in to your account</DialogTitle>
      <DialogContent>
        <Box
          sx={{ pt: 1 }}
          component="form"
        >
          <Box sx={{ mb: 2.5 }}>
            <InputLabel htmlFor="login-form-email-field">Email address</InputLabel>
            <TextField
              placeholder="Eg. johndoe@example.com"
              required
              autoFocus
              name="email"
              type="email"
              id="login-form-email-field"
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <InputLabel htmlFor="login-form-password-field">Password</InputLabel>
            <TextField
              placeholder="Password"
              required
              name="password"
              type="password"
              id="login-form-password-field"
            />
          </Box>
          <NextLink
            href="?action=forgot-password"
            passHref
          >
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 2.5 }}
            >
              Forgot password?
            </Button>
          </NextLink>
          <Button fullWidth>Log in</Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 1 }}>
            <NextLink
              href="?action=register"
              passHref
            >
              <Link>Not a member? Create account</Link>
            </NextLink>
          </Box>
        </Box>
      </DialogContent>
    </>
  );
};
