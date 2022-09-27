import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ErrorScreen } from '../../components/pages/error-screen/ErrorScreen';
import { ProfileDetailHeader } from '../../components/pages/profile-detail/ProfileDetailHeader';
import { ProfileDetailInterests } from '../../components/pages/profile-detail/ProfileDetailInterests';
import { ProfileDetailSkeleton } from '../../components/pages/profile-detail/ProfileDetailSkeleton';
import { useFriendsList } from '../../hooks/useFriendsList';
import { trpc } from '../../util/trpc';

const ProfileDetailPage: NextPage = () => {
  const router = useRouter();
  const username = router.query.username;

  const {
    isLoading: friendsListLoading,
    isError: friendsListError,
    errorMessage: friendsListErrorMessage,
  } = useFriendsList();
  const { data, isLoading, isError, error } = trpc.useQuery(['profile.byUsername', username as string]);

  if (isError || friendsListError) {
    const is404 = error?.data?.code === 'NOT_FOUND';
    return (
      <ErrorScreen
        title={is404 ? '404 not found' : '500 server error'}
        message={error?.message || friendsListErrorMessage}
        hideBtn
      />
    );
  }

  if (isLoading || !data || friendsListLoading) {
    return <ProfileDetailSkeleton />;
  }

  return (
    <>
      <ProfileDetailHeader profile={data} />
      <ProfileDetailInterests
        bio={data.bio}
        interests={data.interests}
      />
    </>
  );
};

export default ProfileDetailPage;
