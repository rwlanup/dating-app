import type { FC } from 'react';
import { Button } from '../../ui/button/Button';
import { Input } from '../../ui/form/input/Input';
import styles from '../auth-dialog/AuthDialog.module.css';

export const ForgotPasswordForm: FC = () => {
  return (
    <div>
      <h2 className={styles.heading}>Forgot password?</h2>
      <form className={styles.form}>
        <Input
          id="forgot-password-form-email-field"
          type="email"
          name="email"
          label="Email address"
          placeholder="Eg: johndoe@example.com"
        />
        <Button
          hierarchy="tertiary"
          href="/?action=login"
        >
          Back to log in
        </Button>
        <Button type="submit">Send reset password link</Button>
      </form>
    </div>
  );
};
