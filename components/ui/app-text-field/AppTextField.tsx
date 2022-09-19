import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { Controller, FieldValues, Path, UseControllerProps } from 'react-hook-form';

interface AppTextFieldProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>
  extends UseControllerProps<TFieldValues, TName> {
  placeholder?: string;
  error?: string | undefined;
  helperText?: string | undefined;
  label?: string;
  id?: string;
  required?: boolean;
  TextFieldProps?: TextFieldProps;
}

export const AppTextField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  name,
  TextFieldProps,
  control,
  defaultValue,
  error,
  helperText,
  label,
  placeholder,
  rules,
  shouldUnregister,
  id,
  required,
}: AppTextFieldProps<TFieldValues, TName>) => {
  return (
    <>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        render={({ field }) => (
          <TextField
            {...field}
            placeholder={placeholder}
            required={required}
            id={id}
            error={Boolean(error)}
            helperText={error || helperText}
            {...TextFieldProps}
          />
        )}
      />
    </>
  );
};
