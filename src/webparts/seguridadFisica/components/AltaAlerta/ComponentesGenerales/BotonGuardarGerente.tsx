import * as React from 'react';
import { PrimaryButton, CommandBar, ICommandBarItemProps } from '@fluentui/react';
import DialogCustom from '../../../../../core/ui/components/DialogCustom/DialogCustom';
import SPODataProvider from '../../../../../core/pnp/sp/SharePointDataProvider';
import { useNavigate } from 'react-router-dom';
import {
  AlertTypes,
  CodigosCorreos,
  Estados,
  LIST_NAMES,
} from '../../../../../core/utils/Constants';
import { IAlerta } from '../../../../../core/interfaces/IAlerta';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';

interface BotonGuardarGerenteProps {
  isSavedAprobar: boolean;
  alertData: IAlerta;
  updateAlerta: (mensaje?: string) => void;
  stateEstado: string;
  sendEmailManager: (codigoCorreo: CodigosCorreos, alertData: IAlerta) => Promise<void>;
}

interface DataLogProps {
  UsuarioId: number;
  IDAlertaId: number;
  Fecha_hora: Date;
  Estado: string;
  ComentarioEliminacion?: string;
  ComentarioDevolucion?: string;
  ComentarioAprobacion?: string;
}
const BotonGuardarGerente: React.FC<BotonGuardarGerenteProps> = ({
  isSavedAprobar,
  alertData,
  updateAlerta,
  stateEstado,
  sendEmailManager,
}) => {
  const {
    isDisabled,
    getValues,
    formState: { errors },
    watch,
  } = useCustomFormContext();
  const navigate = useNavigate();
  const [hideDialogAprobar, setHideDialogAprobar] = React.useState(true);
  const [hideDialogDevolver, setHideDialogDevolver] = React.useState(true);
  const [hideDialogEliminar, setHideDialogEliminar] = React.useState(true);
  const [isProcessingAprobar, setIsProcessingAprobar] = React.useState(false);
  const [isProcessingDevolver, setIsProcessingDevolver] = React.useState(false);
  const [isProcessingEliminar, setIsProcessingEliminar] = React.useState(false);
  const disableAprobarGuardar = watch('states.disableAprobarGuardar');

  const handleDialog =
    (setState: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => () => {
      setState(value);
    };

  const handleUpdateEstado = async (
    estado: string,
    mensaje: string,
    comentario?: string,
  ): Promise<void> => {
    await SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, {
      Estado: estado,
      EstadoGerente: null,
    });
    const usuario = await SPODataProvider.GetCurrentUser();

    const DataLog: DataLogProps = {
      UsuarioId: usuario.Id,
      IDAlertaId: Number(alertData.Id),
      Fecha_hora: new Date(),
      Estado: estado,
    };
    if (estado === Estados.DevueltaCOS) {
      DataLog.ComentarioDevolucion = comentario;
    } else if (estado === Estados.Eliminado) {
      DataLog.ComentarioEliminacion = comentario;
    } else {
      DataLog.ComentarioAprobacion = comentario;
    }
    await SPODataProvider.add(LIST_NAMES.LOG_ALERTAS, DataLog);
    if (estado == Estados.DevueltaCOS) {
      alertData.Estado = Estados.DevueltaCOS;
      await sendEmailManager(CodigosCorreos.CO006, alertData);
    }
    await SPODataProvider.PushConexionGIS(alertData.Id);

    if (alertData.EsMOB) {
      switch (estado) {
        case Estados.DevueltaCOS:
        case Estados.Eliminado:
        case Estados.Finalizado:
        case Estados.Bloqueoproceso:
        case Estados.Eninvestigacion:
        case Estados.FrustradoIntSSFF:
        case Estados.Frustrado:
        case Estados.Concretado:
          await SPODataProvider.PushConexionMobile(alertData.Id);
          break;
      }
    }
    updateAlerta(mensaje);
    navigate('/');
  };

  const overflowItems: ICommandBarItemProps[] = [
    {
      key: 'Devolveralerta',
      text: 'Devolver alerta...',
      onClick: handleDialog(setHideDialogDevolver, false),
      iconProps: { iconName: 'Reply' },
      disabled: isDisabled,
    },
    {
      key: 'Eliminaralerta',
      text: 'Eliminar alerta...',
      onClick: handleDialog(setHideDialogEliminar, false),
      iconProps: { iconName: 'Delete' },
      disabled: isDisabled,
    },
  ];

  const handleAprobarClick = async () => {
    if (isProcessingAprobar) return; 
    
    setIsProcessingAprobar(true);
    try {
      const estado =
        alertData.TipoAlerta !== AlertTypes.AlertaIncidente
          ? Estados.Finalizado
          : getValues('EstadoGerente');
      await handleUpdateEstado(
        estado,
        `Se ha cambiado el estado de la alerta Nro. ${alertData.Id} correctamente.`,
      );
    } finally {
      setIsProcessingAprobar(false);
    }
  };

  const handleDevolverClick = async (comentario: string) => {
    if (isProcessingDevolver) return;
    
    setIsProcessingDevolver(true);
    try {
      await handleUpdateEstado(
        Estados.DevueltaCOS,
        `La alerta ${alertData.Id} ha sido devuelta correctamente.`,
        comentario,
      );
    } finally {
      setIsProcessingDevolver(false);
    }
  };

  const handleEliminarClick = async () => {
    if (isProcessingEliminar) return; 
    
    setIsProcessingEliminar(true);
    try {
      await handleUpdateEstado(
        Estados.Eliminado,
        `La alerta ${alertData.Id} ha sido eliminada.`,
      );
    } finally {
      setIsProcessingEliminar(false);
    }
  };

  return (
    <>
      <PrimaryButton
        text="Aprobar"
        onClick={handleDialog(setHideDialogAprobar, false)}
        disabled={isDisabled || !isSavedAprobar || disableAprobarGuardar}
      />
      <CommandBar items={[]} overflowItems={overflowItems} />
      <DialogCustom
        text={'¿Desea aprobar el nuevo estado?'}
        title={'Confirmar Aprobación'}
        hideDialog={hideDialogAprobar}
        btnAceptar={handleAprobarClick}
        btnCancelar={handleDialog(setHideDialogAprobar, true)}
        showComentario={false}
      />
      <DialogCustom
        text={'¿Desea devolver la alerta?'}
        title={'Confirmar Devolución'}
        hideDialog={hideDialogDevolver}
        btnAceptar={handleDevolverClick}
        btnCancelar={handleDialog(setHideDialogDevolver, true)}
        showComentario={true}
      />
      <DialogCustom
        text={'¿Desea eliminar la alerta?'}
        title={'Confirmar Eliminación'}
        hideDialog={hideDialogEliminar}
        btnAceptar={handleEliminarClick}
        btnCancelar={handleDialog(setHideDialogEliminar, true)}
        showComentario={false}
      />
    </>
  );
};

export { BotonGuardarGerente };
