import dayjs from 'dayjs';
import * as z from 'zod';
import { GENDER_OPTIONS } from '../../config/selectOption';

export const profileSettingSchema = z.object({
  fullName: z
    .string({
      required_error: 'Please enter your full name',
      invalid_type_error: 'Please enter a valid full name',
    })
    .trim()
    .min(3, 'Full name cannot be less than 3 characters')
    .max(150, 'Full name cannot be longer than 150 characters'),
  profession: z
    .string({
      required_error: 'Please enter your profession',
      invalid_type_error: 'Please enter a valid profession',
    })
    .trim()
    .min(2, 'Profession cannot be less than 2 characters')
    .max(50, 'Profession cannot be longer than 50 characters'),
  gender: z
    .string({
      required_error: 'Please select your gender',
      invalid_type_error: 'Please select a valid gender',
    })
    .refine(
      (value) => GENDER_OPTIONS.findIndex((option) => option.value === value) !== -1,
      'Please select a valid gender'
    ),
  dob: z
    .date({
      invalid_type_error: 'Please provide a valid date',
      required_error: 'Please enter your date of birth',
    })
    .min(dayjs().add(-90, 'years').toDate(), 'Please provide a valid date of birth')
    .max(dayjs().add(-13, 'years').toDate(), 'Please provide a valid date of birth'),
  country: z
    .string({
      required_error: 'Please enter the country you live in',
      invalid_type_error: 'Please enter a valid country',
    })
    .trim()
    .min(2, 'Country name cannot be less than 2 characters')
    .max(60, 'Country name cannot be longer than 60 characters'),
  city: z
    .string({
      required_error: 'Please enter the city you live in',
      invalid_type_error: 'Please enter a valid city',
    })
    .trim()
    .min(1, 'Please enter the city you live in')
    .max(255, 'City name cannot be longer than 255 characters'),
  profilePicture: (typeof window === 'undefined' ? z.any() : z.instanceof(File, 'Please upload a profile picture'))
    .refine((value: File) => value.type.startsWith('image/'), 'Please upload an image')
    .refine(
      (value: File) => value.size <= 2097152, // 2097152 = 1024 * 1024 * 2 = 2MB
      'Please upload an image'
    ),
});

export type ProfileSettingInputs = z.infer<typeof profileSettingSchema>;
