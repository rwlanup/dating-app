import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

interface LoadMoreButtonProps extends Omit<LoadingButtonProps, 'onClick'> {
  onClick: () => void;
}

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({ onClick, loading, ...props }) => {
  const [isInView, setIsInView] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const observer = useMemo(
    () =>
      typeof window !== 'undefined'
        ? new window.IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting))
        : undefined,
    []
  );

  useEffect(() => {
    if (btnRef.current && observer) {
      observer.observe(btnRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [btnRef, observer]);

  useEffect(() => {
    if (isInView && btnRef.current) {
      btnRef.current.click();
    }
  }, [isInView]);

  return (
    <LoadingButton
      {...props}
      loading={loading}
      ref={btnRef}
      onClick={onClick}
    >
      Load more
    </LoadingButton>
  );
};
