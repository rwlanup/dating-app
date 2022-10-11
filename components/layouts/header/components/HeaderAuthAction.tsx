import { Skeleton } from '@mui/material';
import { useSession } from 'next-auth/react';
import { FC, Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicHeaderAuthActionGuest = dynamic(() => import('./HeaderAuthActionGuest'), {
  suspense: true,
});

const DynamicHeaderAvatar = dynamic(() => import('./HeaderAvatar'), {
  suspense: true,
});

const HeaderAvatarSkeleton = () => {
  return (
    <Skeleton
      variant="circular"
      height={40}
      width={40}
    />
  );
};

export const HeaderAuthAction: FC = () => {
  const session = useSession();

  if (session.status === 'authenticated')
    return (
      <Suspense fallback={<HeaderAvatarSkeleton />}>
        <DynamicHeaderAvatar />
      </Suspense>
    );

  if (session.status === 'loading') return <HeaderAvatarSkeleton />;

  return (
    <Suspense fallback={<HeaderAvatarSkeleton />}>
      <DynamicHeaderAuthActionGuest />
    </Suspense>
  );
};
