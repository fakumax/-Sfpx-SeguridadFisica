import * as React from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  Icon,
  Selection,
  SelectionMode,
  IDetailsHeaderProps,
  IRenderFunction,
  CheckboxVisibility,
  SearchBox,
  DefaultButton,
  Stack,
} from '@fluentui/react';
import styles from './ListaModal.module.scss';
import { IAlerta } from '../../../../../../core/interfaces/IAlerta';
import { getStatusColor } from '../../../../common/helpers';
import {
  AlertLetter,
  AlertTypes,
  Ordenamiento,
} from '../../../../../../core/utils/Constants';
import {
  buscar,
  definirIndicesResultadoPorPalabraEncontrada,
} from '../../../../../../core/utils/Buscador';

import { IComentario } from '../../../../../../core/interfaces/IComentario';
import { IDatoComplementario } from '../../../../../../core/interfaces/IDatoComplementario';
import { IInvolucrado } from '../../../../../../core/interfaces/IInvolucrado';
import { IImpacto } from '../../../../../../core/interfaces/IImpacto';
import { ConIDAlerta, AlertaReducida } from '../../../../../../core/utils/Utils';

interface ListaModalProps {
  selection: Selection;
  items: IAlerta[];
  defaultItems: any[];
  comentariosDeAlertasPrefiltradas: IComentario[];
  datosComplementariosDeAlertasPrefiltradas: IDatoComplementario[];
  involucradosDeAlertasPrefiltradas: IInvolucrado[];
  impactosDeAlertasPrefiltradas: IImpacto[];
}

