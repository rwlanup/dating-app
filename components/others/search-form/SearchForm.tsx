import { Box, BoxProps, IconButton, InputAdornment, TextFieldProps } from '@mui/material';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { AppTextField } from '../../ui/app-text-field/AppTextField';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

interface SearchFormProps extends Omit<BoxProps<'form'>, 'onSubmit'> {
  onSubmit: (value: string) => void;
  isLoading?: boolean;
  TextFieldProps?: TextFieldProps;
  submitOnChange?: boolean;
}

interface SearchFormInputs {
  search: string;
}

export const SearchForm: FC<SearchFormProps> = ({
  onSubmit,
  isLoading,
  TextFieldProps = {},
  submitOnChange,
  ...otherProps
}) => {
  const { handleSubmit, control } = useForm<SearchFormInputs>({
    defaultValues: {
      search: '',
    },
  });

  const _onSubmit = handleSubmit((data) => onSubmit(data.search));

  return (
    <Box
      sx={{ pb: 3 }}
      {...otherProps}
      component="form"
      onSubmit={_onSubmit}
      onChange={submitOnChange ? _onSubmit : undefined}
    >
      <AppTextField
        control={control}
        name="search"
        placeholder="Search partners"
        TextFieldProps={{
          type: 'search',
          disabled: isLoading,
          InputProps: {
            sx: { '.MuiInputBase-input': { py: 1.5, height: 'auto' } },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  aria-label="Search partners"
                  edge="end"
                  disabled={isLoading}
                >
                  <SearchTwoToneIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
          ...TextFieldProps,
        }}
      />
    </Box>
  );
};
