import * as React from 'react';
import styles from './SeguridadFisica.module.scss';
import { Header } from './Header/Header';
import Main from './Main/Main';
import { PivotItem } from '@fluentui/react';
import { IAlerta } from '../../../../core/interfaces/IAlerta';
import SPODataProvider from '../../../../core/pnp/sp/SharePointDataProvider';
import {
  EstadoAlerta,
  Estados,
  LIST_NAMES,
  Permisos,
} from '../../../../core/utils/Constants';
import { IFiltrar } from '../../../../core/interfaces/IFiltrar';
import moment from 'moment';
import { FiltosSelecccionados } from '../../../../core/ui/components/FiltosSelecccionados/FiltosSelecccionados';
import { ISendEmailConfig } from './ISeguridadFisicaProps';

export interface ISeguridadFisica {
  hasTeamsContext: boolean;
  listItemAlerta: IAlerta[];
  btnFiltro: (PivotKey: string) => void;
  stateMessageBar: string;
  region: string;
  rol: string;
  sendEmailObj: ISendEmailConfig;
}

const SeguridadFisica: React.FC<ISeguridadFisica> = ({
  listItemAlerta,
  hasTeamsContext,
  btnFiltro,
  stateMessageBar,
  region,
  rol,
  sendEmailObj,

}) => {
  const [selectedPivotKey, setSelectedPivotKey] = React.useState('pendientes');
  const [stateItems, setItems] = React.useState<IAlerta[]>(listItemAlerta);
  const [stateOpenFiltro, setOpenFiltro] = React.useState(false);
  const [stateFiltros, setFiltros] = React.useState<string[]>([]);
  const [propsFiltros, setPropsFiltros] = React.useState<IFiltrar>({
    numero: undefined,
    FechaHoraIncidenteDesde: undefined,
    FechaHoraIncidenteHasta: undefined,
    Estado: undefined,
    Region: undefined,
    Vicepresidencia: undefined,
    UnidadDeNegocio: undefined,
    Activo: undefined,
    TipoAlerta: undefined,
    CategoriaPrincipal: undefined,
    CategoriaSecundaria: undefined,
  });

  React.useEffect(() => {
    setItems(listItemAlerta);
  }, [listItemAlerta]);
  const handlePivotChange = (item: PivotItem) => {
    setSelectedPivotKey(item.props.itemKey || EstadoAlerta.pendientes);
    btnFiltro(item.props.itemKey);
  };
  const Exportar = () => {
    const ExportarExcel = async () => {
      await SPODataProvider.ExportaraExcel(stateItems);
    };
    ExportarExcel();
  };
  const closeFiltro = () => {
    setOpenFiltro(false);
  };
  const openFiltro = () => {
    setOpenFiltro(true);
  };
  const aplicarFiltro = (filtro: IFiltrar) => {
    setPropsFiltros(filtro);
    let filtros: string[] = ['', '', '', '', '', '', '', '', '', '', ''];
    let query = '';
    let queryDesde = undefined;
    let queryHasta = undefined;
    if (filtro.numero !== undefined) {
      query = `ID eq '${filtro.numero}'`;
      setFiltros([...stateFiltros, filtro.numero]);
      filtros[0] = filtro.numero;
    }
    if (filtro.FechaHoraIncidenteDesde !== undefined) {
      queryDesde = `(FechaHoraIncidente ge datetime'${moment(filtro.FechaHoraIncidenteDesde).format('YYYY-MM-DD')}T03:00:00.000Z')`;
    }
    if (filtro.FechaHoraIncidenteHasta !== undefined) {
      queryHasta = `(FechaHoraIncidente le datetime'${moment(filtro.FechaHoraIncidenteHasta).format('YYYY-MM-DD')}T23:59:59.000Z')`;
    }
    if (queryDesde !== undefined) {
      if (queryHasta !== undefined) {
        query = `(${queryDesde} and ${queryHasta})`;
        let Desdehasta = `${moment(filtro.FechaHoraIncidenteDesde).format('YYYY-MM-DD')} al ${moment(filtro.FechaHoraIncidenteHasta).format('YYYY-MM-DD')}`;
        filtros[1] = Desdehasta;
      } else {
        query = queryDesde;
        let desde = `Desde ${moment(filtro.FechaHoraIncidenteDesde).format('YYYY-MM-DD')}`;
        filtros[1] = desde;
      }
    } else {
      if (queryHasta !== undefined) {
        query = queryHasta;
        let hasta = `Hasta ${moment(filtro.FechaHoraIncidenteHasta).format('YYYY-MM-DD')}`;
        filtros[1] = hasta;
      }
    }
    if (filtro.Estado !== undefined) {
      if (query.length > 0) {
        query += ' and ';
      }
      const queryEstado = `Estado eq '${filtro.Estado}'`;
      query += queryEstado;
      filtros[2] = filtro.Estado;
    } else {
      if (query.length > 0) {
        query += ' and ';
      }
      let queryEstado = '';
      if (rol === Permisos.COS) {
        queryEstado = `(Estado eq '${Estados.Ingresada}' or Estado eq '${Estados.DevueltaCOS}' or Estado eq '${Estados.Asignada}' or Estado eq '${Estados.DerivadaAprobador}')`;
      }
      if (rol === Permisos.GERENTESREGIONALES) {
        queryEstado = `(Estado eq '${Estados.DerivadaAprobador}' or Estado eq '${Estados.Eninvestigacion}' or Estado eq '${Estados.AsignadaAprobador}' or Estado eq '${Estados.Bloqueoproceso}' or Estado eq '${Estados.Eninvestigacion}')`;
      }
      query += queryEstado;
    }
    if (filtro.Region !== undefined) {
      if (query.length > 0) {
        query += ' and ';
      }
      const queryRegion = `Region eq '${filtro.Region}'`;
      query += queryRegion;
      //filtros[3] = filtro.Region;
    }
    if (filtro.Vicepresidencia !== undefined) {
      if (query.length > 0) {
        query += ' and ';
      }
      const queryVicepresidencia = `Vicepresidencia eq '${filtro.Vicepresidencia}'`;
      query += queryVicepresidencia;
      filtros[4] = filtro.Vicepresidencia;
    }
    if (filtro.UnidadDeNegocio !== undefined) {
      if (query.length > 0) {
        query += ' and ';
      }
      const queryUnidadDeNegocio = `UnidadDeNegocioId eq ${filtro.UnidadDeNegocio}`;
      query += queryUnidadDeNegocio;
      filtros[5] = filtro.UnidadDeNegocioTxt;
    }
    if (filtro.Activo !== undefined) {
      if (query.length > 0) {
        query += ' and ';
      }
      const queryActivo = `ActivoId eq ${filtro.Activo}`;
      query += queryActivo;
      filtros[6] = filtro.ActivoTxt;
    }
    if (filtro.TipoAlerta !== undefined) {
      if (query.length > 0) {
        query += ' and ';
      }
      let queryTipoAlerta = `TipoAlerta eq '${filtro.TipoAlerta}'`;
      if (filtro.TipoAlerta === 'Sin Tipo') {
        const sintipo = 'sintipo';
        queryTipoAlerta = `TipoAlerta eq '${sintipo}'`;
      }
      query += queryTipoAlerta;
      filtros[7] = filtro.TipoAlerta;
    }
    if (filtro.CategoriaPrincipal !== undefined) {
      if (query.length > 0) {
        query += ' and ';
      }
      const queryCategoriaPrincipal = `CategoriaPrincipalId eq ${filtro.CategoriaPrincipal}`;
      query += queryCategoriaPrincipal;
      filtros[8] = filtro.CategoriaPrincipalTxt;
    }
    if (filtro.CategoriaSecundaria !== undefined) {
      if (query.length > 0) {
        query += ' and ';
      }
      const queryCategoriaSecundaria = `CategoriaSecundariaId eq ${filtro.CategoriaSecundaria}`;
      query += queryCategoriaSecundaria;
      filtros[9] = filtro.CategoriaSecundariaTxt;
    }
    if (filtro.instalacion !== undefined) {
      if (query.length > 0) {
        query += ' and ';
      }
      query += `Instalacion eq '${filtro.instalacion}'`;
      setFiltros([...stateFiltros, filtro.instalacion]);
      filtros[10] = filtro.instalacion;
    }
    setFiltros([...filtros]);
    if (query !== '') {
      btnFiltro(query);
    } else {
      btnFiltro(EstadoAlerta.pendientes);
    }
    closeFiltro();
  };
  const onBorrarFiltro = (posicion: number) => {
    let numero = propsFiltros.numero;
    let FechaHoraIncidenteDesde = propsFiltros.FechaHoraIncidenteDesde;
    let FechaHoraIncidenteHasta = propsFiltros.FechaHoraIncidenteHasta;
    let Estado = propsFiltros.Estado;
    let Region = propsFiltros.Region;
    let Vicepresidencia = propsFiltros.Vicepresidencia;
    let UnidadDeNegocio = propsFiltros.UnidadDeNegocio;
    let Activo = propsFiltros.Activo;
    let TipoAlerta = propsFiltros.TipoAlerta;
    let CategoriaPrincipal = propsFiltros.CategoriaPrincipal;
    let CategoriaSecundaria = propsFiltros.CategoriaSecundaria;
    let Instalacion = propsFiltros.instalacion;
    switch (posicion) {
      case 0:
        numero = undefined;
        break;
      case 1:
        FechaHoraIncidenteDesde = undefined;
        FechaHoraIncidenteHasta = undefined;
        break;
      case 2:
        Estado = undefined;
        break;
      case 3:
        Region = undefined;
        break;
      case 4:
        Vicepresidencia = undefined;
        break;
      case 5:
        UnidadDeNegocio = undefined;
        break;
      case 6:
        Activo = undefined;
        break;
      case 7:
        TipoAlerta = undefined;
        break;
      case 8:
        CategoriaPrincipal = undefined;
        break;
      case 9:
        CategoriaSecundaria = undefined;
        break;
      case 10:
        Instalacion = undefined;
        break;
    }
    let query: IFiltrar = {
      numero: numero,
      FechaHoraIncidenteDesde: FechaHoraIncidenteDesde,
      FechaHoraIncidenteHasta: FechaHoraIncidenteHasta,
      Estado: Estado,
      Region: Region,
      Vicepresidencia: Vicepresidencia,
      UnidadDeNegocio: UnidadDeNegocio,
      UnidadDeNegocioTxt: propsFiltros.UnidadDeNegocioTxt,
      Activo: Activo,
      ActivoTxt: propsFiltros.ActivoTxt,
      TipoAlerta: TipoAlerta,
      CategoriaPrincipal: CategoriaPrincipal,
      CategoriaPrincipalTxt: propsFiltros.CategoriaPrincipalTxt,
      CategoriaSecundaria: CategoriaSecundaria,
      CategoriaSecundariaTxt: propsFiltros.CategoriaSecundariaTxt,
      instalacion: Instalacion,
    };
    aplicarFiltro(query);
  };
  return (
    <section
      className={`${styles.seguridadFisica} ${hasTeamsContext ? styles.teams : ''}`}
    >
      <Header
        selectedKey={selectedPivotKey}
        onPivotChange={handlePivotChange}
        onExportar={Exportar}
        onFiltro={openFiltro}
      />
      <FiltosSelecccionados fields={stateFiltros} borrarFiltro={onBorrarFiltro} />
      <Main
        selectedKey={selectedPivotKey}
        listItemAlerta={stateItems}
        stateMessageBar={stateMessageBar}
        openFiltro={stateOpenFiltro}
        filtrar={aplicarFiltro}
        closeFiltro={closeFiltro}
        region={region}
        rol={rol}
      />
    </section>
  );
};

export default SeguridadFisica;
