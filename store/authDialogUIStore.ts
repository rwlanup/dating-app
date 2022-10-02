import { AuthActions } from '../components/pages/auth-dialog/AuthDialog';
import { createStore } from './createStore';

interface AuthDialogUIState {
  isOpen: boolean;
  form: typeof AuthActions[number];
}

let initialAuthDialogUIState: AuthDialogUIState = {
  isOpen: false,
  form: 'login',
};

export const authDialogUIStore = createStore(initialAuthDialogUIState);

export const openAuthDialog = (): void => {
  authDialogUIStore.setState({
    isOpen: true,
  });
};

export const closeAuthDialog = (): void => {
  authDialogUIStore.setState({
    isOpen: false,
  });
};

export const showLoginFormInAuthDialog = (): void => {
  authDialogUIStore.setState({
    form: 'login',
    isOpen: true,
  });
};

export const showRegisterFormInAuthDialog = (): void => {
  authDialogUIStore.setState({
    form: 'register',
    isOpen: true,
  });
};
