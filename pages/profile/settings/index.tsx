import { NextPage } from 'next';
import { ProfileSettingInputs } from '../../../common/validation/profile/setting';
import { trpc } from '../../../util/trpc';
import { useSnackbar } from 'notistack';
import { ProfileSettingForm } from '../../../components/pages/profile-setting-form/ProfileSettingForm';
import { ProfileSettingSkeleton } from '../../../components/pages/profile-setting-skeleton/ProfileSettingSkeleton';
import { useMemo } from 'react';
import { NullPartial } from '../../../types/utils';

const ProfileSettingsPage: NextPage = () => {
  const utils = trpc.useContext();
  const { enqueueSnackbar } = useSnackbar();
  const { data, status } = trpc.useQuery(['profile.me'], {
    enabled: false,
  });

  const { mutate, isLoading } = trpc.useMutation(['profile.update'], {
    onError(error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
    onSuccess(data) {
      utils.invalidateQueries(['profile.me']);
      enqueueSnackbar(data.message, { variant: 'success' });
    },
  });

  const formDefaultValues = useMemo<NullPartial<ProfileSettingInputs>>(() => {
    if (data) {
      return {
        fullName: data.fullName,
        profession: data.profession ?? '',
        gender: data.gender ?? '',
        dob: data.dob ?? null,
        country: data.country ?? '',
        city: data.city ?? '',
        bio: data.bio ?? '',
        profilePicture: data.profilePicture,
      };
    }
    return {};
  }, [data]);

  if (status === 'loading' || status === 'idle') {
    return <ProfileSettingSkeleton />;
  }

  return (
    <ProfileSettingForm
      defaultValues={formDefaultValues}
      onSubmit={mutate}
      isLoading={isLoading}
    />
  );
};

export default ProfileSettingsPage;
