import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { Button } from '../../ui/button/Button';
import styles from './Header.module.css';
import Logo from '../../../../public/images/logo.svg';

const Header: FC = () => {
  return (
    <header className="container-fluid py-3">
      <Button
        hierarchy="secondary"
        href="#main"
        className={styles.skipNavBtn}
      >
        Skip navigation
      </Button>
      <nav className={styles.navbar}>
        <Link href="/">
          <a className={styles.logoWrapper}>
            <Image
              src={Logo}
              width={100}
              height={40}
              objectPosition="left center"
              alt="Ditto Logo"
            />
          </a>
        </Link>
        <div className={styles.desktopAccountBtns}>
          <Button
            variant="outlined"
            href="/login"
          >
            Log in
          </Button>
          <Button href="/register">Create account</Button>
        </div>
        <Button
          href="/login"
          className={styles.mobileAccountBtn}
        >
          Log in
        </Button>
      </nav>
    </header>
  );
};

export default Header;
