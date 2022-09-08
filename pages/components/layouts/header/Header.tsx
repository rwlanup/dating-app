import { FC } from 'react';
import { Button } from '../../ui/button/Button';
import styles from './Header.module.css';

const Header: FC = () => {
  return (
    <header>
      <Button
        hierarchy="secondary"
        href="#main"
        className={styles.skipNavBtn}
      >
        Skip navigation
      </Button>
    </header>
  );
};

export default Header;
