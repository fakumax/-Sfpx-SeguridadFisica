import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  TextField,
  IconButton,
  DefaultButton,
  Stack,
  Text,
  Persona,
  PersonaSize,
  Icon,
} from '@fluentui/react';
import { FormPanel } from '../../../../../core';
import styles from './DescripcionAlerta.module.scss';
import EmptyDataSVG from '../../../assets/img-sin-datos.svg';
import {
  deleteComentario,
  fetchComentarios,
} from '../../../../../core/api/services/descripcionAlertaService';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';
import SPODataProvider from '../../../../../core/pnp/sp/SharePointDataProvider';
import { LIST_NAMES } from '../../../../../core/utils/Constants';
import moment from 'moment';

const DescripcionAlerta = ({
  context,
  alertData,
  mobileStatus,
  setMobileStatus,
  GisStatus,
  setGisStatus,
  setIsSaved,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    register,
    watch,
    isDisabled,
    formState: { errors },
  } = useCustomFormContext();
  const mensajesDescripcion = watch('MensajesDescripcion') || [];
  const [localForm, setLocalForm] = React.useState({ Comentario: '' });

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number | null>(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [charCount, setCharCount] = useState(0);

  React.useEffect(() => {
    const subscription = watch((value) => {
      const comentario = value.Comentario || '';
      setIsSaveDisabled(comentario.trim() === '');
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  React.useEffect(() => {
    const loadComentarios = async () => {
      if (alertData && alertData.Id) {
        if (alertData.Observaciones && alertData.EsMOB)
          setMobileStatus({
            Comment: alertData.Observaciones,
            modifiedDate: alertData.ObservacionModificada
              ? alertData.ObservacionModificada
              : null,
            modifiedBy: alertData.ObservacionModificadaPorId
              ? alertData.ObservacionModificadaPorId
              : null,
          });
        if (alertData.ObservacionGIS) {
          const localDate = moment(alertData.FechaObservacionGIS).local().format('YYYY-MM-DD');
          const fechaYHoraInicial: string = moment(`${localDate}T${alertData.HoraObservacionGIS}:00`).local().toISOString().replace('.000Z', '.00Z');
          setGisStatus({
            Comment: alertData.ObservacionGIS,
            modifiedDate: fechaYHoraInicial,
            modifiedBy: alertData.ObservacionModificadaPorId
              ? alertData.ObservacionModificadaPorId
              : null
          });
        }
        const comentarios = await fetchComentarios(alertData.Id);
        setValue('MensajesDescripcion', comentarios.length > 0 ? comentarios : []);
      }
    };

    loadComentarios();
  }, [alertData, setValue]);

  React.useEffect(() => {
    if (isPanelOpen) {
      const comentario = watch('Comentario') || '';
      setCharCount(comentario.length);
    } else {
      setCharCount(0);
    }
  }, [isPanelOpen, watch('Comentario')]);

  const openPanelToAdd = () => {
    setIsPanelOpen(true);
    setCurrentMessageIndex(null);
    setLocalForm({ Comentario: '' });
    setCharCount(0);
  };

  const deleteMobileComment = async () => {
    try {
      setMobileStatus({
        Comment: '',
        modifiedDate: null,
        modifiedBy: null,
      });
      if (mensajesDescripcion.length == 0) {
        setIsSaved(false);
      }
      await SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, {
        Observaciones: null,
        ObservacionModificada: null,
        ObservacionModificadaPorId: null,
      });
    } catch (error) {
      console.error('Error al eliminar la observación:', error);
    }
  };

  const openPanelToEdit = (index: number, isMobOrGisComment: boolean = false) => {
    let comentario: string;
    setIsPanelOpen(true);
    setCurrentMessageIndex(index);
    if (!isMobOrGisComment) {
      const selectedMessage = mensajesDescripcion[index];
      comentario = selectedMessage?.Comentario || '';
    } else {
      comentario = mobileStatus.Comment || GisStatus.Comment || '';
    }
    setLocalForm({ Comentario: comentario });
    setCharCount(comentario.length);
  };

  const handleSave = async (data) => {
    if (!data.Comentario?.trim()) {
      return;
    }
    if (
      (currentMessageIndex == mensajesDescripcion.length ||
        (currentMessageIndex == 1 && mensajesDescripcion.length == 0)) &&
      (mobileStatus.Comment || GisStatus.Comment)
    ) {
      const currentDate = new Date().toISOString();

      if (mobileStatus.Comment) {
        setMobileStatus({
          Comment: data.Comentario,
          modifiedDate: currentDate,
          modifiedBy: context.pageContext.user.id,
        });
      } else {
        setGisStatus({
          Comment: data.Comentario,
          modifiedDate: currentDate,
          modifiedBy: context.pageContext.user.id,
        });
      }
      setIsPanelOpen(false);
    } else {
      const isNewComment = currentMessageIndex === null;

      if (!isNewComment) {
        const originalComment = mensajesDescripcion[currentMessageIndex].Comentario;
        if (originalComment === data.Comentario.trim()) {
          setIsPanelOpen(false);
          return;
        }
      }

      const newComment = {
        IDAlerta: data.IDAlerta || String(alertData.Id),
        Created: isNewComment
          ? new Date().toISOString()
          : mensajesDescripcion[currentMessageIndex].Created,
        Modified: new Date().toISOString(),
        Comentario: data.Comentario?.trim(),
        Author: isNewComment
          ? {
            Id: context.pageContext.user.id,
            Title: context.pageContext.user.displayName,
            Picture: context.pageContext.user.imageUrl,
          }
          : mensajesDescripcion[currentMessageIndex].Author,
        Editor: {
          Id: context.pageContext.user.id,
          Title: context.pageContext.user.displayName,
          Picture: context.pageContext.user.imageUrl,
        },
        Id: isNewComment ? undefined : mensajesDescripcion[currentMessageIndex].Id,
        isModified: !isNewComment,
        isNew: isNewComment,
      };

      if (isNewComment) {
        setValue('MensajesDescripcion', [...mensajesDescripcion, newComment], {
          shouldValidate: false,
        });
      } else {
        const updatedMessages = [...mensajesDescripcion];
        updatedMessages[currentMessageIndex] = newComment;
        setValue('MensajesDescripcion', updatedMessages, { shouldValidate: false });
      }
      setIsPanelOpen(false);
    }
  };

  const handleDelete = async (index: number) => {
    const updatedMessages = mensajesDescripcion.filter((_, i) => i !== index);
    if (updatedMessages.length == 0 && !mobileStatus.Comment) setIsSaved(false);
    setValue('MensajesDescripcion', updatedMessages);
    const comentarioId = mensajesDescripcion[index].Id;
    if (comentarioId) {
      await deleteComentario(parseInt(comentarioId, 10));
    }
  };

  return (
    <>
      <Stack horizontal horizontalAlign="end">
        {!isDisabled && (
          <DefaultButton
            text="Agregar"
            onClick={openPanelToAdd}
            className={styles.buttonStyle}
            iconProps={{ iconName: 'Add' }}
          />
        )}
      </Stack>
      {mensajesDescripcion.length > 0 || mobileStatus.Comment || GisStatus.Comment ? (
        <Stack tokens={{ childrenGap: 20 }} styles={{ root: { margin: '2rem 0' } }}>
          {/* Mobile ESMOB */}
          {mobileStatus.Comment && (
            <Stack
              key={mensajesDescripcion.length == 0 ? 1 : mensajesDescripcion.length}
              tokens={{ childrenGap: 10 }}
              className="descripcionAlerta"
            >
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <Stack horizontal verticalAlign="center">
                  <div
                    style={{
                      borderRadius: '50%',
                      backgroundColor: '#0078d4',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      iconName="CellPhone"
                      styles={{ root: { color: '#FFFFFF', fontWeight: 'bold' } }}
                    />
                  </div>
                  <Text
                    variant="medium"
                    styles={{
                      root: {
                        fontSize: '12px',
                        backgroundColor: 'lightblue',
                        marginLeft: '10px',
                        padding: '2px 6px',
                      },
                    }}
                  >
                    {moment(mobileStatus.modifiedDate || alertData.Created).format('DD/MM/YYYY HH:mm') || ''}
                  </Text>
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 15 }}>
                  <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    onClick={() =>
                      openPanelToEdit(
                        mensajesDescripcion.length == 0 ? 1 : mensajesDescripcion.length,
                        true,
                      )
                    }
                    disabled={isDisabled}
                  />
                </Stack>
              </Stack>
              <div>
                <Text variant="medium" className={styles.descriptionText}>
                  {mobileStatus.Comment}
                </Text>
              </div>
            </Stack>
          )}
          {/* Gis Message */}
          {GisStatus.Comment && (
            <Stack
              key={mensajesDescripcion.length == 0 ? 1 : mensajesDescripcion.length}
              tokens={{ childrenGap: 10 }}
              className="descripcionAlerta"
            >
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <Stack horizontal verticalAlign="center">
                  <div
                    style={{
                      borderRadius: '50%',
                      backgroundColor: '#0078d4',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      iconName="flag"
                      styles={{ root: { color: '#FFFFFF', fontWeight: 'bold' } }}
                    />
                  </div>
                  <Text
                    variant="medium"
                    styles={{
                      root: {
                        fontSize: '12px',
                        backgroundColor: 'lightblue',
                        marginLeft: '10px',
                        padding: '2px 6px',
                      },
                    }}
                  >
                    {
                      null === GisStatus.modifiedDate
                        ? alertData.Created &&
                        `${new Date(alertData.Created).toLocaleDateString()} ${new Date(
                          alertData.Created,
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}`
                        : new Date(GisStatus.modifiedDate)
                          .toLocaleString('es-AR', {
                            timeZone: 'America/Argentina/Buenos_Aires',
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          .replace(',', '')
                    }
                  </Text>
                  <Text
                    variant="medium"
                    styles={{
                      root: {
                        fontSize: '12px',
                        backgroundColor: 'lightblue',
                        marginLeft: '10px',
                        padding: '2px 6px',
                      },
                    }}
                  >
                    {alertData.ObjetivoFijo}
                  </Text>
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 15 }}>
                  <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    onClick={() => openPanelToEdit(
                      mensajesDescripcion.length == 0 ? 1 : mensajesDescripcion.length,
                      true
                    )}
                    disabled={isDisabled}
                  />
                </Stack>

              </Stack>
              <div>
                <Text variant="medium" className={styles.descriptionText}>
                  {GisStatus.Comment}
                </Text>
              </div>
            </Stack>
          )}
          {/* Sharepoint Message */}
          {mensajesDescripcion.length > 0 &&
            mensajesDescripcion.map((field, index) => (
              <Stack
                key={index}
                tokens={{ childrenGap: 10 }}
                className="descripcionAlerta"
              >
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                  <Stack horizontal verticalAlign="center">
                    <Persona
                      imageUrl={undefined}
                      text={field.Author.Title || 'Autor desconocido'}
                      size={PersonaSize.size32}
                      styles={{ root: { marginRight: '10px' } }}
                    />
                    <Text
                      variant="medium"
                      styles={{
                        root: {
                          fontSize: '12px',
                          backgroundColor: 'lightblue',
                          marginLeft: '10px',
                          padding: '2px 6px',
                        },
                      }}
                    >
                      {`${new Date(field.Modified || '').toLocaleDateString()} ${new Date(
                        field.Modified || '',
                      ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}`}
                    </Text>
                  </Stack>

                  <Stack horizontal tokens={{ childrenGap: 15 }}>
                    <IconButton
                      iconProps={{ iconName: 'Edit' }}
                      onClick={() => openPanelToEdit(index)}
                      disabled={isDisabled}
                    />
                    <IconButton
                      iconProps={{ iconName: 'Delete' }}
                      styles={{ root: { color: 'red' } }}
                      onClick={() => handleDelete(index)}
                      disabled={isDisabled}
                    />
                  </Stack>
                </Stack>
                <div>
                  <Text variant="medium" className={styles.descriptionText}>
                    {field.Comentario}
                  </Text>
                </div>
              </Stack>
            ))}
        </Stack>
      ) : (
        <Stack
          horizontal
          horizontalAlign="center"
          verticalAlign="center"
          tokens={{ childrenGap: 10 }}
        >
          <img src={EmptyDataSVG} alt="No data" style={{ height: 200, width: 'auto' }} />
          <Stack>
            <Text styles={{ root: { fontWeight: 'bold', fontSize: 18 } }}>
              No tenés descripciones cargadas.
            </Text>

            {errors?.MensajesDescripcion?.message && (
              <Text className={styles.errorText} style={{ marginTop: '25px' }}>
                {errors.MensajesDescripcion.message}
              </Text>
            )}
          </Stack>
        </Stack>
      )}
      <FormPanel
        title={
          currentMessageIndex !== null
            ? 'Editar Descripción de la Alerta'
            : 'Descripción de la Alerta'
        }
        isOpen={isPanelOpen}
        onSave={() => {
          if (localForm.Comentario.trim()) {
            handleSave({ Comentario: localForm.Comentario });
          }
        }}
        onCancel={() => {
          setIsPanelOpen(false);
          setLocalForm({ Comentario: '' });
        }}
        saveLabel="Guardar"
        cancelLabel="Cancelar"
        isSaveDisabled={!localForm.Comentario.trim()}
      >
        <Stack tokens={{ childrenGap: 5 }}>
          <TextField
            label="Comentario"
            required={true}
            multiline
            rows={16}
            maxLength={3000}
            value={localForm.Comentario}
            onChange={(_, newValue) => {
              const limitedValue = newValue?.slice(0, 3000) || '';
              setLocalForm({ Comentario: limitedValue });
              setCharCount(limitedValue.length);
            }}
          />
          <Text
            variant="small"
            styles={{
              root: {
                color: charCount === 3000 ? '#a4262c' : '#666666',
                fontSize: '12px',
                textAlign: 'right',
              },
            }}
          >
            {`${charCount}/3000`}
          </Text>
        </Stack>
      </FormPanel>
    </>
  );
};

export { DescripcionAlerta };
