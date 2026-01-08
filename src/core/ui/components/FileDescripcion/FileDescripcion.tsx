import * as React from 'react';
import { DefaultButton, Stack, TextField } from '@fluentui/react';
import { IAdjunto } from '../../../entities/Adjunto';
import styles from './FileDescripcion.module.scss';

export interface FileDescripcionProps {
  stateFiles: IAdjunto[];
  setStateFiles: (state: IAdjunto[]) => void;
  control: any;
  isDisabled: boolean;
  errors: any;
}

const FileDescripcion: React.FunctionComponent<FileDescripcionProps> = ({
  stateFiles,
  setStateFiles,
  control,
  isDisabled,
  errors,
}) => {
  const FilesCargados = (field, index: number) => {
    const inputImage = new Image();
    inputImage.onload = () => {
      inputImage.style.maxHeight = '100%';
      inputImage.style.maxWidth = '100%';
    };
    inputImage.onerror = () => {
      inputImage.src = require('../../../../webparts/seguridadFisica/assets/archivo-generico.svg');
    };
    let urlImg: string = field.ServerRelativeUrl;

    const extension = urlImg
      ? urlImg.split('.').pop().toUpperCase()
      : field.Name.split('.').pop().toUpperCase();
    let iconSrc: string;
    let isGenericIcon: boolean = false;

    switch (extension) {
      case 'WMV':
      case 'MP4':
      case 'MOV':
      case 'AVI':
        iconSrc = require('../../../../webparts/seguridadFisica/assets/archivo-de-video.svg');
        isGenericIcon = true;
        break;
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'GIF':
        if (field.ServerRelativeUrl) {
          iconSrc = field.ServerRelativeUrl;
        } else {
          iconSrc = URL.createObjectURL(field.Archivo);
        }
        break;

      default:
        iconSrc = require('../../../../webparts/seguridadFisica/assets/archivo-generico.svg');
        isGenericIcon = true;
        break;
    }

    const deleteFile = (index) => {
      const copyArray = [...stateFiles];
      const updatedItem = {
        ...copyArray[index],
        deleted: true,
        Descripcion: copyArray[index].Descripcion || 'para borrar',
      };
      const newArray = [
        ...copyArray.slice(0, index),
        updatedItem,
        ...copyArray.slice(index + 1),
      ];
      setStateFiles(newArray);
    };

    if (!field.deleted) {
      return (
        <Stack horizontal horizontalAlign="space-evenly" style={{ padding: '15px' }}>
          <div className={styles.ImgContainer}>
            <img
              className={isGenericIcon ? styles.GenericIcon : styles.ImgContainer_Icon}
              src={iconSrc}
              alt={`Imagen ${index}`}
            />
          </div>
          <Stack className={styles.ImgDescription}>
            <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
              {field.Name ? (
                <a href={field.ServerRelativeUrl} download={field.Name}>
                  {'Descargar'}
                </a>
              ) : (
                <label>{field.Archivo?.name}</label>
              )}
              {!isDisabled && (
                <DefaultButton
                  className={styles.FileDescripcion_buttonStyle}
                  onClick={() => deleteFile(index)}
                  iconProps={{ iconName: 'Delete' }}
                />
              )}
            </Stack>
            <TextField
              className={styles.FileDescripcion_Caja}
              label="Descripción"
              disabled={isDisabled}
              required
              multiline
              rows={3}
              value={stateFiles[index].Descripcion}
              onChange={(e, newValue) => {
                const copyArray = [...stateFiles];
                const updatedItem = {
                  ...copyArray[index],
                  Descripcion: newValue,
                  modified: true,
                  errorDescripcion: false,
                };

                const newArray = [
                  ...copyArray.slice(0, index),
                  updatedItem,
                  ...copyArray.slice(index + 1),
                ];

                setStateFiles(newArray);
              }}
            />
            {stateFiles[index].errorDescripcion && (
              <span className={styles.errorText}>El campo es obligatorio</span>
            )}
          </Stack>
        </Stack>
      );
    }
  };

  return (
    <>
      {stateFiles.length > 0 && (
        <div>
          {stateFiles.map((field, index) => {
            return FilesCargados(field, index);
          })}
        </div>
      )}
    </>
  );
};

export { FileDescripcion };
