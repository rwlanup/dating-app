import { Gender } from '@prisma/client';

export const GENDER_OPTIONS: {
  label: string;
  value: Gender;
}[] = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other (looking for Male)', value: 'MALE_OTHER' },
  { label: 'Other (looking for Female)', value: 'FEMALE_OTHER' },
];
