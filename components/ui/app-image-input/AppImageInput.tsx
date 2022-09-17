import { InputLabel, FormHelperText, Button, Box, BoxProps } from '@mui/material';
import { Controller, FieldValues, Path, UseControllerProps } from 'react-hook-form';
import UploadTwoTone from '@mui/icons-material/UploadTwoTone';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

interface AppImageInputProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>
  extends UseControllerProps<TFieldValues, TName> {
  error?: string | undefined;
  helperText?: string | undefined;
  label?: string;
  uploadBtnLabel?: string;
  id?: string;
  required?: boolean;
  InputProps?: BoxProps<'input', InputHTMLAttributes<HTMLInputElement>>;
}

export const AppImageInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  name,
  control,
  defaultValue,
  error,
  helperText,
  label,
  rules,
  shouldUnregister,
  id,
  required,
  InputProps,
  uploadBtnLabel = 'Upload photo',
}: AppImageInputProps<TFieldValues, TName>) => {
  const hasError = Boolean(error);

  const handleFileInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    changeHandler: (...args: unknown[]) => void
  ): void => {
    if (event.target.files?.length) {
      changeHandler(event.target.files.item(0));
    }
  };

  return (
    <>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <br />
      <Button
        startIcon={<UploadTwoTone />}
        component="label"
        sx={(theme) => ({
          borderRadius: `${theme.shape.borderRadius}px`,
        })}
        variant="outlined"
        size="small"
      >
        {uploadBtnLabel}
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          rules={rules}
          shouldUnregister={shouldUnregister}
          render={({ field }) => (
            <Box
              ref={field.ref}
              onBlur={field.onBlur}
              name={field.name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleFileInputChange(event, field.onChange)}
              id={id}
              required={required}
              component="input"
              type="file"
              accept="image/*"
              sx={{ display: 'none' }}
              {...InputProps}
            />
          )}
        />
      </Button>
      {(hasError || helperText) && <FormHelperText error={hasError}>{error || helperText}</FormHelperText>}
    </>
  );
};
