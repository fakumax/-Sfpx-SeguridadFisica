import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header/Header';
import SPODataProvider from '../../../../core/pnp/sp/SharePointDataProvider';
import { IAlerta } from '../../../../core/interfaces/IAlerta';
import {
  DefaultButton,
  IconButton,
  IStackTokens,
  PrimaryButton,
  Separator,
  Stack,
  TooltipHost,
} from '@fluentui/react';
import DatosBase from './DatosBase/DatosBase';
import styles from './AltaAlerta.module.scss';
import { AccordionSection } from '../../../../core';
import { expandFields, selectFields } from '../../common/helpers';
import { useCustomFormContext } from '../../common/context/CustomFormProvider';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { DescripcionAlerta } from './DescripcionAlerta/DescripcionAlerta';
import {
  AlertTypes,
  Estados,
  LIST_NAMES,
  Permisos,
} from '../../../../core/utils/Constants';
import { mapperData } from '../../../../core/utils/mapperData';
import { Impacto } from './Impacto/Impacto';
import { ImagenesVideos } from './ImagenesVideos/ImagenesVideos';
import { Involucrados } from './Involucrados/Involucrados';
import { Antecedentes } from './Antecedentes/Antecedentes';
import { Complementarios } from './Complementarios/Complementarios';
import { UpdateComentarios } from '../../../../core/api/services/descripcionAlertaService';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { formatAntecedenteToSend } from '../../../../core/api/services/antecedenteService';
import { ItemInvolucrados } from '../../../../core/entities/Involucrados';
import { ItemComplementarios } from '../../../../core/entities/Complementarios';
import { UpdateImpactos } from '../../../../core/api/services/impactoService';
import { EstadoGerenteRegional } from './EstadoGerenteRegional/EstadoGerenteRegional';
import {
  ValidateEmailApprove,
  sendEmail,
} from '../../../../core/api/services/emailService';
import { OpcionFinal } from './OpcionFinal/OpcionFinal';
import { BotonGuardar } from './ComponentesGenerales/BotonGuardar';
import { BotonGuardarGerente } from './ComponentesGenerales/BotonGuardarGerente';
import { UpdateImagen } from '../../../../core/api/services/imageAndVideoService';
import { IDatosBase } from '../../../../core/interfaces/IDatosBase';
import moment from 'moment';

import { handleCreateWord } from '../../utils/CreateWord/CreateWord';
import { CertificateIcon } from '@fluentui/react-icons-mdl2';
import { IAdjunto } from '../../../../core/entities/Adjunto';

interface AltaAlertaProps {
  context: WebPartContext;
  permiso: string;
  region: string;
  updateAlerta: (mensaje?: string) => void;
}

