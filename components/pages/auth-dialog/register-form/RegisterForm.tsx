import { Box, DialogContent, DialogTitle, InputLabel, Link, TextField, Grid, Alert } from '@mui/material';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterInputs, registerSchema } from '../../../../common/validation/auth/register';
import { trpc } from '../../../../util/trpc';
import LoadingButton from '@mui/lab/LoadingButton';
import { showLoginFormInAuthDialog } from '../../../../store/authDialogUIStore';

const FORM_DEFAULT_VALUES: RegisterInputs = {
  fullName: '',
  username: '',
  password: '',
  confirmPassword: '',
};

export const RegisterForm: FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const {
    mutate: registerAccount,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  } = trpc.useMutation('auth.register', {
    onSuccess() {
      reset();
    },
  });

  const onSubmit = handleSubmit((data) => {
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
            {isSuccess && (
              <Alert
                sx={{ mt: 2 }}
                severity="success"
              >
                {data.message}
              </Alert>
            )}
            {isError && (
              <Alert
                sx={{ mt: 2 }}
                severity="error"
              >
                {error.message}
              </Alert>
            )}
            <Grid item>
              <InputLabel htmlFor="register-form-name-field">Full name</InputLabel>
              <Controller
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
              <InputLabel htmlFor="register-form-username-field">Username</InputLabel>
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <TextField
                    {...field}
                    disabled={isLoading}
                    helperText={errors.username?.message}
                    error={Boolean(errors.username)}
                    placeholder="Eg. johndoe"
                    required
                    name="username"
                    id="register-form-username-field"
                  />
                )}
              />
            </Grid>
            <Grid item>
              <InputLabel htmlFor="register-form-password-field">Password</InputLabel>
              <Controller
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
          <LoadingButton
            loading={isLoading}
            fullWidth
            type="submit"
          >
            Create account
          </LoadingButton>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 1 }}>
            <Link
              component="button"
              onClick={showLoginFormInAuthDialog}
            >
              Already a member? Log in
            </Link>
          </Box>
        </Box>
      </DialogContent>
    </>
  );
};
