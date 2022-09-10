import type { FC } from 'react';
import { Button } from '../../ui/button/Button';
import { Input } from '../../ui/form/input/Input';
import { TextLink } from '../../ui/text-link/TextLink';
import styles from '../auth-dialog/AuthDialog.module.css';

export const RegisterForm: FC = () => {
  return (
    <div>
      <h2 className={styles.heading}>Create your account</h2>
      <form className={styles.form}>
        <Input
          id="register-form-fullName-field"
          label="Full name"
          name="fullName"
          placeholder="Eg: John Doe"
          autoFocus
        />
        <Input
          id="register-form-email-field"
          type="email"
          name="email"
          label="Email address"
          placeholder="Eg: johndoe@example.com"
        />
        <Input
          id="register-form-password-field"
          type="password"
          name="password"
          label="Password"
          placeholder="Your password"
        />
        <Input
          id="register-form-confirmPassword-field"
          type="password"
          name="confirmPassword"
          label="Re-type password"
          placeholder="Re-type your password"
        />
        <Button type="submit">Create account</Button>
      </form>
      <div className={styles.footerLinkWrapper}>
        <TextLink href="/?action=login">Already a member? Log in</TextLink>
      </div>
    </div>
  );
};
