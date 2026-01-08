import * as React from 'react';
import { Text, DefaultButton, Stack } from '@fluentui/react';
import EmptyDataSVG from '../../../assets/img-sin-datos.svg';
import styles from './ImagenesVideos.module.scss';
import { FileDescripcion } from '../../../../../core/ui/components/FileDescripcion/FileDescripcion';
import { IAdjunto } from '../../../../../core/entities/Adjunto';
import { LIST_NAMES } from '../../../../../core/utils/Constants';
import SPODataProvider from '../../../../../core/pnp/sp/SharePointDataProvider';
import { useParams } from 'react-router-dom';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';

const ImagenesVideos = ({ stateFiles, setStateFiles, isValidForm }) => {
  const {
    control,
    setValue,
    watch,
    isDisabled,
    formState: { errors },
  } = useCustomFormContext();

  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    let filtro = `IDAlerta eq '${id}'`;
    const archivo = SPODataProvider.getListItems(
      LIST_NAMES.FOTOSYVIDEOS,
      '*,File/Name,File/ServerRelativeUrl',
      filtro,
      'File',
    );
    archivo.then((response) => {
      const ListaArchivosINI: IAdjunto[] = [];
      response.forEach((data) => {
        let Nombre = data['File']['Name'];
        let descripcion = data['Descripcion'];
        let ServerRelativeUrl = data['File']['ServerRelativeUrl'];
        let idItem = data['ID'];
        let uniqueID = `Item-${idItem}`;

        const adjunto: IAdjunto = {
          Archivo: null,
          Contenido: null,
          UniqueID: uniqueID,
          FileID: '',
          Descripcion: descripcion,
          ServerRelativeUrl: ServerRelativeUrl,
          Name: Nombre,
          IdItem: idItem.toString(),
          added: false,
          modified: false,
          deleted: false,
          errorDescripcion: false,
        };
        ListaArchivosINI.push(adjunto);
      });
      setStateFiles(ListaArchivosINI);
      setValue('Imagenes', ListaArchivosINI || []);
    });
  }, []);

  const hiddenFileInput = React.useRef(null);

  const handleClickFile = () => {
    hiddenFileInput.current.click();
  };

  const handleFileUpload = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const contenido = e.target.result;
        const uniqueID = `File-${Date.now()}`;
        const newAdjunto: IAdjunto = {
          Archivo: archivo,
          Contenido: contenido,
          UniqueID: uniqueID,
          FileID: '',
          Descripcion: '',
          ServerRelativeUrl: '',
          Name: archivo.name,
          IdItem: '',
          added: true,
          modified: false,
          deleted: false,
          errorDescripcion: false,
        };
        setStateFiles([...stateFiles, newAdjunto]);
      };
      reader.readAsArrayBuffer(archivo);
    }
  };

  const hasFilesToShow = (): boolean => {
    return stateFiles.some((file) => !file.deleted);
  };

  return (
    <>
      <Stack horizontal horizontalAlign="end">
        {!isDisabled && (
          <DefaultButton
            text="Agregar"
            onClick={handleClickFile}
            className={styles.ImagenesVideos_buttonStyle}
            iconProps={{ iconName: 'Add' }}
          />
        )}
      </Stack>
      <div>
        <input
          title="myfile"
          ref={hiddenFileInput}
          type="file"
          id="Attachment"
          name="myfile"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>
      <div>
        {stateFiles.length > 0 && hasFilesToShow() ? (
          <FileDescripcion
            stateFiles={stateFiles}
            setStateFiles={setStateFiles}
            control={control}
            isDisabled={isDisabled}
            errors={errors}
          />
        ) : (
          <Stack
            horizontal
            horizontalAlign="center"
            verticalAlign="center"
            tokens={{ childrenGap: 10 }}
          >
            <img
              src={EmptyDataSVG}
              alt="No data"
              style={{ height: 200, width: 'auto' }}
            />
            <Stack>
              <Text styles={{ root: { fontWeight: 'bold', fontSize: 18 } }}>
                No tenés Imágenes y videos cargados.
              </Text>
              {!isValidForm.isValidImages && (
                <div className={styles.errorText}>El campo es obligatorio</div>
              )}
            </Stack>
          </Stack>
        )}
      </div>
    </>
  );
};

export { ImagenesVideos };
