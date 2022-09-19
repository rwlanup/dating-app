import { InputLabel, TextField, TextFieldProps } from '@mui/material';
import { Controller, FieldValues, Path, UseControllerProps } from 'react-hook-form';
import type { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface AppDatePickerProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>
  extends UseControllerProps<TFieldValues, TName> {
  error?: string | undefined;
  helperText?: string | undefined;
  label?: string;
  id?: string;
  required?: boolean;
  TextFieldProps?: TextFieldProps;
  DatePickerProps?: Partial<DatePickerProps<Dayjs, Dayjs>>;
}

export const AppDatePicker = <
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
  rules,
  shouldUnregister,
  id,
  required,
  DatePickerProps,
}: AppDatePickerProps<TFieldValues, TName>) => {
  const handleDateInputChange = (value: Dayjs | null, changeHandler: (...args: unknown[]) => void): void => {
    if (value) {
      changeHandler(value.toDate());
    } else {
      changeHandler(null);
    }
  };

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              {...field}
              value={field.value || null}
              onChange={(value) => handleDateInputChange(value as unknown as Dayjs, field.onChange)}
              renderInput={(params: TextFieldProps) => (
                <TextField
                  {...params}
                  id={id}
                  required={required}
                  name={field.name}
                  error={Boolean(error)}
                  helperText={error || helperText}
                  {...TextFieldProps}
                />
              )}
              {...DatePickerProps}
            />
          </LocalizationProvider>
        )}
      />
    </>
  );
};
