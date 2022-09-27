import { Box } from '@mui/material';
import { NextPage } from 'next';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { PaginationInputs } from '../../common/validation/pagination/pagination';
import { SearchForm } from '../../components/others/search-form/SearchForm';
import { ErrorScreen } from '../../components/pages/error-screen/ErrorScreen';
import { ProfileList } from '../../components/pages/profile-list/ProfileList';
import { LoadMoreButton } from '../../components/ui/load-more-button/LoadMoreButton';
import { useFriendsList } from '../../hooks/useFriendsList';
import { ProfileListItem } from '../../types/profile';
import { trpc } from '../../util/trpc';
const DiscoverPartnersPage: NextPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [paginationData, setPaginationData] = useState<PaginationInputs>({
    cursor: undefined,
    search: '',
  });

  const {
    isLoading: friendsListLoading,
    isError: friendsListError,
    errorMessage: friendsListErrorMessage,
  } = useFriendsList();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, isError, error } = trpc.useInfiniteQuery(
    ['friends.discover', paginationData],
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      onError: () => {
        if (data) {
          enqueueSnackbar('Something went wrong, please try again later', { variant: 'error' });
        }
      },
    }
  );

  const onSearchChange = (value: string) => {
    setPaginationData({
      search: value,
      cursor: undefined,
    });
  };

  const onFetchNextPage = (): void => {
    if (data && !isLoading && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const profiles = (): ProfileListItem[] | undefined => {
    return data?.pages.reduce<ProfileListItem[]>((prevProfiles, page) => {
      return [...prevProfiles, ...page.items];
    }, []);
  };

  if ((isError && !data) || friendsListError) {
    return (
      <ErrorScreen
        title="500 Server error"
        message={error?.message || friendsListErrorMessage}
        hideBtn
      />
    );
  }

  const loading = isLoading || friendsListLoading;

  return (
    <>
      <SearchForm
        onSubmit={onSearchChange}
        isLoading={loading || isFetchingNextPage}
      />
      <ProfileList
        profiles={profiles()}
        isLoading={loading}
      />
      {hasNextPage && (
        <Box sx={{ display: 'flex', mt: 3, justifyContent: 'center' }}>
          <LoadMoreButton
            onClick={onFetchNextPage}
            loading={loading || isFetchingNextPage}
          />
        </Box>
      )}
    </>
  );
};

export default DiscoverPartnersPage;
