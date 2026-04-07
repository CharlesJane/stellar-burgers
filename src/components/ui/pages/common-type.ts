import { Dispatch, SetStateAction, SyntheticEvent } from 'react';

export interface FormValues {
  [key: string]: string;
}

export type PageUIProps = {
  errorText: string | undefined;
  values: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
  isLoading: boolean;
};
