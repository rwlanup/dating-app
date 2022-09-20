import { NextPage } from 'next';
import { ProfileList } from '../../components/pages/profile-list/ProfileList';
import { trpc } from '../../util/trpc';
const DiscoverPartnersPage: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['friends.discover']);

  return (
    <ProfileList
      profiles={data}
      isLoading={isLoading}
    />
  );
};

export default DiscoverPartnersPage;
