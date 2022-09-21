import { Box } from '@mui/material';
import { NextPage } from 'next';
import { useState } from 'react';
import { PaginationInputs } from '../../common/validation/pagination/pagination';
import { SearchForm } from '../../components/others/search-form/SearchForm';
import { ProfileList } from '../../components/pages/profile-list/ProfileList';
import { LoadMoreButton } from '../../components/ui/load-more-button/LoadMoreButton';
import { ProfileListItem } from '../../types/profile';
import { trpc } from '../../util/trpc';
const DiscoverPartnersPage: NextPage = () => {
  const [paginationData, setPaginationData] = useState<PaginationInputs>({
    cursor: undefined,
    search: '',
  });

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = trpc.useInfiniteQuery(
    ['friends.discover', paginationData],
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
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

  return (
    <>
      <SearchForm onSubmit={onSearchChange} />
      <ProfileList
        profiles={profiles()}
        isLoading={isLoading}
      />
      {hasNextPage && (
        <Box sx={{ display: 'flex', mt: 3, justifyContent: 'center' }}>
          <LoadMoreButton
            onClick={onFetchNextPage}
            loading={isLoading || isFetchingNextPage}
          />
        </Box>
      )}
    </>
  );
};

export default DiscoverPartnersPage;
