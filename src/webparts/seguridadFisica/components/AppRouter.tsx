import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import SeguridadFisica from './ListaAlerta/SeguridadFisica';
import { AltaAlerta } from './AltaAlerta/AltaAlerta';
import { ISeguridadFisicaProps } from './ListaAlerta/ISeguridadFisicaProps';
import SPODataProvider from '../../../core/pnp/sp/SharePointDataProvider';
import { IAlerta } from '../../../core/interfaces/IAlerta';
import { expandFields, selectFields } from '../common/helpers';
import { CustomFormProvider } from '../common/context/CustomFormProvider';
import { IFiltro } from '../../../core/interfaces/IFiltro';
import { EstadoAlerta, LIST_NAMES } from '../../../core/utils/Constants';
import WebWarningDialog from '../../../core/ui/components/WebWarningDialog/WebWarningDialog';
import CuadroMando from './CuadroMando/CuadroMando';
import Footer from './Footer/Footer';
import { Utils } from '../../../core';
import Navbar from './Navbar/Navbar';

const AppRouter: React.FC<ISeguridadFisicaProps> = (props) => {
  const [stateItems, setItems] = React.useState<IAlerta[]>(props.listItemAlerta);
  const [stateFiltro, setFiltro] = React.useState<IFiltro>(props.filtrosPermisos);
  const [stateMessageBar, setMessageBar] = React.useState<string>(undefined);
  const [userIsConnected, setUserIsConnected] = React.useState(props.VPNisConnected);
  const containerStyles: React.CSSProperties = { height: 300 };
  React.useEffect(() => {
    if (props.visible) {
      getListItemsAlerta(EstadoAlerta.pendientes);
    }
  }, []);
  React.useEffect(() => {
    let fiveMinutes = 1000 * 60 * 5;
    const interval = setInterval(() => {
      let vpn = SPODataProvider.isConnected();
      vpn.then((res) => {
        setUserIsConnected(res);
      });
      return () => clearInterval(interval);
    }, fiveMinutes);
  }, []);

  const getListItemsAlerta = (PivotKey: string): void => {
    let filtro = '';
    switch (PivotKey) {
      case EstadoAlerta.pendientes:
        filtro = stateFiltro.pendientes;
        break;
      case EstadoAlerta.tratamiento:
        filtro = stateFiltro.tratamiento;
        break;
      default:
        filtro = `${PivotKey}`;
    }
    let listAlerta = SPODataProvider.getListItems<IAlerta>(
      LIST_NAMES.ALERTAS,
      selectFields,
      filtro,
      expandFields,
    );
    listAlerta
      .then((items) => {
        setItems(items);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleDismiss = () => setMessageBar(undefined);
  const updateAlerta = (mensaje: string): void => {
    let filtro = stateFiltro.pendientes;
    let listAlerta = SPODataProvider.getListItems<IAlerta>(
      LIST_NAMES.ALERTAS,
      selectFields,
      filtro,
      expandFields,
    );
    listAlerta
      .then((items) => {
        setItems(items);
        let timeoutId;
        if (mensaje != undefined) {
          setMessageBar(mensaje);
          timeoutId = setTimeout(() => {
            handleDismiss();
          }, 15000);
        }
        return () => {
          return clearTimeout(timeoutId);
        };
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <React.Fragment>
      <WebWarningDialog isConnected={userIsConnected} />
      <HashRouter>
        <Navbar
          enlaces={props.enlaces}
          siteUrl={props.context.pageContext.web.serverRelativeUrl}
        />
        <Routes>
          <Route
            path="/"
            element={
              props.visible ? (
                <SeguridadFisica
                  listItemAlerta={stateItems}
                  hasTeamsContext={props.hasTeamsContext}
                  btnFiltro={getListItemsAlerta}
                  stateMessageBar={stateMessageBar}
                  region={props.region}
                  rol={props.permiso}
                  sendEmailObj={props.sendEmailObj}
                />
              ) : (
                <div style={containerStyles}>
                  <img
                    alt=""
                    src={require('../assets/felicitaciones-no-tenes-alertas-pendientes.svg')}
                  />
                </div>
              )
            }
          />
          <Route
            path="/alerta/:id"
            element={
              <CustomFormProvider>
                <AltaAlerta
                  context={props.context}
                  region={props.region}
                  permiso={props.permiso}
                  updateAlerta={updateAlerta}
                />
              </CustomFormProvider>
            }
          />
          <Route path="/cuadroMando" element={<CuadroMando />} />
        </Routes>
      </HashRouter>
      <Footer version={Utils.getVersion()} />
    </React.Fragment>
  );
};

export default AppRouter;
