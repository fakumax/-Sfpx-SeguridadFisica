import { Stack, Dropdown, IDropdownOption } from '@fluentui/react';
import * as React from 'react';
import styles from './SectionDropdown.module.scss';
import { useCustomFormContext } from '../../../../webparts/seguridadFisica/common/context/CustomFormProvider';
import { Controller } from 'react-hook-form';

interface SectionDropdownProps {
  name: string;
  options: IDropdownOption[];
  label: string;
  initialValue?: string;
  required?: boolean;
  disabled?: boolean;
  [key: string]: any;
  onChange?: (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption) => void;
}

const getNestedError = (errors: any, name: string) => {
  return name.split('.').reduce((acc, part) => acc && acc[part], errors);
};

const SectionDropdown: React.FC<SectionDropdownProps> = ({
  name,
  options,
  label,
  initialValue,
  required = false,
  disabled = false,
  onChange,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useCustomFormContext();

  const fieldError = getNestedError(errors, name);

  return (
    <>
      <Stack horizontal horizontalAlign="center" className={styles.Container}>
        <div className={styles.DropdownContainer}>
          <label className={styles.Label}>
            {label}
            {required && <span className={styles.Asterisco}>*</span>}
          </label>
          <Controller
            name={name}
            control={control}
            defaultValue={initialValue || ''}
            rules={{ required: required ? 'Este campo es obligatorio' : false }}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={options}
                onChange={(event, option) => {
                  field.onChange(option?.key);
                  if (onChange) {
                    onChange(event, option);
                  }
                }}
                selectedKey={field.value || initialValue}
                disabled={disabled}
                {...props}
                className={styles.Dropdown}
              />
            )}
          />
          {fieldError && <span className={styles.errorText}>{fieldError.message}</span>}
        </div>
      </Stack>
    </>
  );
};

export { SectionDropdown };
