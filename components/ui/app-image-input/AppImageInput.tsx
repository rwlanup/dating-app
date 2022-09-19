import { InputLabel, FormHelperText, Button, Box, BoxProps } from '@mui/material';
import { Controller, FieldValues, Path, UseControllerProps } from 'react-hook-form';
import UploadTwoTone from '@mui/icons-material/UploadTwoTone';
import { ChangeEvent, InputHTMLAttributes, useState } from 'react';
import { SUPPORTED_IMAGE_MIME_TYPES } from '../../../common/config/support';
import Image from 'next/image';

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
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleFileInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    changeHandler: (...args: unknown[]) => void
  ): void => {
    if (event.target.files?.length) {
      const file = event.target.files.item(0);
      if (file) {
        setPreviewURL(URL.createObjectURL(file));
      }
      changeHandler(file);
    }
  };

  return (
    <>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <br />
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        render={({ field }) => (
          <>
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
              <Box
                ref={field.ref}
                onBlur={field.onBlur}
                name={field.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleFileInputChange(event, field.onChange)}
                id={id}
                required={required}
                component="input"
                type="file"
                accept={SUPPORTED_IMAGE_MIME_TYPES.join(',')}
                sx={{ display: 'none' }}
                {...InputProps}
              />
            </Button>
            {(previewURL || typeof field.value === 'string') && (
              <Box>
                <Box sx={{ mt: 1, bgcolor: 'grey.50', display: 'inline-block', borderRadius: 1 }}>
                  <Image
                    width={200}
                    height={200}
                    objectFit="contain"
                    objectPosition="center"
                    src={previewURL || field.value}
                    alt="Your profile picture preview"
                  />
                </Box>
              </Box>
            )}
          </>
        )}
      />

      {(hasError || helperText) && <FormHelperText error={hasError}>{error || helperText}</FormHelperText>}
    </>
  );
};
