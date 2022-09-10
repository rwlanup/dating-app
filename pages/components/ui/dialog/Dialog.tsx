import { FC, HTMLAttributes, MouseEventHandler, PropsWithChildren, useEffect, useRef } from 'react';
import { DialogPortal } from './DialogPortal';
import styles from './Dialog.module.css';
import { mergeClasses } from '../../../../util/string';
import FocusLock from 'react-focus-lock';
import { Button } from '../button/Button';

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
  keepUnmounted?: boolean;
}
export const Dialog: FC<PropsWithChildren<DialogProps>> = ({
  isOpen,
  onClose,
  keepUnmounted,
  children,
  ...otherProps
}) => {
  const dialogBackdropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Esc' || event.key === 'Escape') {
        onClose && onClose();
      }
    };
    document.addEventListener('keyup', handleEscapeKey);

    return () => {
      document.removeEventListener('keyup', handleEscapeKey);
    };
  }, [onClose]);
  if (keepUnmounted && !isOpen) return null;

  const stopEventPropagation: MouseEventHandler = (event): void => {
    event.stopPropagation();
  };

  return (
    <DialogPortal>
      <div
        ref={dialogBackdropRef}
        className={mergeClasses(styles.dialogBackdrop, isOpen && styles.open)}
        onClick={onClose}
      ></div>
      <div
        className={mergeClasses(styles.dialog, isOpen && styles.open)}
        role="dialog"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        aria-hidden={!isOpen}
      >
        <FocusLock
          disabled={!isOpen}
          className={styles.dialogContentWrapper}
        >
          <div
            {...otherProps}
            className={mergeClasses(styles.dialogContent, otherProps.className)}
            onClick={stopEventPropagation}
          >
            {children}
            <Button
              size="sm"
              hierarchy="tertiary"
              onClick={onClose}
              className="absolute right-2 top-2"
            >
              Close
            </Button>
          </div>
        </FocusLock>
      </div>
    </DialogPortal>
  );
};
