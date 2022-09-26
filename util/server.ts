import { Interest } from '@prisma/client';

export const groupInterestsByMatch = (
  interests: Interest[] = [],
  currentUserInterests: Interest[] = []
): { matchingInterests: Interest[]; otherInterests: Interest[] } => {
  const matchingInterests: Interest[] = [];
  const otherInterests: Interest[] = [];

  interests.forEach((interest) => {
    const isMatching =
      currentUserInterests.findIndex((currentUserInterest) => currentUserInterest.id === interest.id) !== -1;
    if (isMatching) {
      matchingInterests.push(interest);
    } else {
      otherInterests.push(interest);
    }
  });
  return {
    matchingInterests,
    otherInterests,
  };
};