const AltaAlerta: React.FC<AltaAlertaProps> = ({
  context,
  permiso,
  region,
  updateAlerta,
}) => {
  const { isDisabled, setIsDisabled, trigger, getValues, setValue, watch, setError } =
    useCustomFormContext();

  const isTratamiento = (estado?: string): boolean => {
    return (
      estado === Estados.DerivadaAprobador ||
      estado === Estados.AsignadaAprobador ||
      estado === Estados.Eninvestigacion ||
      estado === Estados.Bloqueoproceso
    );
  };

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [alertData, setAlertData] = React.useState<IAlerta | null>(null);
  const [alertDatosBase, setDatosBase] = React.useState<IDatosBase>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = React.useState(0);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isSavedAprobar, setIsSavedAprobar] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [stateEdicionCOS, setEdicionCOS] = React.useState(false);
  const [stateGerenteRegional, setGerenteRegional] = React.useState(false);
  const [stateEstado, setEstado] = React.useState<string>(undefined);
  const [statePermiso, setPermiso] = React.useState('');
  const [statePuedeEditar, setPuedeEditar] = React.useState(false);
  const [stateImprimir, setImprimir] = React.useState(false);
  const [stateUserEdit, setUserEdit] = React.useState(undefined);
  const [involucradosData, setInvolucradosData] = React.useState<ItemInvolucrados[]>([]);
  const [involucradosEliminarData, setInvolucradosEliminarData] = React.useState<
    ItemInvolucrados[]
  >([]);

  const [mobileStatus, setMobileStatus] = React.useState({
    Comment: '',
    modifiedDate: null,
    modifiedBy: null,
  });

  const [GisStatus, setGisStatus] = React.useState({
    Comment: '',
    modifiedDate: null,
    modifiedBy: null,
  });

  const [stateFiles, setStateFiles] = React.useState<IAdjunto[]>([]);
  const [isValidForm, setIsValidForm] = React.useState({
    isValidImages: true,
  });

  const sections = [
    { component: DatosBase, title: 'Datos base' },
    {
      component: DescripcionAlerta,
      title: 'Descripción de la alerta',
    },
    {
      component: Impacto,
      title: 'Impacto y pérdida asociada',
    },
    {
      component: ImagenesVideos,
      title: 'Imágenes y videos',
    },
    {
      component: Involucrados,
      title: 'Datos de los involucrados (opcionales)',
      props: {
        involucradosData,
        setInvolucradosData,
        involucradosEliminarData,
        setInvolucradosEliminarData,
      },
    },
    {
      component: Antecedentes,
      title: 'Antecedentes (opcionales)',
    },
    { component: Complementarios, title: 'Datos complementarios' },
  ];
  const sectionStackTokens: IStackTokens = { childrenGap: 10 };
  React.useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data: IAlerta = await SPODataProvider.getItemById(
          LIST_NAMES.ALERTAS,
          parseInt(id),
          selectFields,
          expandFields,
        );
        setAlertData(data);
        setDatosBase({
          ...alertDatosBase,
          Vicepresidencia: data.Vicepresidencia,
          UnidadDeNegocioId: data.UnidadDeNegocio?.Id || null,
          ActivoId: data.Activo?.Id || null,
          TipoAlerta: data.TipoAlerta,
          CategoriaPrincipalId: data.CategoriaPrincipal?.Id || null,
          CategoriaSecundariaId: data.CategoriaSecundaria?.Id || null,
          ReportadoPor: data.ReportadoPor,
          HoraIncidente: data.HoraIncidente,
          FechaHoraIncidente: moment(data.FechaHoraIncidente).format('YYYY-MM-DD'),
          EsMOB: data.EsMOB,
        });

        setValue('Anio', data.Anio || '');
        setValue('Provincia', data.Provincia || '');
        setValue('Latitud', data.Latitud || '');
        setValue('Longitud', data.Longitud || '');
        setValue('Instalacion', data.Instalacion || '');
        setValue('Region', data.Region || '');
        setValue('GerenteRegAsignado', data.GerenteRegAsignado || '');
        setValue('ReferenciaUbicacion', data.ReferenciaUbicacion || '');
        setValue('AlertaDatos.Observaciones', data.Observaciones || '');
        setValue('AlertaDatos.ObservacionGIS', data.ObservacionGIS || '');
        setValue('AlertaDatos.ObjetivoFijo', data.ObjetivoFijo || '');
      }
    };
    fetchData();
  }, [id]);

  React.useEffect(() => {
    setPermiso(region);
    let estado = alertData && alertData.Estado;
    let regionAlerta = alertData && alertData.Region;

    switch (estado) {
      case Estados.Finalizado:
      case Estados.Eninvestigacion:
      case Estados.Concretado:
      case Estados.Frustrado:
      case Estados.FrustradoIntSSFF:
      case Estados.Bloqueoproceso:
        setImprimir(true);
        break;
    }
    switch (permiso) {
      case Permisos.COS:
        if (
          (estado === Estados.Ingresada ||
            estado === Estados.DevueltaCOS ||
            estado === Estados.Asignada) &&
          regionAlerta &&
          region &&
          region.toUpperCase() == regionAlerta.toUpperCase()
        ) {
          setPuedeEditar(true);
        }
        if (
          estado === Estados.DevueltaVigilador ||
          estado === Estados.EliminadaCOS ||
          estado === Estados.Eliminado
        ) {
          navigate('/');
        }
        break;
      case Permisos.GERENTESREGIONALES:
        if (
          (estado === Estados.DerivadaAprobador ||
            estado === Estados.AsignadaAprobador ||
            estado === Estados.Bloqueoproceso ||
            estado === Estados.Eninvestigacion) &&
          regionAlerta &&
          region &&
          region.toUpperCase() == regionAlerta.toUpperCase()
        ) {
          setPuedeEditar(true);
        } else {
          setPuedeEditar(false);
        }
        if (
          estado === Estados.Eliminado ||
          estado === Estados.DevueltaCOS ||
          estado === Estados.EliminadaCOS ||
          estado === Estados.DevueltaVigilador ||
          estado === Estados.Ingresada ||
          estado === Estados.Asignada
        ) {
          navigate('/');
        }
        break;
    }
    const initialSectionIndex =
      alertData && alertData.var_Seccion != null ? alertData.var_Seccion - 1 : 0;

    const effectiveSectionIndex =
      alertData && isTratamiento(alertData.Estado)
        ? sections.length - 1
        : Math.min(initialSectionIndex, sections.length - 1);

    setCurrentSectionIndex(effectiveSectionIndex);
    if (initialSectionIndex == 1 && alertData.Observaciones && alertData.EsMOB) {
      setIsSaved(true);
    }
    if (initialSectionIndex === 4 || initialSectionIndex === 5) {
      setIsSaved(true);
    }

    if (initialSectionIndex < 7) {
      setEdicionCOS(true);
    }

    if (alertData && alertData.var_Seccion === 7) {
      if (permiso === Permisos.GERENTESREGIONALES) {
        setGerenteRegional(true);
        setEdicionCOS(false);
      } else if (permiso === Permisos.COS) {
        setEdicionCOS(true);
      }
    }
    if (alertData) {
      const currentUser = SPODataProvider.GetCurrentUser();
      currentUser.then((resUser) => {
        let userAsignado = undefined;
        if (
          alertData.Estado === Estados.Ingresada ||
          alertData.Estado === Estados.Asignada ||
          alertData.Estado === Estados.DevueltaCOS
        ) {
          userAsignado =
            alertData.COSasignado !== undefined ? alertData.COSasignado : undefined;
        }
        if (
          alertData.Estado === Estados.DerivadaAprobador ||
          alertData.Estado === Estados.Eninvestigacion ||
          alertData.Estado === Estados.AsignadaAprobador ||
          alertData.Estado === Estados.Bloqueoproceso
        ) {
          userAsignado =
            alertData.GerenteRegAsignado !== undefined
              ? alertData.GerenteRegAsignado
              : undefined;
        }
        if (userAsignado != undefined) {
          if (userAsignado.Id !== resUser.Id) {
            setUserEdit(`User:${userAsignado.Title}`);
          } else {
            setUserEdit(resUser.Title);
          }
        } else {
          setUserEdit('');
        }
      });
    }
  }, [alertData]);

  React.useEffect(() => {
    if (currentSectionIndex >= 3) {
      const copyArray = [...stateFiles];
      const hasFiles = copyArray.some((file) => !file.deleted);
      if (!hasFiles) {
        setIsSaved(false);
        setIsSavedAprobar(false);
      }
    }
  }, [stateFiles]);

  const GerenteDropdownChange = () => {
    setIsSavedAprobar(false);
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid && currentSectionIndex < sections.length - 1) {
      const newIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(newIndex);
      try {
        await SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, {
          var_Seccion: newIndex + 1,
        });
      } catch (error) {
        console.error('Error al actualizar el número de sección:', error);
      }
      setIsSaved(false);
    }
    if (isValid && currentSectionIndex === 3) {
      setIsSaved(true);
    }
    if (isValid && currentSectionIndex === 4) {
      setIsSaved(true);
    }
    if (isValid && currentSectionIndex === 6) {
      const formValues = {
        TipoAlerta: watch('TipoAlerta'),
        AlertaNovedad: watch('AlertaDatos.Novedad'),
        Vicepresidencia: watch('Vicepresidencia'),
        UnidadDeNegocio: watch('UnidadDeNegocio'),
        Activo: watch('Activo'),
        FechaHoraIncidente: watch('FechaHoraIncidente'),
        CategoriaPrincipal: watch('CategoriaPrincipal'),
        CategoriaSecundaria: watch('CategoriaSecundaria'),
      };

      try {
        await ValidateEmailApprove(
          alertData,
          statePermiso,
          context,
          formValues,
          updateAlerta,
        );
        await SPODataProvider.PushConexionGIS(alertData.Id);
        if (alertData.EsMOB) {
          await SPODataProvider.PushConexionMobile(alertData.Id);
        }
        navigate('/');
      } catch (error) {
        console.error('Error al procesar la validación y envío de la alerta:', error);
      }
    }
  };

  const isValidFiles = (): boolean => {
    let copyArray = [...stateFiles];
    let isValid = true;
    if (copyArray.length == 0 || copyArray.filter((file) => !file.deleted).length == 0)
      isValid = false;
    copyArray.forEach((file) => {
      if (!file.Descripcion) {
        file.errorDescripcion = true;
        isValid = false;
      }
    });
    setStateFiles(copyArray);
    if (!isValid) {
      setIsValidForm({
        ...isValidForm,
        isValidImages: false,
      });
    } else {
      setIsValidForm({
        ...isValidForm,
        isValidImages: true,
      });
    }
    return isValid;
  };

  const handleSave = async () => {
    setIsSaving(true);
    let hasError = false;

    const isValid = await trigger();

    if (currentSectionIndex >= 1) {
      const msgDescripcion = getValues('MensajesDescripcion');
      if (
        (!msgDescripcion || msgDescripcion.length === 0) &&
        !mobileStatus.Comment &&
        !GisStatus.Comment
      ) {
        setError('MensajesDescripcion', {
          type: 'manual',
          message: 'El campo es obligatorio',
        });
        hasError = true;
      }
    }
    if (currentSectionIndex >= 2) {
      const ImpactoPer = getValues('ImpactoPerdida');
      if (
        !ImpactoPer ||
        !Object.keys(ImpactoPer).some(
          (key) => ImpactoPer[key] && key !== 'Id' && key !== 'IDAlerta',
        )
      ) {
        setError('ImpactoPerdida', {
          type: 'manual',
          message: 'El campo es obligatorio',
        });
        hasError = true;
      }
    }

    const tipoAlerta = watch('TipoAlerta');

    if (
      permiso === Permisos.GERENTESREGIONALES &&
      currentSectionIndex === 6 &&
      tipoAlerta === AlertTypes.AlertaIncidente
    ) {
      const estadoGerente = getValues('EstadoGerente');
      if (!estadoGerente || estadoGerente.trim() === '') {
        setError('EstadoGerente', {
          type: 'manual',
          message: 'El campo es obligatorio',
        });
        hasError = true;
      }
    }

    if (hasError || !isValid) {
      setValue('states', {
        ...getValues('states'),
        disableAprobarGuardar: true,
      });
      setIsSaving(false);
      return;
    }

    if (
      (isValid && currentSectionIndex < 3) ||
      (isValid && currentSectionIndex >= 3 && isValidFiles())
    ) {
      const formData = getValues();
      const currentStates = getValues('states');

      if (mobileStatus.Comment) {
        const updateData: any = {
          Observaciones: mobileStatus.Comment,
          ObservacionModificada: mobileStatus.modifiedDate,
          ObservacionModificadaPorId: mobileStatus.modifiedBy,
        };
        await SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, updateData);
      }

      if (GisStatus.Comment) {
        const hora: string = new Date(GisStatus.modifiedDate).toLocaleTimeString(
          'es-AR',
          {
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          },
        );
        const updateData: any = {
          ObservacionGIS: GisStatus.Comment,
          FechaObservacionGIS: GisStatus.modifiedDate,
          HoraObservacionGIS: hora,
          ObservacionModificadaPorId: GisStatus.modifiedBy,
        };
        await SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, updateData);
      }

      setValue('states', {
        ...currentStates,
        TipoAlertaDisabled: true,
      });
      await UpdateImpactos(formData, setValue);
      await UpdateComentarios(formData, setValue);

      if (formData.AlertaDatos) {
        if (Array.isArray(formData.AlertaDatos.Antecedentes)) {
          if (formData.AlertaDatos.Antecedentes.length > 0) {
            const antecedentes =
              formatAntecedenteToSend(formData.AlertaDatos.Antecedentes) || [];
            formData.AlertaDatos.Antecedentes = antecedentes;
          } else {
            formData.AlertaDatos.Antecedentes = '';
          }
        }
      }
      if (currentSectionIndex >= 3) {
        const copyArray = [...stateFiles];

        const filesToDelete = copyArray.filter((file) => file.deleted && !file.added);
        const filesToAdd = copyArray.filter((file) => file.added && !file.deleted);
        const filesToUpdate = copyArray.filter(
          (file) => file.modified && !file.deleted && !file.added,
        );

        await UpdateImagen(alertData.Id, filesToAdd, filesToDelete, filesToUpdate);
        await getAlertFiles();
      }
      SubirInvolucrados(formData);
      SubirComplementos(formData);
      if (formData.HoraIncidente) {
        formData.Turno = getTurno(formData.HoraIncidente);
      }
      onSubmit(formData);
      await SPODataProvider.PushConexionGIS(alertData.Id);
      if (alertData.EsMOB) {
        await SPODataProvider.PushConexionMobile(alertData.Id);
      }
      setIsSavedAprobar(true);
      setIsSaved(true);
      setValue('states', {
        ...getValues('states'),
        disableAprobarGuardar: false,
      });
      console.log('Guardado con éxito');
    }
    setIsSaving(false);
  };

  const getAlertFiles = async () => {
    let filtro = `IDAlerta eq '${id}'`;
    const archivo = await SPODataProvider.getListItems(
      LIST_NAMES.FOTOSYVIDEOS,
      '*,File/Name,File/ServerRelativeUrl',
      filtro,
      'File',
    );

    const ListaArchivosINI: IAdjunto[] = [];
    archivo.forEach((data) => {
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
  };

  const handleBack = (): void => {
    updateAlerta(undefined);
    navigate('/');
  };

  const preExpandedSections = sections.map((section) =>
    section.title.replace(/\s+/g, '-').toLowerCase(),
  );

  const onSubmit = async (formData: any): Promise<void> => {
    const newData = mapperData(formData);
    try {
      await SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, newData);
      if (alertData.EsMOB) {
        setDatosBase({
          ...alertDatosBase,
          Vicepresidencia: newData.Vicepresidencia,
          UnidadDeNegocioId: Number(newData.UnidadDeNegocioId),
          ActivoId: Number(newData.ActivoId),
          TipoAlerta: newData.TipoAlerta,
          CategoriaPrincipalId: Number(newData.CategoriaPrincipalId),
          CategoriaSecundariaId: Number(newData.CategoriaSecundariaId),
          ReportadoPor: newData.ReportadoPor,
          HoraIncidente: newData.HoraIncidente,
          FechaHoraIncidente: moment(newData.FechaHoraIncidente).format('YYYY-MM-DD'),
        });
      }
    } catch (error) {
      console.error('Error al actualizar el ítem:', error);
    }
  };

  const SubirComplementos = async (formData: any): Promise<void> => {
    const Complementos: ItemComplementarios = formData.complementarios;
    if (!Complementos) return;
    const existingId = getValues('complementarios.Id');

    const itemToSave = {
      HuellasEncontradas: Complementos.HuellasEncontradas || [],
      OtrasHuellas: Complementos.OtrasHuellas || '',
      MedidasAdoptadas: Complementos.MedidasAdoptadas || '',
      ObservacionesAdicionales: Complementos.ObservacionesAdicionales || '',
      ElementosEncontrados: Complementos.ElementosEncontrados || '',
      IDAlerta: alertData.Id.toString(),
    };

    try {
      const complementoId = Complementos.Id || existingId;

      if (complementoId) {
        await SPODataProvider.update(
          LIST_NAMES.DATOSCOMPLEMENTARIOS,
          Number(complementoId),
          itemToSave,
        );
      } else {
        const newId = await SPODataProvider.add(
          LIST_NAMES.DATOSCOMPLEMENTARIOS,
          itemToSave,
        );
        setValue('complementarios.Id', newId.toString());
      }
    } catch (error) {
      console.error('Error al guardar complementarios:', error);
      throw error;
    }
  };

  const SubirInvolucrados = async (formData: any): Promise<ItemInvolucrados[]> => {
    let InvolucradosData: ItemInvolucrados[] = formData?.Involucrados || [];

    if (InvolucradosData?.length > 0) {
      for (const res of InvolucradosData) {
        let item: ItemInvolucrados = {
          Nombre: res.Nombre,
          Apellido: res.Apellido,
          TelefonoInvolucrado: res.TelefonoInvolucrado,
          DNIInvolucrado: res.DNIInvolucrado,
          RelacionConIncidente: res.RelacionConIncidente,
          RelacionConEmpresa: res.RelacionConEmpresa,
          NombreContratista: res.NombreContratista,
          ManejabaVehiculo: res.ManejabaVehiculo,
          MarcaVehiculo: res.MarcaVehiculo,
          ModeloVehiculo: res.ModeloVehiculo,
          ColorVehiculo: res.ColorVehiculo,
          PatenteVehiculo: res.PatenteVehiculo,
          IDAlerta: alertData.Id.toString(),
          Id: res.Id,
        };
        try {
          if (res.Estado === 1) {
            const ReturnId = await SPODataProvider.add(LIST_NAMES.INVOLUCRADOS, item);
            res.Id = ReturnId;
            res.Estado = 0;
          } else if (res.Estado === 2 && item.Id) {
            await SPODataProvider.update(LIST_NAMES.INVOLUCRADOS, item.Id, item);
            res.Estado = 0;
          }
        } catch (error) {
          console.error(`Error processing involucrado: ${error}`);
          throw error;
        }
      }
    }
    let eliminadosData: ItemInvolucrados[] = formData?.InvolucradosEliminar || [];
    if (eliminadosData?.length > 0) {
      for (const res of eliminadosData) {
        if (res.Estado === 3 && res.Id) {
          try {
            await SPODataProvider.delete(LIST_NAMES.INVOLUCRADOS, res.Id);
          } catch (error) {
            console.error(`Error deleting involucrado: ${error}`);
            throw error;
          }
        }
      }
    }
    const updatedInvolucrados = InvolucradosData.filter((inv) => inv.Estado !== 3);
    setInvolucradosData(updatedInvolucrados);
    setValue('Involucrados', updatedInvolucrados);

    setValue('InvolucradosEliminar', []);
    setInvolucradosEliminarData([]);
    return InvolucradosData;
  };

  const UpdateEstadoAsignado = async (
    newEstado: string,
    asignado: number,
    isDisabled: boolean,
  ) => {
    const currentUser = SPODataProvider.GetCurrentUser();
    currentUser.then((resUser) => {
      let resUserId = null;
      if (isDisabled) {
        resUserId = resUser.Id;
      }
      let data = {
        GerenteRegAsignadoId: undefined,
        COSasignadoId: resUserId,
        Estado: newEstado,
      };
      if (asignado === 2) {
        data = {
          GerenteRegAsignadoId: resUserId,
          COSasignadoId: undefined,
          Estado: newEstado,
        };
      }
      const Update = SPODataProvider.update(LIST_NAMES.ALERTAS, alertData.Id, data);
      Update.then((res) => {
        SPODataProvider.PushConexionGIS(alertData.Id);
        if (newEstado === Estados.Asignada) {
          setUserEdit(resUser.Title);
        }
        if (newEstado === Estados.Ingresada) {
          setUserEdit('');
        }
        if (newEstado === Estados.AsignadaAprobador) {
          setUserEdit(resUser.Title);
        }
        if (newEstado === Estados.DerivadaAprobador) {
          setUserEdit('');
        }
      });
    });
  };

  const getTurno = (horaIncidente: string) => {
    let turno = '';
    let [horaInt, minutoInt] = horaIncidente.split(':').map(Number);
    if (
      (horaInt === 20 && minutoInt >= 0) ||
      horaInt > 20 ||
      horaInt < 6 ||
      (horaInt === 5 && minutoInt <= 59)
    ) {
      turno = 'N';
    } else if (
      (horaInt === 6 && minutoInt >= 0) ||
      (horaInt > 6 && horaInt < 13) ||
      (horaInt === 12 && minutoInt <= 59)
    ) {
      turno = 'M';
    } else if (
      (horaInt === 13 && minutoInt >= 0) ||
      (horaInt > 13 && horaInt < 20) ||
      (horaInt === 19 && minutoInt <= 59)
    ) {
      turno = 'T';
    }
    return turno;
  };

  const sendEmailManager = async (codigoCorreo: string, alertData: IAlerta) => {
    await sendEmail(codigoCorreo, alertData, context);
  };

  const shouldShowGerenteRegionalControls =
    stateGerenteRegional &&
    alertData?.Estado !== Estados.Concretado &&
    alertData?.Estado !== Estados.Finalizado &&
    alertData?.Estado !== Estados.Frustrado &&
    alertData?.Estado !== Estados.FrustradoIntSSFF;

  const renderButtonGroup = () => (
    <Stack
      horizontal
      tokens={{ childrenGap: 10 }}
      horizontalAlign="space-between"
      className={styles.rowButtons}
    >
      <DefaultButton text="Salir" onClick={handleBack} />
      <PrimaryButton onClick={handleSave} disabled={isDisabled || isSaving}>
        {isSaving ? (
          <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
            <Spinner size={SpinnerSize.small} />
            <span>Guardando...</span>
          </Stack>
        ) : (
          'Guardar'
        )}
      </PrimaryButton>

      {stateEdicionCOS && (
        <BotonGuardar
          currentSectionIndex={currentSectionIndex}
          sections={sections}
          isSaved={isSaved}
          isDisabled={isDisabled}
          handleNext={handleNext}
          alertData={alertData}
          updateAlerta={updateAlerta}
        />
      )}
      {shouldShowGerenteRegionalControls && (
        <BotonGuardarGerente
          isSavedAprobar={isSavedAprobar}
          alertData={alertData}
          updateAlerta={updateAlerta}
          stateEstado={stateEstado}
          sendEmailManager={sendEmailManager}
        />
      )}
    </Stack>
  );

  return (
    <form id="FormularioAlerta">
      <Header
        alertData={alertData}
        context={context}
        puedeEditar={statePuedeEditar}
        UpdateEstado={UpdateEstadoAsignado}
        UserEdit={stateUserEdit}
      />
      {shouldShowGerenteRegionalControls &&
        alertData?.TipoAlerta === AlertTypes.AlertaIncidente && (
          <>
            <Separator />
            <EstadoGerenteRegional
              alertData={alertData}
              GerenteDropdownChange={GerenteDropdownChange}
            />
            {renderButtonGroup()}
          </>
        )}

      <div className={styles.groupAccordion}>
        {sections.slice(0, currentSectionIndex + 1).map((section, index) => (
          <AccordionSection
            key={index}
            title={section.title}
            preExpanded={preExpandedSections}
          >
            <section.component
              key={index}
              alertData={alertData}
              context={context}
              mobileStatus={mobileStatus}
              setMobileStatus={setMobileStatus}
              GisStatus={GisStatus}
              setGisStatus={setGisStatus}
              isValidForm={isValidForm}
              setIsSaved={setIsSaved}
              stateFiles={stateFiles}
              setStateFiles={setStateFiles}
              {...section.props}
            />
          </AccordionSection>
        ))}
        {currentSectionIndex === 6 && (
          <OpcionFinal
            alertData={alertData}
            stateGerenteRegional={stateGerenteRegional}
          />
        )}
      </div>

      {shouldShowGerenteRegionalControls &&
        (!alertData?.TipoAlerta ||
          alertData?.TipoAlerta !== AlertTypes.AlertaIncidente) && (
          <>
            <Separator />
            <EstadoGerenteRegional
              alertData={alertData}
              GerenteDropdownChange={GerenteDropdownChange}
            />
            {renderButtonGroup()}
          </>
        )}

      <Separator />
      <Stack enableScopedSelectors tokens={sectionStackTokens}>
        <Stack
          enableScopedSelectors
          horizontal
          disableShrink
          horizontalAlign="space-between"
        >
          <Stack
            enableScopedSelectors
            styles={{
              root: {
                marginTop: '10px',
                padding: '0 20px',
              },
            }}
          >
            {stateImprimir && (
              <TooltipHost content="Descargar Acta" id="tooltip-download-acta">
                <IconButton
                  onRenderIcon={() => (
                    <CertificateIcon style={{ fontSize: 24, color: '#FFFFFF' }} />
                  )}
                  styles={{
                    root: {
                      backgroundColor: '#0078D4',
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      border: 'none',
                    },
                    rootHovered: {
                      backgroundColor: '#005A9E',
                    },
                  }}
                  onClick={() => handleCreateWord(context, getValues())}
                  aria-describedby="tooltip-download-acta"
                />
              </TooltipHost>
            )}
          </Stack>

          {!shouldShowGerenteRegionalControls && renderButtonGroup()}
        </Stack>
      </Stack>
    </form>
  );
};
export { AltaAlerta };
