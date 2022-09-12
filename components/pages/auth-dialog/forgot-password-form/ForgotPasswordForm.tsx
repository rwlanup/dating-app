import { Box, Button, DialogContent, DialogTitle, InputLabel, Link, TextField } from '@mui/material';
import type { FC } from 'react';
import NextLink from 'next/link';

export const ForgotPasswordForm: FC = () => {
  return (
    <>
      <DialogTitle variant="h3">Forgot your password?</DialogTitle>
      <DialogContent>
        <Box
          sx={{ pt: 1 }}
          component="form"
        >
          <Box sx={{ mb: 4 }}>
            <InputLabel htmlFor="forgot-password-form-email-field">Email address</InputLabel>
            <TextField
              autoFocus
              placeholder="Eg. johndoe@example.com"
              required
              name="email"
              type="email"
              id="forgot-password-form-email-field"
            />
          </Box>
          <Button fullWidth>Send password reset link</Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 1 }}>
            <NextLink
              href="?action=login"
              passHref
            >
              <Link>Back to log in</Link>
            </NextLink>
          </Box>
        </Box>
      </DialogContent>
    </>
  );
};
