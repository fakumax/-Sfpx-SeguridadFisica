import React, { createContext, useContext, useState } from 'react';
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form';
import { initAlertas } from '../helpers';
import { IAlerta } from '../../../../core/interfaces/IAlerta';

interface CustomFormContextProps extends Partial<UseFormReturn<any, any>> {
  isDisabled: boolean;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomFormContext = createContext<CustomFormContextProps | undefined>(undefined);
export const useCustomFormContext = () => {
  const context = useContext(CustomFormContext);
  if (!context) {
    throw new Error(
      'useCustomFormContext debe ser utilizado dentro de un CustomFormProvider'
    );
  }
  return context;
};

export const CustomFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const methods = useForm<IAlerta>({
    defaultValues: initAlertas(),
  });
  return (
    <CustomFormContext.Provider value={{ ...methods, isDisabled, setIsDisabled }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </CustomFormContext.Provider>
  );
};
