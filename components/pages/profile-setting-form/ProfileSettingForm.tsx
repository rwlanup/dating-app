import { Box, Button, Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { GENDER_OPTIONS } from '../../../common/config/selectOption';
import { useForm } from 'react-hook-form';
import { ProfileSettingInputs, profileSettingSchema } from '../../../common/validation/profile/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { NullPartial } from '../../../types/utils';
import { AppTextField } from '../../ui/app-text-field/AppTextField';
import { AppSelect } from '../../ui/app-select/AppSelect';
import { AppDatePicker } from '../../ui/app-date-picker/AppDatePicker';
import { AppImageInput } from '../../ui/app-image-input/AppImageInput';

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
          <AppTextField
            id="profile-form-name-field"
            control={control}
            name="fullName"
            placeholder="Eg. John Doe"
            required
            error={errors.fullName?.message}
            label="Full name"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <AppTextField
            id="profile-form-professioin-field"
            control={control}
            name="profession"
            placeholder="Eg. Doctor"
            required
            error={errors.profession?.message}
            label="Profession"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <AppSelect
            id="profile-form-gender-field"
            control={control}
            name="gender"
            required
            placeholder="Select a gender"
            error={errors.gender?.message}
            options={GENDER_OPTIONS}
            label="Gender"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <AppDatePicker
            id="profile-form-dob-field"
            control={control}
            name="dob"
            DatePickerProps={{
              minDate: dayjs().add(-90, 'years'),
              maxDate: dayjs().add(-13, 'years'),
              disableFuture: true,
              openTo: 'year',
            }}
            error={errors.dob?.message}
            label="Date of Birth"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <AppTextField
            id="profile-form-country-field"
            control={control}
            name="country"
            placeholder="Eg. United States"
            required
            error={errors.country?.message}
            label="Country"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
        >
          <AppTextField
            id="profile-form-city-field"
            control={control}
            name="city"
            placeholder="Eg. New York"
            required
            error={errors.city?.message}
            label="City"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <AppTextField
            id="profile-form-bio-field"
            control={control}
            name="bio"
            placeholder="About yourself"
            required
            error={errors.bio?.message}
            label="Bio"
            TextFieldProps={{ multiline: true, minRows: 5 }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <AppImageInput
            id="profile-form-profilePicture-field"
            label="Profile picture"
            control={control}
            name="profilePicture"
            error={errors.profilePicture?.message as string}
            helperText="Only image under 2MB is supported"
          />
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
