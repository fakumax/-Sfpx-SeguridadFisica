import * as React from 'react';
import styles from './Complementarios.module.scss';
import {
    Dropdown,
    IDropdownOption,
    IDropdownStyles,
    Label,
    TextField,
} from '@fluentui/react';
import { fetchHuellasChoices } from '../../../../../core/api/services/datosBaseService';
import { ItemComplementarios } from '../../../../../core/entities/Complementarios';
import SPODataProvider from '../../../../../core/pnp/sp/SharePointDataProvider';
import {
    AlertTypes,
    Complementary,
    LIST_NAMES,
} from '../../../../../core/utils/Constants';
import { useParams } from 'react-router-dom';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';
import { Controller } from 'react-hook-form';

const Complementarios = ({ context, alertData }) => {
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        isDisabled,
        formState: { errors },
    } = useCustomFormContext();
    const { id } = useParams<{ id: string }>();
    const [Huellas, setHuellas] = React.useState<IDropdownOption[]>([]);
    const [isAlertaIncidente, setIsAlertaIncidente] = React.useState(false);
    const [complementarios, setComplementarios] = React.useState<ItemComplementarios>({
        HuellasEncontradas: undefined,
        OtrasHuellas: undefined,
        MedidasAdoptadas: undefined,
        ObservacionesAdicionales: undefined,
        ElementosEncontrados: undefined,
        IDAlerta: undefined,
        Id: undefined,
    });
    const [isDisabledOtros, setisDisabledOtros] = React.useState<boolean>(true);
    const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 577 } };

    React.useEffect(() => {
        const loadTipoAlertaChoices = async () => {
            const choices = await fetchHuellasChoices();
            setHuellas(choices);
            let filtro = `IDAlerta eq '${id}'`;
            const data: ItemComplementarios[] = await SPODataProvider.getListItems(
                LIST_NAMES.DATOSCOMPLEMENTARIOS,
                '',
                filtro,
                '',
            );
            if (data && data.length > 0) {
                const fetchedData = { ...data[0] };
                setComplementarios(fetchedData);
                setValue('complementarios.Id', fetchedData.Id);
                setValue('complementarios.IDAlerta', fetchedData.IDAlerta);
                setValue(
                    'complementarios.HuellasEncontradas',
                    fetchedData.HuellasEncontradas || [],
                );
                setValue('complementarios.OtrasHuellas', fetchedData.OtrasHuellas || '');
                setValue('complementarios.MedidasAdoptadas', fetchedData.MedidasAdoptadas || '');
                setValue(
                    'complementarios.ObservacionesAdicionales',
                    fetchedData.ObservacionesAdicionales || '',
                );
                setValue(
                    'complementarios.ElementosEncontrados',
                    fetchedData.ElementosEncontrados || '',
                );

                if (fetchedData.HuellasEncontradas?.includes(Complementary.Otras)) {
                    setisDisabledOtros(false);
                } else {
                    setisDisabledOtros(true);
                }
            }
        };
        loadTipoAlertaChoices();
    }, [id, setValue]);

    const tipoAlertaValue = watch('TipoAlerta');
    React.useEffect(() => {
        if (tipoAlertaValue === AlertTypes.AlertaIncidente) {
            setIsAlertaIncidente(true);
        } else {
            setIsAlertaIncidente(false);
        }
    }, [tipoAlertaValue]);

    const idComple = watch('complementarios.Id');
    React.useEffect(() => {
        if (idComple) {
            setComplementarios((prev) => ({
                ...prev,
                Id: idComple,
                IDAlerta: id,
            }));
        }
    }, [idComple, id]);

    const onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption,
    ): void => {
        if (item) {
            let valor: string[] = [];
            valor.push(item.text);
            if (complementarios.HuellasEncontradas != null) {
                complementarios.HuellasEncontradas.forEach((res) => {
                    valor.push(res);
                });
            }
            let OtrasHuellas = complementarios.OtrasHuellas;
            if (item.text === Complementary.Otras) {
                if (item.selected) {
                    setisDisabledOtros(false);
                } else {
                    setisDisabledOtros(true);
                    OtrasHuellas = '';
                }
            }
            setComplementarios({
                ...complementarios,
                HuellasEncontradas: item.selected
                    ? valor
                    : complementarios.HuellasEncontradas.filter((key) => key !== item.key),
                OtrasHuellas: OtrasHuellas,
            });
            let comple = complementarios;
            comple.HuellasEncontradas = item.selected
                ? valor
                : complementarios.HuellasEncontradas.filter((key) => key !== item.key);
            comple.OtrasHuellas = OtrasHuellas;
            setValue('complementarios', comple);
        }
    };

    return (
        <>
            <div className={styles.gridContainer2}>
                <div style={{ width: '100%' }}>
                    <div className={styles.orderField}>
                        <Controller
                            name="complementarios.HuellasEncontradas"
                            control={control}
                            defaultValue={complementarios.HuellasEncontradas || []}
                            rules={{
                                required: isAlertaIncidente ? 'El campo es obligatorio' : undefined,
                            }}
                            render={({ field }) => (
                                <>
                                    <label
                                        className={`${styles.requiredLabel} ${isAlertaIncidente ? styles.showRequired : ''
                                            }`}
                                    >
                                        Huellas o rastros
                                    </label>
                                    <Dropdown
                                        placeholder="Seleccioná una huella o rastro"
                                        multiSelect
                                        options={Huellas}
                                        selectedKeys={field.value}
                                        onChange={(event, option) => {
                                            onChange(event, option);
                                            field.onChange(complementarios.HuellasEncontradas);
                                        }}
                                        className={styles.dropdown}
                                        disabled={isDisabled}
                                        styles={dropdownStyles}
                                    />
                                </>
                            )}
                        />
                        {errors.HuellasEncontradas && (
                            <span className={styles.errorText}>
                                {errors.HuellasEncontradas.message}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ width: '100%' }}>
                    <div className={styles.orderField}>
                        <Controller
                            name="complementarios.OtrasHuellas"
                            control={control}
                            defaultValue={complementarios.OtrasHuellas || ''}
                            rules={{
                                required:
                                    isAlertaIncidente &&
                                        complementarios.HuellasEncontradas?.includes('Otras')
                                        ? 'El campo es obligatorio'
                                        : undefined,
                            }}
                            render={({ field }) => (
                                <>
                                    <label
                                        className={`${styles.requiredLabel} ${isAlertaIncidente &&
                                            complementarios.HuellasEncontradas?.includes('Otras')
                                            ? styles.showRequired
                                            : ''
                                            }`}
                                    >
                                        Otro tipo de huella o rastro
                                    </label>
                                    <TextField
                                        {...field}
                                        placeholder="Detallá qué otro tipo de huella o rastro se encontró"
                                        className={styles.textField}
                                        disabled={isDisabledOtros || isDisabled}
                                        onChange={(
                                            _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                                            newValue?: string,
                                        ) => {
                                            field.onChange(newValue);
                                            let comple = { ...complementarios, OtrasHuellas: newValue };
                                            setComplementarios(comple);
                                            setValue('complementarios', comple);
                                        }}
                                    />
                                </>
                            )}
                        />
                        {errors.OtrasHuellas && (
                            <span className={styles.errorText}>{errors.OtrasHuellas.message}</span>
                        )}
                    </div>
                </div>

                <div style={{ width: '100%' }}>
                    <div className={styles.orderField}>
                        <Controller
                            name="complementarios.MedidasAdoptadas"
                            control={control}
                            defaultValue={complementarios.MedidasAdoptadas || ''}
                            rules={{
                                required: isAlertaIncidente ? 'El campo es obligatorio' : undefined,
                            }}
                            render={({ field }) => (
                                <>
                                    <label
                                        className={`${styles.requiredLabel} ${isAlertaIncidente ? styles.showRequired : ''
                                            }`}
                                    >
                                        Medidas adoptadas
                                    </label>
                                    <TextField
                                        {...field}
                                        placeholder="Detallá las medidas adoptadas"
                                        multiline
                                        rows={3}
                                        disabled={isDisabled}
                                        className={styles.textField}
                                        onChange={(
                                            _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                                            newValue?: string,
                                        ) => {
                                            field.onChange(newValue);
                                            let comple = { ...complementarios, MedidasAdoptadas: newValue };
                                            setComplementarios(comple);
                                            setValue('complementarios', comple);
                                        }}
                                    />
                                </>
                            )}
                        />
                        {errors.MedidasAdoptadas && (
                            <span className={styles.errorTextMed}>
                                {errors.MedidasAdoptadas.message}
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ width: '100%' }}>
                    <div className={styles.orderField}>
                        <Label>Elementos encontrados</Label>
                        <TextField
                            multiline
                            placeholder="Detallá los elementos encontrados"
                            rows={3}
                            disabled={isDisabled}
                            className={styles.textField}
                            value={complementarios.ElementosEncontrados}
                            onChange={(
                                _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                                newValue?: string,
                            ) => {
                                let comple = complementarios;
                                comple.ElementosEncontrados = newValue;
                                setComplementarios({
                                    ...complementarios,
                                    ElementosEncontrados: newValue,
                                });
                                setValue('complementarios', comple);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.gridContainer1}>
                <div style={{ width: '100%' }}>
                    <div className={styles.orderField}>
                        <Label>Observaciones adicionales</Label>
                        <TextField
                            multiline
                            placeholder="Escribí cualquier observación que creas relevante"
                            rows={3}
                            disabled={isDisabled}
                            className={styles.textField}
                            value={complementarios.ObservacionesAdicionales}
                            onChange={(
                                _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                                newValue?: string,
                            ) => {
                                let comple = complementarios;
                                comple.ObservacionesAdicionales = newValue;
                                setComplementarios({
                                    ...complementarios,
                                    ObservacionesAdicionales: newValue,
                                });
                                setValue('complementarios', comple);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
export { Complementarios };
