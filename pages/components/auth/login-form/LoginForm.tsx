import Link from 'next/link';
import type { FC } from 'react';
import { Button } from '../../ui/button/Button';
import { Input } from '../../ui/form/input/Input';
import { TextLink } from '../../ui/text-link/TextLink';
import styles from '../auth-dialog/AuthDialog.module.css';

export const LoginForm: FC = () => {
  return (
    <div>
      <h2 className={styles.heading}>Log in to your account</h2>
      <form className={styles.form}>
        <Input
          id="login-form-email-field"
          type="email"
          name="email"
          label="Email address"
          placeholder="Eg: johndoe@example.com"
        />
        <Input
          id="login-form-password-field"
          type="password"
          name="password"
          label="Password"
          placeholder="Your password"
        />
        <Button
          href="/?action=forgot-password"
          hierarchy="tertiary"
        >
          Forgot password?
        </Button>
        <Button type="submit">Log in</Button>
      </form>
      <div className={styles.footerLinkWrapper}>
        <TextLink href="/?action=register">Not a member? Create account</TextLink>
      </div>
    </div>
  );
};
