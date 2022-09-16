import { NextPage } from 'next';
import { ProfileSettingInputs } from '../../common/validation/profile/setting';
import { trpc } from '../../util/trpc';
import { useSnackbar } from 'notistack';
import { ProfileSettingForm } from '../../components/pages/profile-setting-form/ProfileSettingForm';

const ProfileSettingDefaultValues: Partial<ProfileSettingInputs> = {
  city: '',
  country: '',
  fullName: '',
  gender: '',
  profession: '',
};

const ProfileSettingsPage: NextPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = trpc.useMutation('profile.update', {
    onError(error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
    onSuccess(data) {
      enqueueSnackbar(data.message, { variant: 'success' });
    },
  });

  return (
    <ProfileSettingForm
      defaultValues={ProfileSettingDefaultValues}
      onSubmit={mutate}
    />
  );
};

export default ProfileSettingsPage;
