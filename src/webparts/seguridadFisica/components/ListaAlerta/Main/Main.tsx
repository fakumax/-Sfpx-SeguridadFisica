import * as React from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  Icon,
  SelectionMode,
  IDetailsHeaderProps,
  IRenderFunction,
  MessageBar,
  MessageBarType,
  Label,
  TextField,
  DatePicker,
  Dropdown,
  IDropdownOption,
  IconButton,
  IIconProps,
  IDatePickerStrings,
} from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import styles from './Main.module.scss';
import { IAlerta } from '../../../../../core/interfaces/IAlerta';
import { Link } from 'react-router-dom';
import { getStatusColor } from '../../../common/helpers';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertLetter,
  AlertTypes,
  EstadoAlerta,
  Estados,
  LIST_NAMES,
  Permisos,
} from '../../../../../core/utils/Constants';
import { FormPanel } from '../../../../../core';
import { IFiltro } from '../../../../../core/interfaces/IFiltro';
import {
  fetchEstadosOpciones,
  fetchTipoAlertaOpciones,
} from '../../../../../core/api/services/datosBaseService';
import SPODataProvider from '../../../../../core/pnp/sp/SharePointDataProvider';
import { IFiltrar } from '../../../../../core/interfaces/IFiltrar';

initializeIcons();

