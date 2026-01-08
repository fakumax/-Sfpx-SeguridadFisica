import * as React from 'react';

import { ShowPanel } from '../';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IDialogStyles,
  IStyleFunctionOrObject,
  ITextFieldStyles,
  Label,
  PrimaryButton,
  TextField,
} from '@fluentui/react';
import styles from './DialogCustom.module.scss';

export interface IMessageBarProps {
  title?: string;
  text?: string;
  btnAceptar?: (comentario?: string) => void;
  btnCancelar?: () => void;
  hideDialog: boolean;
  showComentario?: boolean;
}

const DialogCustom: React.FunctionComponent<IMessageBarProps> = ({
  title,
  text,
  btnAceptar,
  btnCancelar,
  hideDialog,
  showComentario = true,
}) => {
  React.useEffect(() => {}, [text]);

  const dialogContentProps = {
    type: DialogType.normal,
    title: title || '',
    subText: text,
    closeButtonAriaLabel: 'Close',
  };
  const modalProps = React.useMemo(
    () => ({
      isBlocking: true,
    }),
    [false],
  );

  const [comentario, setComentario] = React.useState(undefined);
  const [error, setError] = React.useState<string | null>(null);

  const onAceptar = () => {
    if (showComentario && (!comentario || comentario.trim() === '')) {
      setError('El campo es obligatorio');
    } else {
      setError(null);
      btnAceptar(showComentario ? comentario : undefined);
    }
  };

  const textFieldStyles: IStyleFunctionOrObject<{}, ITextFieldStyles> = {
    errorMessage: {
      color: 'red',
    },
    fieldGroup: {
      border: 'none',
      selectors: {
        '&::after, &::before': {
          border: '1px solid #0078d4 !important',
        },
      },
    },
    field: {
      border: '1px solid gray',
      boxShadow: 'none',
      selectors: {
        '&[data-invalid]': {
          border: 'none',
          boxShadow: 'none',
        },
      },
    },
  };

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={btnCancelar}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      {showComentario && (
        <>
          <Label className={styles.requiredLabel}>Comentario </Label>
          <TextField
            multiline
            rows={6}
            onChange={(_event, newValue) => setComentario(newValue)}
            errorMessage={error}
            styles={textFieldStyles}
          />
        </>
      )}
      <DialogFooter>
        <PrimaryButton onClick={onAceptar} text="Aceptar" />
        <DefaultButton onClick={btnCancelar} text="Cancelar" />
      </DialogFooter>
    </Dialog>
  );
};

export default DialogCustom;
