import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { Button } from '../../ui/button/Button';
import styles from './Header.module.css';
import Logo from '../../../../public/images/logo.svg';
import { HeaderAuthAction } from './components/HeaderAuthAction';

const Header: FC = () => {
  return (
    <header className="container-fluid py-3">
      <Button
        hierarchy="secondary"
        href="/#main"
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
        <HeaderAuthAction />
      </nav>
    </header>
  );
};

export default Header;