interface MainProps {
  selectedKey: string;
  listItemAlerta: IAlerta[];
  stateMessageBar: string;
  openFiltro: boolean;
  closeFiltro: () => void;
  filtrar: (filtro: IFiltrar) => void;
  region: string;
  rol: string;
}
function copyAndSort<T>(
  itemsToSort: T[],
  columnKey: string,
  isSortedDescending?: boolean,
): T[] {
  const key = columnKey as keyof T;
  return itemsToSort
    .slice(0)
    .sort((a: T, b: T) =>
      (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1,
    );
}
interface Iactivos {
  RegionId: string;
  VPId: string;
  VP: string;
  UNId: string;
  UN: string;
  activoId: string;
  activo: string;
  id: string;
  titulo: string;
}
interface Icatagoria {
  tipoAlerta: string;
  principalId: string;
  principal: string;
  id: string;
  titulo: string;
}
interface Ibloqueos {
  unidad: boolean;
  activo: boolean;
  principal: boolean;
  secundaria: boolean;
}
const DayPickerStrings: IDatePickerStrings = {
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  shortMonths: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  days: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
  shortDays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  goToToday: 'ir a Hoy',
  prevMonthAriaLabel: 'ir a Mes previo',
  nextMonthAriaLabel: 'ir a Mes próximo',
  prevYearAriaLabel: 'ir a Año previo',
  nextYearAriaLabel: 'ir a Año próximo',
};
const Main: React.FC<MainProps> = ({
  selectedKey,
  listItemAlerta,
  stateMessageBar,
  openFiltro,
  closeFiltro,
  filtrar,
  region,
  rol,
}) => {
  const containerStyles: React.CSSProperties = { backgroundColor: '#c0c0c030' };
  const [items, setItems] = React.useState(listItemAlerta);
  const [isSortedDescending, setIsSortedDescending] = React.useState(true);
  const [sortingColumn, setSortingColumn] = React.useState<string>('ID');
  const [sortDescending, setSortDescending] = React.useState<boolean>(false);
  const [estados, setEstados] = React.useState<IDropdownOption[]>([]);
  const [tipoAlerta, setTipoAlerta] = React.useState<IDropdownOption[]>([]);
  const [categoriaPrincipalDll, setcategoriaPrincipalDll] = React.useState<
    IDropdownOption[]
  >([]);
  const [aplicoFiltro, setAplicoFiltro] = React.useState(false);
  const [categoriaSecundariaDll, setcategoriaSecundariaDll] = React.useState<
    IDropdownOption[]
  >([]);
  const [regiones, setRegiones] = React.useState<IDropdownOption[]>([]);
  const [activos, setActivos] = React.useState<Iactivos[]>([]);
  const [categorias, setCategoria] = React.useState<Icatagoria[]>([]);
  const [vicepresidencias, setVicepresidencias] = React.useState<IDropdownOption[]>([]);
  const [unidad, setUnidad] = React.useState<IDropdownOption[]>([]);
  const [activoddl, setActivoddl] = React.useState<IDropdownOption[]>([]);
  const [fechaLimite, setFechaLimite] = React.useState<Date>();
  const [fechaLimiteDesde, setfechaLimiteDesde] = React.useState<Date>();
  const [bloqueos, setBloqueos] = React.useState<Ibloqueos>({
    unidad: true,
    activo: true,
    principal: true,
    secundaria: true,
  });

  const navigate = useNavigate();
  const [stateFiltro, setFiltro] = React.useState<IFiltro>({
    pendientes: undefined,
    tratamiento: undefined,
    numero: undefined,
    fechaDesde: undefined,
    fechaHasta: undefined,
    estado: undefined,
    regionId: undefined,
    region: undefined,
    vicepresidenciaId: undefined,
    vicepresidencia: undefined,
    unidadId: undefined,
    unidad: undefined,
    instalacion: undefined,
  });

  React.useEffect(() => {
    let fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate());
    setFechaLimite(fechaLimite);
    setfechaLimiteDesde(fechaLimite);
    const getEstados = async () => {
      const choices = await fetchEstadosOpciones();
      const estados = [];
      choices.forEach((res) => {
        if (
          res.text === Estados.Eliminado ||
          res.text === Estados.EliminadaCOS ||
          res.text === Estados.DevueltaVigilador ||
          res.text === Estados.FrustradoIntSSFF ||
          res.text === Estados.Frustrado ||
          res.text === Estados.Finalizado ||
          res.text === Estados.Concretado
        ) {
          // Estados finales - no agregar a opciones
        } else {
          switch (rol) {
            case Permisos.COS:
              if (
                res.text === Estados.Ingresada ||
                res.text === Estados.DevueltaCOS ||
                res.text === Estados.Asignada ||
                res.text === Estados.DerivadaAprobador
              ) {
                estados.push(res);
              }
              break;
            case Permisos.GERENTESREGIONALES:
              if (
                res.text === Estados.Bloqueoproceso ||
                res.text === Estados.AsignadaAprobador ||
                res.text === Estados.Eninvestigacion ||
                res.text === Estados.DerivadaAprobador
              ) {
                estados.push(res);
              }
              break;
          }
        }
      });
      setEstados(estados);
    };
    const getRegion = async () => {
      const regiones = await SPODataProvider.getListItems<any>(
        LIST_NAMES.REGIONES,
        '',
        '',
        '',
      );
      const itemRegiones: IDropdownOption[] = [];
      let titulo: string = '';
      let tituloFiltro: string = '';
      let idRegion: string = '';
      regiones.forEach((res) => {
        titulo = res['Title'];
        if (titulo.toUpperCase() === region.toUpperCase()) {
          idRegion = res['ID'];
          tituloFiltro = titulo;
          itemRegiones.push({
            key: res['ID'],
            text: titulo,
          });
        }
      });
      setFiltro({
        ...stateFiltro,
        regionId: idRegion,
        region: tituloFiltro,
      });
      setRegiones(itemRegiones);
      const regionId = idRegion;
      const activos = await SPODataProvider.getListItems<any>(
        LIST_NAMES.ACTIVOS,
        '*,Region/Title,Region/Id,VP/Title,VP/Id,UN/Title,UN/Id',
        '',
        'Region,VP,UN',
      );
      const itemActivos = activos.map((item) => ({
        RegionId: item.Region.Id,
        VPId: item.VP.Id,
        VP: item.VP.Title,
        UNId: item.UN.Id,
        UN: item.UN.Title,
        activoId: item.UN.Id,
        activo: item.UN.Title,
        id: item.Id,
        titulo: item.Title,
      }));
      setActivos(itemActivos);
      const vicepresidencia = itemActivos
        .filter((activo) => activo.RegionId === regionId)
        .map((item) => ({
          key: item.VPId,
          text: item.VP,
        }));
      const uniqueUnits = new Map(vicepresidencia.map((item) => [item.key, item]));
      const uniqueUnitArray = Array.from(uniqueUnits.values());
      setVicepresidencias(uniqueUnitArray);
    };
    const getVicepresidencia = async () => {
      const activos = await SPODataProvider.getListItems<any>(
        LIST_NAMES.ACTIVOS,
        '*,Region/Title,Region/Id,VP/Title,VP/Id,UN/Title,UN/Id',
        '',
        'Region,VP,UN',
      );
      const itemActivos = activos.map((item) => ({
        RegionId: item.Region.Id,
        VPId: item.VP.Id,
        VP: item.VP.Title,
        UNId: item.UN.Id,
        UN: item.UN.Title,
        activoId: item.UN.Id,
        activo: item.UN.Title,
        id: item.Id,
        titulo: item.Title,
      }));
      setActivos(itemActivos);
    };
    const getTipoAlerta = async () => {
      const choices = await fetchTipoAlertaOpciones();
      choices.push({ key: 0, text: AlertTypes.SinTipo });
      setTipoAlerta(choices);
    };
    const getCategoriaSecundaria = async () => {
      const categorias = await SPODataProvider.getListItems<any>(
        LIST_NAMES.CATEGORIAS_SECUNDARIAS,
        '*,CategoriaPrincipal/Title,CategoriaPrincipal/Id',
        '',
        'CategoriaPrincipal',
      );
      const itemActivos = categorias.map((item) => ({
        tipoAlerta: item.TipoAlerta,
        principalId: item.CategoriaPrincipal.Id,
        principal: item.CategoriaPrincipal.Title,
        id: item.Id,
        titulo: item.Title,
      }));
      setCategoria(itemActivos);
    };
    getEstados();
    getRegion();
    getVicepresidencia();
    getTipoAlerta();
    getCategoriaSecundaria();
  }, []);

  React.useEffect(() => {
    setItems(listItemAlerta);
  }, [listItemAlerta]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onColumnClick = (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const newItems = [...items];
    const newIsSortedDescending = !isSortedDescending;

    newItems.sort((a, b) => {
      if (newIsSortedDescending) {
        return a.CategoriaPrincipal.Title > b.CategoriaPrincipal.Title ? -1 : 1;
      } else {
        return a.CategoriaPrincipal.Title > b.CategoriaPrincipal.Title ? 1 : -1;
      }
    });

    setItems(newItems);
    setIsSortedDescending(newIsSortedDescending);
  };

  const getTipoCellStyle = (tipo: string) => {
    switch (tipo) {
      case AlertLetter.Incidente:
        return styles.tipoCellIncidente;
      case AlertLetter.Control:
        return styles.tipoCellControl;
      case AlertLetter.Prevencion:
        return styles.tipoCellPrevencion;
      case AlertLetter.SinTipo:
        return styles.tipoCellSinTipo;
      default:
        return '';
    }
  };

  const mapTipoAlertaToShort = (tipoAlerta: string): string => {
    switch (tipoAlerta) {
      case AlertTypes.AlertaControl:
        return AlertLetter.Control;
      case AlertTypes.AlertaIncidente:
        return AlertLetter.Incidente;
      case AlertTypes.AlertaPrevencion:
        return AlertLetter.Prevencion;
      default:
        return AlertLetter.SinTipo;
    }
  };
  const columns: IColumn[] = [
    {
      key: 'column0',
      name: 'ID',
      fieldName: 'ID',
      minWidth: 40,
      maxWidth: 40,
      isResizable: true,
      isSorted: true,
      isSortedDescending,
      onColumnClick,
      onRender: (item) => <Link to={`/alerta/${item.Id}`}>{item.ID}</Link>,
    },
    {
      key: 'column1',
      name: 'T',
      fieldName: 'tipo',
      minWidth: 30,
      maxWidth: 30,
      isSorted: false,
      onRender: (item) => (
        <div
          className={`${styles.centeredCell} ${styles.tipoCell} ${getTipoCellStyle(
            mapTipoAlertaToShort(item.TipoAlerta),
          )}`}
        >
          <span>{mapTipoAlertaToShort(item.TipoAlerta)}</span>
        </div>
      ),
    },
    {
      key: 'column2',
      name: 'Categoría principal',
      fieldName: 'CategoriaPrincipal.Title',
      minWidth: 90,
      maxWidth: 190,
      isResizable: true,
      isSorted: false,
      isSortedDescending,
      onColumnClick,
      onRender: (item) => <span>{item.CategoriaPrincipal?.Title}</span>,
    },
    {
      key: 'column3',
      name: 'Categoría secundaria',
      fieldName: 'CategoriaSecundaria.Title',
      minWidth: 80,
      maxWidth: 180,
      isSorted: false,
      isResizable: true,
      onRender: (item) => <span>{item.CategoriaSecundaria?.Title}</span>,
    },
    {
      key: 'column4',
      name: 'Región',
      fieldName: 'Region',
      minWidth: 50,
      maxWidth: 100,
      isResizable: true,
      isSorted: false,
    },
    {
      key: 'column5',
      name: 'Instalación / Otros',
      fieldName: 'Instalacion',
      minWidth: 80,
      maxWidth: 170,
      isResizable: true,
      isSorted: false,
    },
    {
      key: 'column6',
      name: 'Fecha',
      minWidth: 70,
      isResizable: true,
      isSorted: false,
      onRender: (item) => <span>{formatDate(item.FechaHoraIncidente)}</span>,
    },
    {
      key: 'column7',
      name: '',
      fieldName: 'Turno',
      isSorted: false,
      minWidth: 20,
      onRender: (item) => (
        <div className={styles.centeredCell}>
          <span>{item.Turno}</span>
        </div>
      ),
      onRenderHeader: () => <Icon iconName="Calendar" />,
    },
    {
      key: 'column8',
      name: 'Estado',
      fieldName: 'Estado',
      minWidth: 100,
      maxWidth: 160,
      isResizable: true,
      isSorted: false,
      onRender: (item) => {
        return (
          <div
            className={styles.status}
            style={{ backgroundColor: getStatusColor(item?.Estado || '') }}
          >
            {item?.Estado}
          </div>
        );
      },
    },
  ];
  const onFormatDate = (date?: Date): string => {
    return date !== undefined
      ? date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
      : '';
  };
  const onItemInvoked = (item: IAlerta): void => {
    let ruta = `/alerta/${item.Id}`;
    navigate(ruta);
  };
  const ErrorBadgeIcon: IIconProps = { iconName: 'ErrorBadge' };
  const BlockedIcon: IIconProps = { iconName: 'Blocked' };
  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    props,
    defaultRender,
  ) => {
    if (!props) {
      return null;
    }

    const customRender = (props: IDetailsHeaderProps) => {
      return defaultRender({
        ...props,
        columns: props.columns,
      });
    };

    return customRender(props);
  };
  const handleColumnClick = (
    ev: React.MouseEvent<HTMLElement>,
    column: IColumn,
  ): void => {
    setSortingColumn(column.fieldName!);
    setSortDescending(!column.isSortedDescending);
  };
  const handleFechaDesde = (selDate: Date | null | undefined): void => {
    setFiltro({
      ...stateFiltro,
      fechaDesde: selDate,
    });
  };
  const handleFechaHasta = (selDate: Date | null | undefined): void => {
    setFiltro({
      ...stateFiltro,
      fechaHasta: selDate,
    });
    setfechaLimiteDesde(selDate);
  };
  const onFiltrar = () => {
    const numero =
      stateFiltro.numero === undefined || stateFiltro.numero === ''
        ? undefined
        : stateFiltro.numero;
    const fechaDesde = stateFiltro.fechaDesde;
    const fechaHasta = stateFiltro.fechaHasta;
    const estado =
      stateFiltro.estado === undefined || stateFiltro.estado == null
        ? undefined
        : stateFiltro.estado;
    const region = stateFiltro.region;
    const vicepresidencia = stateFiltro.vicepresidencia;
    const unidadDeNegocio =
      stateFiltro.unidadId === undefined || stateFiltro.unidadId == null
        ? undefined
        : Number(stateFiltro.unidadId);
    const activo =
      stateFiltro.activoId === undefined || stateFiltro.activoId === null
        ? undefined
        : Number(stateFiltro.activoId);

    const tipo = stateFiltro.tipoAlerta;
    const CategoriaPrincipal =
      stateFiltro.categoriaPrincipalId === undefined ||
      stateFiltro.categoriaPrincipalId === null
        ? undefined
        : Number(stateFiltro.categoriaPrincipalId);

    const CategoriaSecundaria =
      stateFiltro.CategoriaSecundariaId === undefined ||
      stateFiltro.CategoriaSecundariaId === null
        ? undefined
        : Number(stateFiltro.CategoriaSecundariaId);

    const instalacion =
      stateFiltro.instalacion === undefined || stateFiltro.instalacion === ''
        ? undefined
        : stateFiltro.instalacion;
    let query: IFiltrar = {
      numero: numero,
      FechaHoraIncidenteDesde: fechaDesde,
      FechaHoraIncidenteHasta: fechaHasta,
      Estado: estado,
      Region: region,
      Vicepresidencia: vicepresidencia,
      UnidadDeNegocio: unidadDeNegocio,
      UnidadDeNegocioTxt: stateFiltro.unidad,
      Activo: activo,
      ActivoTxt: stateFiltro.activo,
      TipoAlerta: tipo,
      CategoriaPrincipal: CategoriaPrincipal,
      CategoriaPrincipalTxt: stateFiltro.categoriaPrincipal,
      CategoriaSecundaria: CategoriaSecundaria,
      CategoriaSecundariaTxt: stateFiltro.CategoriaSecundaria,
      instalacion: instalacion,
    };
    setAplicoFiltro(true);
    filtrar(query);
  };
  return (
    <div className={styles.main}>
      {stateMessageBar !== undefined && (
        <MessageBar messageBarType={MessageBarType.success}>{stateMessageBar}</MessageBar>
      )}
      <DetailsList
        items={copyAndSort<any>(items, sortingColumn, sortDescending)}
        columns={columns.map((column) =>
          column.fieldName === sortingColumn
            ? {
                ...column,
                isSorted: true,
                isSortedDescending: sortDescending,
                onColumnClick: handleColumnClick,
              }
            : { ...column, isSorted: false },
        )}
        setKey="set"
        layoutMode={DetailsListLayoutMode.fixedColumns}
        selectionPreservedOnEmptyClick={true}
        selectionMode={SelectionMode.none}
        onRenderDetailsHeader={onRenderDetailsHeader}
        ariaLabelForSelectionColumn="Toggle selection"
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        onItemInvoked={onItemInvoked}
      />
      {items.length === 0 && aplicoFiltro && (
        <div style={containerStyles}>
          <div className={styles.sinResultadosFlex}>
            <div className={styles.sinResultadosIzq}>
              <img
                alt=""
                src={require('../../../assets/No-hubo-resultado-de-filtros.svg')}
              />
            </div>
            <div className={styles.sinResultadosDer}>
              <div>
                <span className={styles.sinResultadosText1}>
                  No encontramos resultados
                </span>
              </div>
              <div>
                <span className={styles.sinResultadosText2}>
                  Quitá filtros o intentá con otro término de búsqueda
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <FormPanel
        title={'Filtrar listado'}
        isOpen={openFiltro}
        onSave={onFiltrar}
        onCancel={closeFiltro}
        saveLabel="Filtrar"
        cancelLabel="Salir"
      >
        <div>
          <div>
            <Label>Nro. de incidente</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <TextField
                  value={stateFiltro.numero}
                  placeholder="Escribí un número de incidente"
                  onChange={(
                    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                    newValue?: string,
                  ) => {
                    setFiltro({
                      ...stateFiltro,
                      numero: newValue,
                    });
                  }}
                />
              </div>
              <div>
                <IconButton
                  iconProps={ErrorBadgeIcon}
                  aria-label="ErrorBadge"
                  onClick={() => {
                    setFiltro({
                      ...stateFiltro,
                      numero: undefined,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.centeredCell}>
            <div className={styles.flexInput}>
              <Label>Fecha desde</Label>
              <div className={styles.centeredCell}>
                <div className={styles.flexInput}>
                  <DatePicker
                    onSelectDate={handleFechaDesde}
                    placeholder="Seleccioná una fecha Desde"
                    value={stateFiltro.fechaDesde}
                    maxDate={fechaLimiteDesde}
                    strings={DayPickerStrings}
                    formatDate={onFormatDate}
                  />
                </div>
                <div>
                  <IconButton
                    iconProps={ErrorBadgeIcon}
                    aria-label="ErrorBadge"
                    onClick={() => {
                      setFiltro({
                        ...stateFiltro,
                        fechaDesde: undefined,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.flexInput}>
              <Label>Fecha hasta</Label>
              <div className={styles.centeredCell}>
                <div className={styles.flexInput}>
                  <DatePicker
                    onSelectDate={handleFechaHasta}
                    minDate={stateFiltro.fechaDesde}
                    maxDate={fechaLimite}
                    placeholder="Seleccioná una fecha Hasta"
                    value={stateFiltro.fechaHasta}
                    strings={DayPickerStrings}
                    formatDate={onFormatDate}
                  />
                </div>
                <div>
                  <IconButton
                    iconProps={ErrorBadgeIcon}
                    aria-label="ErrorBadge"
                    onClick={() => {
                      setFiltro({
                        ...stateFiltro,
                        fechaHasta: undefined,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label>Estado del incidente</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <Dropdown
                  options={estados}
                  selectedKey={stateFiltro.estado}
                  placeholder="Seleccioná un estado"
                  onChange={(
                    event: React.FormEvent<HTMLDivElement>,
                    item: IDropdownOption,
                  ): void => {
                    const estado = item.text;
                    setFiltro({
                      ...stateFiltro,
                      estado: estado,
                    });
                  }}
                />
              </div>
              <div>
                <IconButton
                  iconProps={ErrorBadgeIcon}
                  aria-label="ErrorBadge"
                  onClick={() => {
                    setFiltro({
                      ...stateFiltro,
                      estado: null,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Región</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <div className={styles.centeredCell}>
                  <div className={styles.flexInput}>
                    <Dropdown
                      options={regiones}
                      defaultSelectedKey={stateFiltro.regionId}
                      selectedKey={stateFiltro.regionId}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <IconButton iconProps={BlockedIcon} aria-label="Blocked" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label>Vicepresidencia</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <Dropdown
                  options={vicepresidencias}
                  selectedKey={stateFiltro.vicepresidenciaId}
                  placeholder="Seleccioná una vicepresidencia"
                  onChange={(
                    event: React.FormEvent<HTMLDivElement>,
                    item: IDropdownOption,
                  ): void => {
                    const vicepresidenciaId = item.key;
                    const unidadNegocio = activos
                      .filter(
                        (activo) =>
                          activo.VPId === vicepresidenciaId &&
                          activo.RegionId === stateFiltro.regionId,
                      )
                      .map((item) => ({
                        key: item.UNId,
                        text: item.UN,
                      }));
                    const uniqueUnits = new Map(
                      unidadNegocio.map((item) => [item.key, item]),
                    );
                    const uniqueUnitArray = Array.from(uniqueUnits.values());
                    setUnidad(uniqueUnitArray);
                    setFiltro({
                      ...stateFiltro,
                      vicepresidenciaId: item.key,
                      vicepresidencia: item.text,
                      unidadId: undefined,
                      unidad: undefined,
                      activoId: undefined,
                      activo: undefined,
                    });
                    setBloqueos({
                      ...bloqueos,
                      unidad: false,
                    });
                  }}
                />
              </div>
              <div>
                <IconButton
                  iconProps={ErrorBadgeIcon}
                  aria-label="ErrorBadge"
                  onClick={() => {
                    setFiltro({
                      ...stateFiltro,
                      vicepresidenciaId: null,
                      vicepresidencia: undefined,
                      unidadId: undefined,
                      unidad: undefined,
                      activoId: undefined,
                      activo: undefined,
                      instalacion: undefined,
                    });
                    setUnidad([]);
                    setActivoddl([]);
                    setBloqueos({
                      ...bloqueos,
                      unidad: true,
                      activo: true,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Unidad de negocio</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <Dropdown
                  options={unidad}
                  selectedKey={stateFiltro.unidadId}
                  placeholder="Seleccioná una unidad de negocio"
                  disabled={bloqueos.unidad}
                  onChange={(
                    event: React.FormEvent<HTMLDivElement>,
                    item: IDropdownOption,
                  ): void => {
                    const unidadId = item.key;
                    const activosTitle = activos
                      .filter(
                        (activo) =>
                          activo.UNId === unidadId &&
                          activo.VPId === stateFiltro.vicepresidenciaId &&
                          activo.RegionId === stateFiltro.regionId,
                      )
                      .map((item) => ({
                        key: item.id,
                        text: item.titulo,
                      }));
                    const uniqueUnits = new Map(
                      activosTitle.map((item) => [item.key, item]),
                    );
                    const uniqueUnitArray = Array.from(uniqueUnits.values());
                    setActivoddl(uniqueUnitArray);
                    setBloqueos({
                      ...bloqueos,
                      activo: false,
                    });
                    setFiltro({
                      ...stateFiltro,
                      unidadId: item.key,
                      unidad: item.text,
                      activoId: undefined,
                      activo: undefined,
                    });
                  }}
                />
              </div>
              <div>
                <IconButton
                  iconProps={ErrorBadgeIcon}
                  aria-label="ErrorBadge"
                  onClick={() => {
                    setFiltro({
                      ...stateFiltro,
                      unidadId: null,
                      unidad: undefined,
                      activoId: undefined,
                      activo: undefined,
                      instalacion: undefined,
                    });
                    setActivoddl([]);
                    setBloqueos({
                      ...bloqueos,
                      activo: true,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Activo</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <Dropdown
                  options={activoddl}
                  selectedKey={stateFiltro.activoId}
                  placeholder="Seleccioná un activo"
                  disabled={bloqueos.activo}
                  onChange={(
                    event: React.FormEvent<HTMLDivElement>,
                    item: IDropdownOption,
                  ): void => {
                    const estado = item.text;
                    setFiltro({
                      ...stateFiltro,
                      activoId: item.key,
                      activo: item.text,
                    });
                    setBloqueos({
                      ...bloqueos,
                    });
                  }}
                />
              </div>
              <div>
                <IconButton
                  iconProps={ErrorBadgeIcon}
                  aria-label="ErrorBadge"
                  onClick={() => {
                    setFiltro({
                      ...stateFiltro,
                      activoId: null,
                      instalacion: undefined,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Instalación</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <TextField
                  value={stateFiltro.instalacion}
                  placeholder="Seleccioná una instalación"
                  onChange={(
                    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                    newValue?: string,
                  ) => {
                    setFiltro({
                      ...stateFiltro,
                      instalacion: newValue,
                    });
                  }}
                />
              </div>
              <div>
                <IconButton
                  iconProps={ErrorBadgeIcon}
                  aria-label="ErrorBadge"
                  onClick={() => {
                    setFiltro({
                      ...stateFiltro,
                      instalacion: undefined,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Tipo de alerta</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <Dropdown
                  options={tipoAlerta}
                  selectedKey={stateFiltro.tipoAlertaId}
                  placeholder="Seleccioná el tipo de alerta"
                  onChange={(
                    event: React.FormEvent<HTMLDivElement>,
                    item: IDropdownOption,
                  ): void => {
                    const tipoAlerta = item.key;
                    const activosTitle = categorias
                      .filter((activo) => activo.tipoAlerta === tipoAlerta)
                      .map((item) => ({
                        key: item.principalId,
                        text: item.principal,
                      }));
                    const uniqueUnits = new Map(
                      activosTitle.map((item) => [item.key, item]),
                    );
                    const uniqueUnitArray = Array.from(uniqueUnits.values());
                    setcategoriaPrincipalDll(uniqueUnitArray);
                    if (item.text !== 'Sin Tipo') {
                      setBloqueos({
                        ...bloqueos,
                        principal: false,
                      });
                      setFiltro({
                        ...stateFiltro,
                        tipoAlertaId: item.key,
                        tipoAlerta: item.text,
                      });
                    } else {
                      setBloqueos({
                        ...bloqueos,
                        principal: true,
                        secundaria: true,
                      });
                      setFiltro({
                        ...stateFiltro,
                        tipoAlertaId: item.key,
                        tipoAlerta: item.text,
                        categoriaPrincipalId: undefined,
                        categoriaPrincipal: undefined,
                        CategoriaSecundariaId: undefined,
                        CategoriaSecundaria: undefined,
                      });
                    }
                  }}
                />
              </div>
              <div>
                <IconButton
                  iconProps={ErrorBadgeIcon}
                  aria-label="ErrorBadge"
                  onClick={() => {
                    setFiltro({
                      ...stateFiltro,
                      tipoAlertaId: null,
                      tipoAlerta: undefined,
                      categoriaPrincipalId: undefined,
                      categoriaPrincipal: undefined,
                      CategoriaSecundariaId: undefined,
                      CategoriaSecundaria: undefined,
                    });
                    setcategoriaPrincipalDll([]);
                    setcategoriaSecundariaDll([]);
                    setBloqueos({
                      ...bloqueos,
                      secundaria: true,
                      principal: true,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Categoría principal</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <Dropdown
                  options={categoriaPrincipalDll}
                  selectedKey={stateFiltro.categoriaPrincipalId}
                  placeholder="Seleccioná la categoría principal"
                  disabled={bloqueos.principal}
                  onChange={(
                    event: React.FormEvent<HTMLDivElement>,
                    item: IDropdownOption,
                  ): void => {
                    const principal = item.text;
                    const activosTitle = categorias
                      .filter(
                        (activo) =>
                          activo.tipoAlerta === stateFiltro.tipoAlerta &&
                          activo.principal === principal,
                      )
                      .map((item) => ({
                        key: item.id,
                        text: item.titulo,
                      }));
                    const uniqueUnits = new Map(
                      activosTitle.map((item) => [item.key, item]),
                    );
                    const uniqueUnitArray = Array.from(uniqueUnits.values());
                    setcategoriaSecundariaDll(uniqueUnitArray);
                    setFiltro({
                      ...stateFiltro,
                      categoriaPrincipalId: item.key,
                      categoriaPrincipal: item.text,
                    });
                    setBloqueos({
                      ...bloqueos,
                      secundaria: false,
                    });
                  }}
                />
              </div>
              <div>
                <IconButton
                  iconProps={ErrorBadgeIcon}
                  aria-label="ErrorBadge"
                  onClick={() => {
                    setFiltro({
                      ...stateFiltro,
                      categoriaPrincipalId: null,
                      categoriaPrincipal: undefined,
                      CategoriaSecundariaId: undefined,
                      CategoriaSecundaria: undefined,
                    });
                    setcategoriaSecundariaDll([]);
                    setBloqueos({
                      ...bloqueos,
                      secundaria: true,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Categoría secundaria</Label>
            <div className={styles.centeredCell}>
              <div className={styles.flexInput}>
                <Dropdown
                  options={categoriaSecundariaDll}
                  placeholder="Seleccioná la categoría secundaria"
                  disabled={bloqueos.secundaria}
                  selectedKey={stateFiltro.CategoriaSecundariaId}
                  onChange={(
                    event: React.FormEvent<HTMLDivElement>,
                    item: IDropdownOption,
                  ): void => {
                    setFiltro({
                      ...stateFiltro,
                      CategoriaSecundariaId: item.key,
                      CategoriaSecundaria: item.text,
                    });
                  }}
                />
              </div>
              <div>
                <IconButton
                  iconProps={ErrorBadgeIcon}
                  aria-label="ErrorBadge"
                  onClick={() => {
                    setFiltro({
                      ...stateFiltro,
                      CategoriaSecundariaId: null,
                      CategoriaSecundaria: undefined,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </FormPanel>
    </div>
  );
};
export default Main;
