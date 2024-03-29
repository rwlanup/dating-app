import { NextPage } from 'next';
import { useSnackbar } from 'notistack';
import { TTL } from '../../../common/config/support';
import { InterestsForm } from '../../../components/pages/interests-form/InterestsForm';
import { InterestsFormSkeleton } from '../../../components/pages/interests-form/InterestsFormSkeleton';
import { trpc } from '../../../util/trpc';
import Head from 'next/head';

const InterestsSettingPage: NextPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading: isInterestsLoading } = trpc.useQuery(['interests.mine'], {
    select(interests) {
      return { interests: interests.map((interest) => interest.name) };
    },
    staleTime: TTL,
  });

  const { mutate, isLoading } = trpc.useMutation('interests.update', {
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  if (isInterestsLoading) return <InterestsFormSkeleton />;
  return (
    <>
      <Head>
        <title>Interests | Ditto</title>
        <meta
          name="description"
          content="Manage your interests in life and get the soulmate with matching interests"
        />
      </Head>
      <InterestsForm
        onSubmit={mutate}
        isLoading={isLoading}
        defaultValues={data}
      />
    </>
  );
};

export default InterestsSettingPage;
