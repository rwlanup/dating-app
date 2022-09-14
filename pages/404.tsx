import type { FC } from 'react';
import { ErrorScreen } from '../components/pages/error-screen/ErrorScreen';

const NotFoundPage: FC = () => {
  return (
    <ErrorScreen
      title="404 Page not found"
      message="Oops, looks like this page does not exist anymore :("
    />
  );
};

export default NotFoundPage;
