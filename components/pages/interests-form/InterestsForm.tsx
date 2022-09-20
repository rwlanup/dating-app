import {
  Autocomplete,
  Box,
  createFilterOptions,
  FilterOptionsState,
  TextField,
  Typography,
  debounce,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InterestInputs, updateInterestsSchema } from '../../../common/validation/interests/update';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../../util/trpc';
import { TTL } from '../../../common/config/support';

const filter = createFilterOptions<string>();

interface InterestsFormProps {
  onSubmit: (data: InterestInputs) => void;
  isLoading?: boolean;
  defaultValues?: Partial<InterestInputs>;
}

export const InterestsForm: FC<InterestsFormProps> = ({ onSubmit, isLoading, defaultValues }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedSetInputValue = debounce((value: string) => setInputValue(value), 300);

  const { isLoading: isOptionsLoading, data: options } = trpc.useQuery(['interests.popular', inputValue], {
    staleTime: TTL,
    select(interests) {
      return interests.map((interest) => interest.name);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const filterOptions = (options: string[], state: FilterOptionsState<string>): string[] => {
    if (isOptionsLoading) return [];
    const filtered = filter(options, state);
    const { inputValue } = state;

    const trimmedInputValue = inputValue.trim();
    if (trimmedInputValue.length >= 2) {
      const isExisting = options.some((option) => option.toLowerCase() === trimmedInputValue.toLowerCase());
      if (!isExisting) {
        filtered.push(trimmedInputValue);
      }
    }
    return filtered;
  };

  const updateInputValue = (value: string): void => {
    debouncedSetInputValue(value);
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<InterestInputs>({
    resolver: zodResolver(updateInterestsSchema),
    defaultValues,
  });

  const _onSubmit = handleSubmit(onSubmit);

  return (
    <Box>
      <Typography
        variant="h3"
        component="h1"
        sx={{ mb: 4 }}
      >
        Add / remove your interests
      </Typography>
      <Box
        component="form"
        onSubmit={_onSubmit}
      >
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <Autocomplete
              {...field}
              clearOnBlur
              includeInputInList
              onInputChange={(_event, value) => updateInputValue(value)}
              disabled={isLoading}
              onChange={(_event, value) => field.onChange(value)}
              multiple
              options={options || []}
              loading={isOptionsLoading}
              id="interests-form-field"
              handleHomeEndKeys
              freeSolo
              filterOptions={filterOptions}
              autoHighlight
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(errors.interests?.message)}
                  helperText={errors.interests?.message}
                  placeholder="Your interests"
                />
              )}
            />
          )}
        />
        <LoadingButton
          sx={{ mt: 2.5 }}
          type="submit"
          loading={isLoading}
        >
          Update interests
        </LoadingButton>
      </Box>
    </Box>
  );
};
