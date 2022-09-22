import { ParsedUrlQuery } from 'querystring';
import { PaginationInputs } from '../common/validation/pagination/pagination';

export const getPaginationDataFromQuery = (query: ParsedUrlQuery): PaginationInputs => {
  const searchQuery = query.search;
  const pageQuery = query.page;

  const search = typeof searchQuery === 'string' ? searchQuery : '';
  const page = typeof pageQuery === 'string' && !isNaN(parseInt(pageQuery)) ? parseInt(pageQuery) : 1;

  return {
    search,
    page,
  };
};
