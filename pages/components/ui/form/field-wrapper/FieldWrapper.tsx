import type { FC, LabelHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { mergeClasses } from '../../../../../util/string';
import styles from './FieldWrapper.module.css';

export interface FieldWrapperProps {
  label?: string;
  invalidMessage?: string;
  validMessage?: string;
  helperContent?: ReactNode;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  isOptional?: boolean;
}
export const FieldWrapper: FC<PropsWithChildren<FieldWrapperProps>> = ({
  label,
  children,
  invalidMessage,
  labelProps,
  validMessage,
  helperContent,
  isOptional,
}) => {
  return (
    <div>
      <div className={styles.fieldWrapper}>
        {label && (
          <div className={mergeClasses(styles.labelWrapper, isOptional && styles.optional)}>
            <label {...labelProps}>{label}</label>
            {isOptional && <span className="text-sm">(Optional)</span>}
          </div>
        )}
        {children}

        {helperContent && <div className={styles.helperContent}>{helperContent}</div>}
      </div>
      {invalidMessage && <div className={styles.invalidMessage}>{invalidMessage}</div>}
      {validMessage && <div className={styles.validMessage}>{validMessage}</div>}
    </div>
  );
};
