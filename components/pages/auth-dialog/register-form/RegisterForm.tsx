import { Box, Button, DialogContent, DialogTitle, InputLabel, Link, TextField, Grid } from '@mui/material';
import type { FC } from 'react';
import NextLink from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterInputs, registerSchema } from '../../../../common/validation/auth/register';
import { trpc } from '../../../../util/trpc';

export const RegisterForm: FC = () => {
  const {
    mutateAsync: registerAccount,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  } = trpc.useMutation('authRegister', {
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterInputs>({
    // resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async (data) => {
    registerAccount(data);
  });

  return (
    <>
      <DialogTitle variant="h3">Create your account</DialogTitle>
      <DialogContent>
        <Box
          sx={{ pt: 1 }}
          component="form"
          onSubmit={onSubmit}
        >
          <Grid
            container
            direction="column"
            rowSpacing={2.5}
            sx={{ mb: 4 }}
          >
            <Grid item>
              <InputLabel htmlFor="register-form-name-field">Full name</InputLabel>
              <Controller
                defaultValue=""
                control={control}
                name="fullName"
                render={({ field }) => (
                  <TextField
                    {...field}
                    disabled={isLoading}
                    helperText={errors.fullName?.message}
                    error={Boolean(errors.fullName)}
                    placeholder="Eg. John Doe"
                    required
                    name="fullName"
                    id="register-form-name-field"
                  />
                )}
              />
            </Grid>
            <Grid item>
              <InputLabel htmlFor="register-form-email-field">Email address</InputLabel>
              <Controller
                defaultValue=""
                control={control}
                name="email"
                render={({ field }) => (
                  <TextField
                    {...field}
                    disabled={isLoading}
                    helperText={errors.email?.message}
                    error={Boolean(errors.email)}
                    placeholder="Eg. johndoe@example.com"
                    required
                    name="email"
                    type="email"
                    id="register-form-email-field"
                  />
                )}
              />
            </Grid>
            <Grid item>
              <InputLabel htmlFor="register-form-password-field">Password</InputLabel>
              <Controller
                defaultValue=""
                control={control}
                name="password"
                render={({ field }) => (
                  <TextField
                    {...field}
                    disabled={isLoading}
                    helperText={errors.password?.message}
                    error={Boolean(errors.password)}
                    placeholder="Password"
                    required
                    name="password"
                    type="password"
                    id="register-form-password-field"
                  />
                )}
              />
            </Grid>
            <Grid item>
              <InputLabel htmlFor="register-form-confirm_password-field">Re-type password</InputLabel>
              <Controller
                defaultValue=""
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <TextField
                    {...field}
                    disabled={isLoading}
                    helperText={errors.confirmPassword?.message}
                    error={Boolean(errors.confirmPassword)}
                    placeholder="Re-type password"
                    required
                    name="confirmPassword"
                    type="password"
                    id="register-form-confirm_password-field"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            disabled={isLoading}
            fullWidth
            type="submit"
          >
            Create account
          </Button>
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
