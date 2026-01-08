import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, DatePicker, IDropdownOption, Dropdown } from '@fluentui/react';
import styles from './TerceraFila.module.scss';
import { DayPickerSpanish, formatDate } from '../../../../common/helpers';
import { useCustomFormContext } from '../../../../common/context/CustomFormProvider';

interface TerceraFilaProps {
  alertData: any;
}

const TerceraFila: React.FC<TerceraFilaProps> = ({ alertData }) => {
  const booleanOptions: IDropdownOption[] = [
    { key: 'Si', text: 'Sí' },
    { key: 'No', text: 'No' },
  ];

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { isDisabled } = useCustomFormContext();
  const today = new Date();
  React.useEffect(() => {
    if (alertData) {
      setValue('ReportadoPor', alertData?.ReportadoPor || '');
      setValue(
        'FechaHoraIncidente',
        alertData?.FechaHoraIncidente
          ? new Date(alertData.FechaHoraIncidente)
          : '',
      );
      setValue('HoraIncidente', alertData?.HoraIncidente || '');
      setValue('LlamadaCOS', alertData.LlamadaCOS ? true : false);
    }
  }, [alertData, setValue]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!/[0-9]/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    let formattedValue = value;
    if (value.length >= 3) {
      formattedValue = value.slice(0, 2) + ':' + value.slice(2, 4);
    } else if (value.length >= 1) {
      formattedValue = value.slice(0, 2);
    }
    onChange(formattedValue);
  };

  return (
    <>
      <div>
        <Controller
          name="ReportadoPor"
          control={control}
          defaultValue={alertData?.ReportadoPor || ''}
          rules={{
            required: 'El campo es obligatorio',
          }}
          render={({ field }) => (
            <div className={styles.orderField}>
              <label className={styles.requiredLabel}>Alerta reportada por</label>
              <TextField
                placeholder="Escribí nombre, apellido o DNI"
                className={styles.textField}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                disabled={alertData?.EsMOB || isDisabled}
              />
            </div>
          )}
        />
        {errors.ReportadoPor && (
          <span className={styles.errorText}>{errors.ReportadoPor.message}</span>
        )}
      </div>

      <div className={styles.dateTimeContainer}>
        <div style={{ width: '100%' }}>
          <Controller
            name="FechaHoraIncidente"
            control={control}
            defaultValue={
              alertData?.FechaHoraIncidente
                ? new Date(alertData.FechaHoraIncidente)
                : undefined
            }
            rules={{
              required: 'El campo es obligatorio',
            }}
            render={({ field }) => (
              <div className={styles.orderField}>
                <label className={styles.requiredLabel}>Fecha</label>
                <DatePicker
                  placeholder="Seleccioná una fecha"
                  ariaLabel="Seleccioná una fecha"
                  strings={DayPickerSpanish}
                  formatDate={formatDate}
                  className={`${styles.datePicker}`}
                  value={field.value || undefined}
                  onSelectDate={field.onChange}
                  disabled={isDisabled}
                  maxDate={today}
                />
              </div>
            )}
          />
          {errors.FechaHoraIncidente && (
            <span className={styles.errorTextFecha}>
              {errors.FechaHoraIncidente.message}
            </span>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <Controller
            name="HoraIncidente"
            control={control}
            defaultValue=""
            rules={{
              required: 'El campo es obligatorio',
              pattern: {
                value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                message: 'El formato debe ser HH:mm',
              },
            }}
            render={({ field }) => (
              <div className={styles.orderField}>
                <label className={styles.requiredLabel}>Hora</label>
                <TextField
                  placeholder="HH:mm"
                  {...field}
                  value={field.value || ''}
                  onKeyDown={handleKeyDown}
                  onChange={(event) =>
                    handleChange(
                      event as React.ChangeEvent<HTMLInputElement>,
                      field.onChange,
                    )
                  }
                  disabled={isDisabled}
                />
              </div>
            )}
          />
          {errors.HoraIncidente && (
            <span className={styles.errorText}>{errors.HoraIncidente.message}</span>
          )}
        </div>
      </div>
      {alertData && alertData.EsMOB && (
        <div style={{ width: '100%' }}>
          <Controller
            name="LlamadaCOS"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <div className={styles.orderField}>
                  <label className={styles.requiredLabel}>Realizó llamada al COS</label>
                  <Dropdown
                    placeholder="Seleccioná una opción"
                    options={booleanOptions}
                    disabled={isDisabled}
                    selectedKey={field.value ? 'Si' : 'No'}
                    onChange={(event, option) => {
                      field.onChange(option.key == 'Si' ? true : false);
                    }}
                  />
                </div>
              );
            }}
          />
          {errors.LlamadaCOS && (
            <span className={styles.errorText}>{errors.LlamadaCOS.message}</span>
          )}
        </div>
      )}
    </>
  );
};

export { TerceraFila };