const ListaModal: React.FC<ListaModalProps> = ({
  selection,
  items,
  defaultItems,
  comentariosDeAlertasPrefiltradas,
  datosComplementariosDeAlertasPrefiltradas,
  involucradosDeAlertasPrefiltradas,
  impactosDeAlertasPrefiltradas,
}) => {
  const [currentItems, setCurrentItems] = React.useState<IAlerta[]>(items);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortField, setSortField] = React.useState<
    | 'Id'
    | 'tipo'
    | 'CategoriaPrincipal'
    | 'CategoriaSecundaria'
    | 'Instalacion'
    | 'FechaHoraIncidente'
    | 'Estado'
    | 'Turno'
  >('Id');
  const [sortAsc, setSortAsc] = React.useState(true);

  const handleColumnClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn) => {
    if (!column || !column.fieldName) return;
    const field = column.fieldName as typeof sortField;
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedItems = React.useMemo(() => {
    return [...currentItems].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === Ordenamiento.CategoriaPrincipal) {
        aValue = a.CategoriaPrincipal?.Title || '';
        bValue = b.CategoriaPrincipal?.Title || '';
      }
      if (sortField === Ordenamiento.CategoriaSecundaria) {
        aValue = a.CategoriaSecundaria?.Title || '';
        bValue = b.CategoriaSecundaria?.Title || '';
      }
      if (sortField === Ordenamiento.FechaHoraIncidente) {
        aValue = a.FechaHoraIncidente || '';
        bValue = b.FechaHoraIncidente || '';
      }
      if (sortField === Ordenamiento.Estado) {
        aValue = typeof a.Estado === 'string' ? a.Estado : '';
        bValue = typeof b.Estado === 'string' ? b.Estado : '';
      }

      if (sortField === Ordenamiento.Tipo) {
        aValue = a.TipoAlerta || '';
        bValue = b.TipoAlerta || '';
      }
      if (sortField === Ordenamiento.Turno) {
        aValue = a.Turno || '';
        bValue = b.Turno || '';
      }

      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';

      if (aValue < bValue) return sortAsc ? -1 : 1;
      if (aValue > bValue) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [currentItems, sortField, sortAsc]);

  React.useEffect(() => {
    if (defaultItems && defaultItems.length > 0) {
      defaultItems.forEach((item) => {
        selection.setKeySelected(item.Id, true, false);
      });
    }
  }, [defaultItems]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
      fieldName: 'Id',
      minWidth: 50,
      maxWidth: 50,
      isResizable: true,
      isSorted: sortField === 'Id',
      isSortedDescending: sortField === 'Id' ? !sortAsc : false,
      onColumnClick: handleColumnClick,
      onRender: (item) => <span>{item.Id}</span>,
    },
    {
      key: 'column1',
      name: 'T',
      fieldName: 'tipo',
      minWidth: 30,
      maxWidth: 30,
      isSorted: sortField === 'tipo',
      isSortedDescending: sortField === 'tipo' ? !sortAsc : false,
      onColumnClick: handleColumnClick,
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
      fieldName: 'CategoriaPrincipal',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      isSorted: sortField === 'CategoriaPrincipal',
      isSortedDescending: sortField === 'CategoriaPrincipal' ? !sortAsc : false,
      onColumnClick: handleColumnClick,
      onRender: (item) => <span>{item.CategoriaPrincipal?.Title}</span>,
    },
    {
      key: 'column3',
      name: 'Categoría secundaria',
      fieldName: 'CategoriaSecundaria',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      isSorted: sortField === 'CategoriaSecundaria',
      isSortedDescending: sortField === 'CategoriaSecundaria' ? !sortAsc : false,
      onColumnClick: handleColumnClick,
      onRender: (item) => <span>{item.CategoriaSecundaria?.Title}</span>,
    },
    {
      key: 'column4',
      name: 'Región',
      fieldName: 'Region',
      minWidth: 50,
      maxWidth: 100,
      isResizable: true,
    },
    {
      key: 'column5',
      name: 'Instalación / Otros',
      fieldName: 'Instalacion',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      isSorted: sortField === 'Instalacion',
      isSortedDescending: sortField === 'Instalacion' ? !sortAsc : false,
      onColumnClick: handleColumnClick,
      onRender: (item) => <span>{item.Instalacion}</span>,
    },
    {
      key: 'column6',
      name: 'Fecha',
      fieldName: 'FechaHoraIncidente',
      minWidth: 70,
      isResizable: true,
      isSorted: sortField === 'FechaHoraIncidente',
      isSortedDescending: sortField === 'FechaHoraIncidente' ? !sortAsc : false,
      onColumnClick: handleColumnClick,
      onRender: (item) => <span>{formatDate(item.FechaHoraIncidente)}</span>,
    },
    {
      key: 'column7',
      name: '',
      fieldName: 'Turno',
      minWidth: 20,
      isSorted: sortField === 'Turno',
      isSortedDescending: sortField === 'Turno' ? !sortAsc : false,
      onColumnClick: handleColumnClick,
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
      isSorted: sortField === 'Estado',
      isSortedDescending: sortField === 'Estado' ? !sortAsc : false,
      onColumnClick: handleColumnClick,
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

  const agregarItemAAlertasResultado = <T extends ConIDAlerta>(
    alertasResultado: IAlerta[],
    itemResultadoDeBusqueda: T,
  ) => {
    const alertaAAgregar: IAlerta | undefined = items.find(
      (alerta: IAlerta) => itemResultadoDeBusqueda.IDAlerta === String(alerta.Id),
    );
    if (
      alertaAAgregar &&
      !alertasResultado.find(
        (alertaResultado: IAlerta) => alertaResultado.Id === alertaAAgregar.Id,
      )
    ) {
      alertasResultado.push(alertaAAgregar);
    }
  };

  const cargarResultadosDeBusquedaEnAlertasResultado = <T extends ConIDAlerta>(
    resultados: T[],
    alertasResultado: IAlerta[],
  ) => {
    resultados.forEach((resultadoDeLaBusqueda: ConIDAlerta) => {
      agregarItemAAlertasResultado(alertasResultado, resultadoDeLaBusqueda);
    });
  };

  const reducirCamposDeAlertas = (items: IAlerta[]) => {
    return items.map((alerta: IAlerta) => ({
      IDAlerta: String(alerta.Id),
      CategoriaPrincipalTitle: alerta.CategoriaPrincipal?.Title,
      CategoriaSecundariaTitle: alerta.CategoriaSecundaria?.Title,
      Turno: alerta?.Turno,
      TipoAlerta: alerta?.TipoAlerta,
      Estado: alerta?.Estado,
      Fecha: new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(alerta.FechaHoraIncidente)),
    }));
  };

  const doSearch = (cadenaIngresadaEnBuscador: string) => {
    if (!cadenaIngresadaEnBuscador) {
      setCurrentItems(items);
      return;
    }

    const alertasResultado: IAlerta[] = [];
    const alertasReducidasDeAlertasPrefiltradas: AlertaReducida[] =
      reducirCamposDeAlertas(items);

    cargarResultadosDeBusquedaEnAlertasResultado(
      buscar<AlertaReducida>(
        alertasReducidasDeAlertasPrefiltradas,
        cadenaIngresadaEnBuscador,
        definirIndicesResultadoPorPalabraEncontrada,
      ),
      alertasResultado,
    );

    cargarResultadosDeBusquedaEnAlertasResultado(
      buscar<IComentario>(
        comentariosDeAlertasPrefiltradas,
        cadenaIngresadaEnBuscador,
        definirIndicesResultadoPorPalabraEncontrada,
      ),
      alertasResultado,
    );

    cargarResultadosDeBusquedaEnAlertasResultado(
      buscar<IDatoComplementario>(
        datosComplementariosDeAlertasPrefiltradas,
        cadenaIngresadaEnBuscador,
        definirIndicesResultadoPorPalabraEncontrada,
      ),
      alertasResultado,
    );

    cargarResultadosDeBusquedaEnAlertasResultado(
      buscar<IInvolucrado>(
        involucradosDeAlertasPrefiltradas,
        cadenaIngresadaEnBuscador,
        definirIndicesResultadoPorPalabraEncontrada,
      ),
      alertasResultado,
    );

    cargarResultadosDeBusquedaEnAlertasResultado(
      buscar<IImpacto>(
        impactosDeAlertasPrefiltradas,
        cadenaIngresadaEnBuscador,
        definirIndicesResultadoPorPalabraEncontrada,
      ),
      alertasResultado,
    );

    setCurrentItems(alertasResultado);
  };

  return (
    <div className={styles.main}>
      <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 8 }}>
        <SearchBox
          placeholder="Buscar…"
          value={searchTerm}
          onChange={(_, newValue) => setSearchTerm(newValue || '')}
          onSearch={() => doSearch(searchTerm)}
          onClear={() => {
            setSearchTerm('');
            doSearch('');
          }}
          underlined
          styles={{ root: { width: 250 } }}
        />
        <DefaultButton
          text="Buscar"
          onClick={() => doSearch(searchTerm)}
          styles={{ root: { height: 32 } }}
        />
      </Stack>
      <DetailsList
        items={sortedItems}
        columns={columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.fixedColumns}
        selectionPreservedOnEmptyClick={true}
        selectionMode={SelectionMode.multiple}
        selection={selection}
        checkboxVisibility={CheckboxVisibility.always}
        onRenderDetailsHeader={onRenderDetailsHeader}
        onShouldVirtualize={() => false}
      />
    </div>
  );
};

export default ListaModal;
