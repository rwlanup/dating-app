import { Box, FormHelperText, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import { ReactNode, useCallback } from 'react';
import { Controller, FieldValues, Path, PathValue, UseControllerProps } from 'react-hook-form';

interface AppSelectProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>
  extends UseControllerProps<TFieldValues, TName> {
  placeholder?: string;
  error?: string | undefined;
  helperText?: string | undefined;
  label?: string;
  id?: string;
  required?: boolean;
  SelectProps?: SelectProps<PathValue<TFieldValues, TName>>;
  options: { label: string; value: string }[];
}

export const AppSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  name,
  SelectProps,
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
  options,
}: AppSelectProps<TFieldValues, TName>) => {
  const hasError = Boolean(error);
  const hasPlaceholder = Boolean(placeholder);

  const renderValue = useCallback(
    (value: PathValue<TFieldValues, TName>): ReactNode => {
      if (hasPlaceholder && (!value || value.length === 0)) {
        return (
          <Box
            component="span"
            sx={{ color: 'text.disabled' }}
          >
            {placeholder}
          </Box>
        );
      }

      if (Array.isArray(value)) {
        const selectedOptions = options.filter((option) => value.includes(option.value));
        if (selectedOptions.length) {
          return selectedOptions.map((option) => option.label).join(', ');
        }
      }
      return options.find((option) => option.value === value)?.label;
    },
    [options, placeholder, hasPlaceholder]
  );

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
          <Select
            {...field}
            id={id}
            required={required}
            displayEmpty={hasPlaceholder}
            error={hasError}
            renderValue={renderValue}
            {...SelectProps}
          >
            {hasPlaceholder && (
              <MenuItem
                disabled
                value=""
              >
                {placeholder}
              </MenuItem>
            )}
            {options.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {(error || helperText) && <FormHelperText error={hasError}>{error || helperText}</FormHelperText>}
    </>
  );
};
