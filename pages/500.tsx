import type { NextPage } from 'next';
import { ErrorScreen } from '../components/pages/error-screen/ErrorScreen';
import Head from 'next/head';

const ServerErrorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>500 Internal Server Error | Ditto</title>
      </Head>
      <ErrorScreen
        title="500 Internal Server Error"
        message="Oops, something went wrong, please try again later :("
      />
    </>
  );
};

export default ServerErrorPage;
