import type { NextPage } from 'next';
import { ErrorScreen } from '../components/pages/error-screen/ErrorScreen';
import Head from 'next/head';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 Page not found | Ditto</title>
      </Head>
      <ErrorScreen
        title="404 Page not found"
        message="Oops, looks like this page does not exist anymore :("
      />
    </>
  );
};

export default NotFoundPage;
