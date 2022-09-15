import type { NextPage } from 'next';
import { ErrorScreen } from '../components/pages/error-screen/ErrorScreen';

const ServerErrorPage: NextPage = () => {
  return (
    <ErrorScreen
      title="500 Internal Server Error"
      message="Oops, something went wrong, please try again later :("
    />
  );
};

export default ServerErrorPage;
