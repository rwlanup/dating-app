import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import UploadTwoTone from '@mui/icons-material/UploadTwoTone';
import { GENDER_OPTIONS } from '../../../common/config/selectOption';
import { Controller, useForm } from 'react-hook-form';
import { ProfileSettingInputs, profileSettingSchema } from '../../../common/validation/profile/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ChangeEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { NullPartial } from '../../../types/utils';

interface ProfileSettingFormProps {
  defaultValues?: NullPartial<ProfileSettingInputs>;
  onSubmit: (data: ProfileSettingInputs) => void;
}

export const ProfileSettingForm: FC<ProfileSettingFormProps> = ({ defaultValues, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSettingInputs>({
    resolver: zodResolver(profileSettingSchema),
    defaultValues: defaultValues as unknown as ProfileSettingInputs,
  });

  const _onSubmit = handleSubmit((data) => {
    const reader = new FileReader();
    if (data.profilePicture instanceof File) {
      reader.readAsDataURL(data.profilePicture);
    }
    reader.onloadend = () => {
      onSubmit({
        ...data,
        profilePicture: reader.result,
      });
    };
  });

  const handleFileInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    changeHandler: (...args: unknown[]) => void
  ): void => {
    if (event.target.files?.length) {
      changeHandler(event.target.files.item(0));
    }
  };

  const handleDateInputChange = (value: Dayjs | null, changeHandler: (...args: unknown[]) => void): void => {
    if (value) {
      changeHandler(value.toDate());
    } else {
      changeHandler(null);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={_onSubmit}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{ mb: 4 }}
      >
        Edit your profile
      </Typography>
      <Grid
        container
        spacing={2.5}
        sx={{ mb: 2.5 }}
      >
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <InputLabel htmlFor="profile-form-name-field">Full name</InputLabel>
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Eg. John Doe"
                required
                id="profile-form-name-field"
                error={Boolean(errors.fullName?.message)}
                helperText={errors.fullName?.message}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <InputLabel htmlFor="profile-form-profession-field">Profession</InputLabel>
          <Controller
            control={control}
            name="profession"
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Eg. Doctor"
                required
                id="profile-form-profession-field"
                error={Boolean(errors.profession?.message)}
                helperText={errors.profession?.message}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <InputLabel htmlFor="profile-form-gender-field">Gender</InputLabel>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                {...field}
                id="profile-form-gender-field"
                required
                displayEmpty
                error={Boolean(errors.gender?.message)}
                renderValue={(selected: string | undefined) => {
                  const option = GENDER_OPTIONS.find((option) => option.value === selected);
                  if (!option) {
                    return (
                      <Box
                        component="span"
                        sx={{ color: 'text.disabled' }}
                      >
                        Select a gender
                      </Box>
                    );
                  }
                  return option.label;
                }}
              >
                <MenuItem
                  disabled
                  value=""
                >
                  Select a gender
                </MenuItem>
                {GENDER_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.gender?.message && <FormHelperText error>{errors.gender?.message}</FormHelperText>}
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <InputLabel htmlFor="profile-form-dob-field">Date of Birth</InputLabel>
          <Controller
            control={control}
            name="dob"
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...field}
                  minDate={dayjs().add(-90, 'years')}
                  maxDate={dayjs().add(-13, 'years')}
                  value={field.value || null}
                  onChange={(value) => handleDateInputChange(value as unknown as Dayjs, field.onChange)}
                  disableFuture
                  openTo="year"
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      {...params}
                      id="profile-form-dob-field"
                      name={field.name}
                      error={Boolean(errors.dob?.message)}
                      helperText={errors.dob?.message as string}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <InputLabel htmlFor="profile-form-country-field">Country</InputLabel>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Eg. United States"
                required
                id="profile-form-country-field"
                error={Boolean(errors.country?.message)}
                helperText={errors.country?.message}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <InputLabel htmlFor="profile-form-city-field">City</InputLabel>
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Eg. New York"
                required
                id="profile-form-city-field"
                error={Boolean(errors.city?.message)}
                helperText={errors.city?.message}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <InputLabel htmlFor="profile-form-bio-field">Bio</InputLabel>
          <Controller
            control={control}
            name="bio"
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="About yourself"
                required
                multiline
                minRows={5}
                id="profile-form-bio-field"
                error={Boolean(errors.bio?.message)}
                helperText={errors.bio?.message}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <InputLabel htmlFor="profile-form-profilePicture-field">Profile picture</InputLabel>
          <br />
          <Button
            startIcon={<UploadTwoTone />}
            component="label"
            sx={(theme) => ({
              borderRadius: `${theme.shape.borderRadius}px`,
            })}
            variant="outlined"
            size="small"
          >
            Upload photo
            <Controller
              control={control}
              name="profilePicture"
              render={({ field }) => (
                <Box
                  ref={field.ref}
                  onBlur={field.onBlur}
                  name={field.name}
                  onChange={(event) => handleFileInputChange(event, field.onChange)}
                  id="profile-form-profilePicture-field"
                  component="input"
                  type="file"
                  accept="image/*"
                  sx={{ display: 'none' }}
                />
              )}
            />
          </Button>
          {errors.profilePicture?.message && (
            <FormHelperText error>{errors.profilePicture.message as string}</FormHelperText>
          )}
        </Grid>
      </Grid>
      <Button
        size="large"
        type="submit"
      >
        Update profile
      </Button>
    </Box>
  );
};
