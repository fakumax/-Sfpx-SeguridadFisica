import * as React from 'react';
import { CommandBar, ICommandBarItemProps, PrimaryButton } from '@fluentui/react';
import { useCustomFormContext } from '../../../common/context/CustomFormProvider';
import { useNavigate } from 'react-router-dom';
import SPODataProvider from '../../../../../core/pnp/sp/SharePointDataProvider';
import { AlertTypes, Estados, LIST_NAMES } from '../../../../../core/utils/Constants';
import DialogCustom from '../../../../../core/ui/components/DialogCustom/DialogCustom';

interface BotonGuardarProps {
  currentSectionIndex: number;
  sections: any[];
  isSaved: boolean;
  isDisabled: boolean;
  handleNext: () => void;
  alertData: any;
  updateAlerta: (mensaje?: string) => void;
}

interface DataLogProps {
  UsuarioId: number;
  IDAlertaId: number;
  Fecha_hora: Date;
  Estado: string;
  ComentarioEliminacion?: string;
  ComentarioDevolucion?: string;
}

const BotonGuardar: React.FC<BotonGuardarProps> = ({
  currentSectionIndex,
  sections,
  isSaved,
  isDisabled,
  handleNext,
  alertData,
  updateAlerta,
}) => {
  const navigate = useNavigate();

  const [hideDialogDevolver, setHideDialogDevolver] = React.useState(true);
  const [hideDialogEliminar, setHideDialogEliminar] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isProcessingDevolver, setIsProcessingDevolver] = React.useState(false);
  const [isProcessingEliminar, setIsProcessingEliminar] = React.useState(false);

  const handleDialogClose =
    (setHideDialog: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setHideDialog(true);
    };

  const handleDialogOpen =
    (setHideDialog: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setHideDialog(false);
    };

  const { watch } = useCustomFormContext();
  const disableAprobarGuardar = watch('states.disableAprobarGuardar');
  const novedadValue = watch('AlertaDatos.Novedad');
  const tipoAlertaValue = watch('TipoAlerta');

  const getButtonText = () => {
    if (currentSectionIndex !== undefined && currentSectionIndex === 6) {
      if (
        novedadValue === 'Alerta CON NOVEDAD' ||
        tipoAlertaValue === AlertTypes.AlertaIncidente
      ) {
        return 'Enviar a aprobar';
      } else {
        return 'Finalizar alerta';
      }
    } else {
      return `Continuar (${currentSectionIndex + 1}/${sections.length})`;
    }
  };

  const handleUpdateEstado = async (
    estado: string,
    mensaje: string,
    comentario?: string,
    deleteCos?: boolean,
  ): Promise<void> => {
    await SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, {
      Estado: estado,
      ...(deleteCos && { COSasignadoId: null }),
    });
    const usuario = await SPODataProvider.GetCurrentUser();

    const DataLog: DataLogProps = {
      UsuarioId: usuario.Id,
      IDAlertaId: Number(alertData.Id),
      Fecha_hora: new Date(),
      Estado: estado,
    };

    if (estado === Estados.DevueltaVigilador) {
      DataLog.ComentarioDevolucion = comentario;
    } else if (estado === Estados.EliminadaCOS) {
      DataLog.ComentarioEliminacion = comentario;
    }

    await SPODataProvider.add(LIST_NAMES.LOG_ALERTAS, DataLog);

    switch (estado) {
      case Estados.DevueltaVigilador:
      case Estados.EliminadaCOS:
        await SPODataProvider.PushConexionGIS(alertData.Id);
        if (alertData.EsMOB) {
          await SPODataProvider.PushConexionMobile(
            alertData.Id,
            estado === Estados.DevueltaVigilador ? comentario : undefined,
          );
        }
        break;
    }
    updateAlerta(mensaje);
    navigate('/');
  };

  const isDisableCosButton = (): boolean => {
    if (isDisabled) return true;
    else if (!alertData.EsMOB) return true;
    else if (alertData.EsMOB && alertData.Estado == Estados.Asignada) return false;
    return isDisabled;
  };

  const overflowItems: ICommandBarItemProps[] = [
    {
      key: 'Devolveralerta',
      text: 'Devolver alerta...',
      onClick: handleDialogOpen(setHideDialogDevolver),
      iconProps: { iconName: 'Reply' },
      disabled: isDisableCosButton(),
    },
    {
      key: 'Eliminaralerta',
      text: 'Eliminar alerta...',
      onClick: handleDialogOpen(setHideDialogEliminar),
      iconProps: { iconName: 'Delete' },
      disabled: isDisabled,
    },
  ];

  const handleButtonClick = async () => {
    if (isProcessing) return; 
    
    setIsProcessing(true);
    try {
      await handleNext();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDevolverClick = async (comentario: string) => {
    if (isProcessingDevolver) return; 
    
    setIsProcessingDevolver(true);
    try {
      await handleUpdateEstado(
        Estados.DevueltaVigilador,
        `La alerta ${alertData.Id} ha sido devuelta correctamente.`,
        comentario,
        true,
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
        Estados.EliminadaCOS,
        `La alerta ${alertData.Id} ha sido eliminada.`,
      );
    } finally {
      setIsProcessingEliminar(false);
    }
  };

  return (
    <>
      <PrimaryButton
        text={getButtonText()}
        onClick={handleButtonClick}
        disabled={!isSaved || isDisabled || disableAprobarGuardar || isProcessing}
      />
      <CommandBar items={[]} overflowItems={overflowItems} />
      <DialogCustom
        text={'¿Desea devolver la alerta?'}
        title={'Confirmar Devolución'}
        hideDialog={hideDialogDevolver}
        btnAceptar={handleDevolverClick}
        btnCancelar={handleDialogClose(setHideDialogDevolver)}
        showComentario={true}
      />
      <DialogCustom
        text={'¿Desea eliminar la alerta?'}
        title={'Confirmar Eliminación'}
        hideDialog={hideDialogEliminar}
        btnAceptar={handleEliminarClick}
        btnCancelar={handleDialogClose(setHideDialogEliminar)}
        showComentario={false}
      />
    </>
  );
};

export { BotonGuardar };
