import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, TextFieldProps, Typography } from '@mui/material';
import { NextPage } from 'next';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import UploadTwoTone from '@mui/icons-material/UploadTwoTone';

const GENDER_OPTIONS: {
  label: string;
  value: string;
}[] = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other (looking for Male)', value: 'MALE_OTHER' },
  { label: 'Other (looking for Female)', value: 'FEMALE_OTHER' },
];

const ProfileSettingsPage: NextPage = () => {
  return (
    <Box component="form">
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
        >
          <InputLabel htmlFor="profile-form-name-field">Full name</InputLabel>
          <TextField
            placeholder="Eg. John Doe"
            required
            name="fullName"
            id="profile-form-name-field"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <InputLabel htmlFor="profile-form-profession-field">Profession</InputLabel>
          <TextField
            placeholder="Eg. Doctor"
            required
            name="profession"
            id="profile-form-profession-field"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <InputLabel htmlFor="profile-form-gender-field">Gender</InputLabel>
          <Select
            id="profile-form-gender-field"
            required
            name="gender"
            defaultValue=""
            displayEmpty
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
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <InputLabel htmlFor="profile-form-dob-field">Date of Birth</InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value=""
              openTo="year"
              onChange={(value) => console.log(value)}
              renderInput={(params: TextFieldProps) => (
                <TextField
                  {...params}
                  id="profile-form-dob-field"
                  name="dob"
                  error={false}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <InputLabel htmlFor="profile-form-country-field">Country</InputLabel>
          <TextField
            placeholder="Eg. United States"
            required
            name="country"
            id="profile-form-country-field"
          />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
        >
          <InputLabel htmlFor="profile-form-city-field">City</InputLabel>
          <TextField
            placeholder="Eg. New York"
            required
            name="city"
            id="profile-form-city-field"
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
          >
            Upload photo
            <Box
              component="input"
              type="file"
              accept="image/*"
              sx={{ display: 'none' }}
            />
          </Button>
        </Grid>
      </Grid>
      <Button type="submit">Update profile</Button>
    </Box>
  );
};

export default ProfileSettingsPage;
