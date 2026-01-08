import * as React from 'react';
import {
  Dialog,
  Icon,
  IModalProps,
  DialogType,
  DialogFooter,
  PrimaryButton,
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import styles from './WebWarningDialog.module.scss';

interface Vpn {
  isConnected: boolean;
}
const WebWarningDialog: React.FunctionComponent<Vpn> = ({ isConnected }) => {
  const labelId: string = useId('dialogLabel');
  const subTextId: string = useId('subTextLabel');

  const modalProps = React.useMemo<IModalProps>(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: true,
      styles: { main: { maxWidth: 600 } },
      className: styles.WebWarningDialog,
    }),
    [labelId, subTextId],
  );

  const handleReload = React.useCallback(() => {
    location.reload();
  }, []);

  return (
    <Dialog
      hidden={isConnected}
      dialogContentProps={{ type: DialogType.normal, showCloseButton: false }}
      modalProps={modalProps}
    >
      <div className={styles.dialog_warning}>
        <div className={styles.dialog_cabecera}>
          <Icon iconName="StatusCircleExclamation" />
          <h1>Verificar conexión</h1>
        </div>
        <hr className={styles.dialog_divider} />
        <div className={styles.dialog_descripcion}>
          Para utilizar la aplicación debés estar conectado a la red de la Empresa. Verificá la
          conexión y volvé a intentar.
        </div>
        <DialogFooter>
          <PrimaryButton onClick={handleReload} text={'Recargar'} />
        </DialogFooter>
      </div>
    </Dialog>
  );
};

export default WebWarningDialog;
