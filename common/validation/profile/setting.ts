import { Gender } from '@prisma/client';
import dayjs from 'dayjs';
import * as z from 'zod';
import { decryptBase64URL } from '../../../util/string';
import { SUPPORTED_IMAGE_MIME_TYPES } from '../../config/support';

const profilePictureServerSchema = z
  .string({
    required_error: 'Please upload a profile picture',
    invalid_type_error: 'Please upload a valid profile picture',
  })
  .refine((value) => {
    const decryptedValue = decryptBase64URL(value);
    if (!decryptedValue) {
      return false;
    } else {
      return SUPPORTED_IMAGE_MIME_TYPES.includes(decryptedValue.mimeType);
    }
  }, 'Please upload an image with .jpg, .jpeg or .png format under 2MB');

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
    .refine((value) => value in Gender, 'Please select a valid gender'),
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
  profilePicture:
    typeof window === 'undefined'
      ? profilePictureServerSchema
      : z
          .instanceof(File, 'Please upload a profile picture')
          .refine(
            (value: File) => SUPPORTED_IMAGE_MIME_TYPES.includes(value.type),
            'Please upload an image with .jpg, .jpeg or .png format'
          )
          .refine(
            (value: File) => value.size <= 2097152, // 2097152 = 1024 * 1024 * 2 = 2MB
            'Please upload an image'
          )
          .or(profilePictureServerSchema),
  bio: z
    .string({
      invalid_type_error: 'Please enter a valid bio',
      required_error: 'Please enter your bio',
    })
    .min(20, 'Bio cannot be less than 20 characters'),
});

export type ProfileSettingInputs = z.infer<typeof profileSettingSchema>;
