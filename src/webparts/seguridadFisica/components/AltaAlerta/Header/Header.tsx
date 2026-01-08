import * as React from 'react';
import { Stack, Label, Text, Separator, Link, Toggle, Icon } from '@fluentui/react';
import styles from './Header.module.scss';
import { IAlerta } from '../../../../../core/interfaces/IAlerta';
import { getStatusColor } from '../../../common/helpers';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';
import { useFormContext } from 'react-hook-form';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Estados } from '../../../../../core/utils/Constants';
import SPODataProvider from '../../../../../core/pnp/sp/SharePointDataProvider';

interface HeaderProps {
  alertData: IAlerta | null;
  context: WebPartContext;
  puedeEditar: boolean;
  UpdateEstado: (newEstado: string, asignado: number, isDisabled: boolean) => void;
  UserEdit: string;
}

const Header: React.FC<HeaderProps> = ({
  alertData,
  context,
  puedeEditar,
  UpdateEstado,
  UserEdit,
}) => {
  const { isDisabled, setIsDisabled } = useCustomFormContext();
  const { setValue } = useFormContext();
  const [estadoAlerta, setEstadoAlerta] = React.useState<string>(alertData?.Estado || '');
  const [initialEstado, setInitialEstado] = React.useState<string>(
    alertData?.Estado || '',
  );
  const [toggleLabelText, settoggleLabelText] = React.useState('');

  React.useEffect(() => {
    if (alertData) {
      setEstadoAlerta(alertData.Estado);
      setInitialEstado(alertData.Estado);
      setValue('Estado', alertData.Estado);
    }
  }, [alertData, setValue]);

  const handleToggleChange = () => {
    let nuevoEstado = estadoAlerta;
    let asignado = 0;
    switch (estadoAlerta) {
      case Estados.Ingresada:
        nuevoEstado = isDisabled ? Estados.Asignada : Estados.Asignada;
        asignado = 1;
        break;
      case Estados.Asignada:
        nuevoEstado = isDisabled ? Estados.Asignada : Estados.Ingresada;
        asignado = 1;
        break;
      case Estados.DerivadaAprobador:
        nuevoEstado = isDisabled ? Estados.AsignadaAprobador : Estados.AsignadaAprobador;
        asignado = 2;
        break;
      case Estados.AsignadaAprobador:
        nuevoEstado = isDisabled ? Estados.DerivadaAprobador : Estados.DerivadaAprobador;
        asignado = 2;
        break;
      case Estados.DevueltaCOS:
        asignado = 1;
        break;
      case Estados.Bloqueoproceso:
      case Estados.Eninvestigacion:
      case Estados.Frustrado:
      case Estados.FrustradoIntSSFF:
      case Estados.Finalizado:
        asignado = 2;
        break;
    }
    setEstadoAlerta(nuevoEstado);
    setIsDisabled(!isDisabled);
    setValue('Estado', nuevoEstado);
    UpdateEstado(nuevoEstado, asignado, isDisabled);
    if (isDisabled) {
      settoggleLabelText('Trabajando en la alerta');
    } else {
      settoggleLabelText('Trabajar en la alerta');
    }
  };

  React.useEffect(() => {
    //Observacion: hay 3 opciones: 1-La está trabajando otro  2-La estoy trabajando yo  3-No la está trabajando nadie.
    if (UserEdit != undefined) {
      let usuario = UserEdit.split(':');
      if (usuario.length > 1) {
        let labelText = `Actualmente la está trabajando ${usuario[1]}`;
        settoggleLabelText(labelText);
      } else {
        if (UserEdit != '') {
          let labelText = 'Trabajando en la alerta';
          settoggleLabelText(labelText);
          //Habilita la edición.
          if (puedeEditar) {
            setIsDisabled(false);
          }
        } else {
          settoggleLabelText('Trabajar en la alerta');
        }
      }
    }
  }, [UserEdit]);

  return (
    <div id="HeaderAlerta">
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        styles={{
          root: { marginBottom: 16, paddingLeft: 10, paddingRight: 10 },
        }}
      >
        <Text variant="xLarge" className={styles.headerTitle}>
          Alta de alerta
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center">
          {puedeEditar && (
            <Toggle
              label={toggleLabelText}
              inlineLabel
              styles={{ root: { margin: 0 } }}
              onChange={handleToggleChange}
              checked={!isDisabled}
            />
          )}
        </Stack>
      </Stack>
      <div className={styles.incidentInfoContainer}>
        <Stack tokens={{ childrenGap: 10 }}>
          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            className={styles.incidentTopRow}
          >
            <Stack horizontal verticalAlign="baseline" tokens={{ childrenGap: 5 }}>
              <Label className={styles.incidentLabel}>Nro. de Alerta:&nbsp;</Label>
              <Text variant="superLarge" className={styles.incidentNumber}>
                {alertData ? `${alertData.Anio}-${alertData.Id}` : 'Cargando...'}
              </Text>
            </Stack>
            <Text
              variant="mediumPlus"
              className={styles.status}
              style={{
                backgroundColor: getStatusColor(estadoAlerta),
              }}
            >
              {estadoAlerta}
            </Text>
          </Stack>
          <Stack horizontal horizontalAlign="space-between" className={styles.detailsRow}>
            <Separator
              vertical
              className={`${styles.verticalSeparator} ${styles.noMargin}`}
            />
            <Stack tokens={{ childrenGap: 5 }} className={styles.detailItem}>
              <Label>Región</Label>
              <Text>{alertData ? alertData.Region : 'Cargando...'}</Text>
            </Stack>
            <Separator vertical className={styles.verticalSeparator} />
            <Stack tokens={{ childrenGap: 5 }} className={styles.detailItem}>
              <Label>Instalación</Label>
              <Text>{alertData ? alertData.Instalacion : 'Cargando...'}</Text>
            </Stack>
            <Separator vertical className={styles.verticalSeparator} />
            <Stack tokens={{ childrenGap: 5 }} className={styles.detailItem}>
              <Label>Latitud</Label>
              <Text>{alertData ? alertData.Latitud : 'Cargando...'}</Text>
            </Stack>
            <Stack tokens={{ childrenGap: 5 }} className={styles.detailItem}>
              <Label>Longitud</Label>
              <Text>{alertData ? alertData.Longitud : 'Cargando...'}</Text>
            </Stack>
            <Separator vertical className={styles.verticalSeparator} />

            {/* <Link
              href={SPODataProvider.GetGisURL()}
              className={styles.editLink}
              target="_blank"
              disabled={isDisabled}
            >
              <Icon iconName="POI" className={styles.editIcon} /> Editar datos desde el
              mapa
            </Link> */}
          </Stack>
        </Stack>
      </div>
      {alertData?.EsMOB && (
        <div
          className={`${styles.incidentInfoContainer} ${styles.incidentInfoContainerMobile}`}
        >
          <Stack tokens={{ childrenGap: 10 }}>
            <Stack
              horizontal
              horizontalAlign="space-between"
              className={styles.detailsRow}
            >
              <Stack
                tokens={{ childrenGap: 5 }}
                className={`${styles.detailItem} ${styles.mobile}`}
              >
                <Label>Ubicación del dispositivo Móvil</Label>
              </Stack>

              <Separator vertical className={styles.verticalSeparator} />
              <Stack tokens={{ childrenGap: 5 }} className={styles.detailItem}>
                <Label>Latitud</Label>
                <Text>
                  {alertData.LatitudDispositivo ? alertData.LatitudDispositivo : 'S/D'}
                </Text>
              </Stack>
              <Stack tokens={{ childrenGap: 5 }} className={styles.detailItem}>
                <Label>Longitud</Label>
                <Text>
                  {alertData.LongitudDispositivo ? alertData.LongitudDispositivo : 'S/D'}
                </Text>
              </Stack>
              <Separator vertical className={styles.verticalSeparator} />
            </Stack>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default Header;
