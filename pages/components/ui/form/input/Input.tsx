import { FC, InputHTMLAttributes } from 'react';
import { mergeClasses } from '../../../../../util/string';
import { FieldWrapper, FieldWrapperProps } from '../field-wrapper/FieldWrapper';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldWrapperProps {}
export const Input: FC<InputProps> = ({
  labelProps,
  label,
  invalidMessage,
  validMessage,
  helperContent,
  className,
  isOptional,
  ...inputProps
}) => {
  return (
    <FieldWrapper
      label={label}
      labelProps={{ ...labelProps, htmlFor: inputProps.id }}
      invalidMessage={invalidMessage}
      validMessage={validMessage}
      helperContent={helperContent}
      isOptional={isOptional}
    >
      <input
        {...inputProps}
        className={mergeClasses(
          className,
          styles.input,
          invalidMessage && styles.invalid,
          validMessage && styles.valid
        )}
      />
    </FieldWrapper>
  );
};
