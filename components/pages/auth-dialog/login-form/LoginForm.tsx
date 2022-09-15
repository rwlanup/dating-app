import { Alert, Box, DialogContent, DialogTitle, InputLabel, Link, TextField } from '@mui/material';
import { FC, useState } from 'react';
import NextLink from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { LoginInputs, loginSchema } from '../../../../common/validation/auth/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/router';

const FORM_DEFAULT_VALUES: LoginInputs = {
  username: '',
  password: '',
};

interface FormUIState {
  isLoading: boolean;
  isError: boolean;
  error?: string;
}

export const LoginForm: FC = () => {
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const [{ isError, isLoading, error }, setFormUIState] = useState<FormUIState>({
    isLoading: false,
    isError: false,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setFormUIState({
        isLoading: true,
        isError: false,
      });
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });
      if (!result?.ok) {
        setFormUIState((prevState) => ({
          ...prevState,
          isLoading: false,
          isError: true,
          error: 'Your username or password does not match',
        }));
      } else {
        router.replace('/profile');
      }
    } catch (error) {
      setFormUIState((prevState) => ({
        ...prevState,
        isLoading: false,
        isError: true,
        error: 'Something went wrong, please try again :(',
      }));
    }
  });

  return (
    <>
      <DialogTitle variant="h3">Log in to your account</DialogTitle>
      <DialogContent>
        <Box
          sx={{ pt: 1 }}
          component="form"
          onSubmit={onSubmit}
        >
          {isError && (
            <Alert
              sx={{ mb: 2 }}
              severity="error"
            >
              {error}
            </Alert>
          )}
          <Box sx={{ mb: 2.5 }}>
            <InputLabel htmlFor="login-form-username-field">Username</InputLabel>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.username?.message)}
                  helperText={errors.username?.message}
                  placeholder="Eg. johndoe"
                  required
                  disabled={isLoading}
                  type="text"
                  name="username"
                  id="login-form-username-field"
                />
              )}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <InputLabel htmlFor="login-form-password-field">Password</InputLabel>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.password?.message)}
                  helperText={errors.password?.message}
                  placeholder="Password"
                  required
                  disabled={isLoading}
                  name="password"
                  type="password"
                  id="login-form-password-field"
                />
              )}
            />
          </Box>
          <LoadingButton
            loading={isLoading}
            fullWidth
            type="submit"
          >
            Log in
          </LoadingButton>
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
