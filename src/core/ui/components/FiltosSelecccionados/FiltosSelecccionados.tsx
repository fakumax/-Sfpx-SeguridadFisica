import { IconButton, IIconProps, MessageBar, MessageBarType } from '@fluentui/react';
import * as React from 'react';
import styles from './FiltosSelecccionados.module.scss';
export interface FileDescripcionProps {
  fields: string[];
  borrarFiltro: (posicion: number) => void;
}
const FiltosSelecccionados: React.FunctionComponent<FileDescripcionProps> = ({
  fields,
  borrarFiltro,
}) => {
  const ErrorBadgeIcon: IIconProps = { iconName: 'ErrorBadge' };

  const deleteFiltro = (id: number) => {
    borrarFiltro(id);
  };

  return (
    <>
      <div className={styles.FiltosSelecccionados_contenedorFiltro}>
        <div className={styles.FiltosSelecccionados_centeredCell}>
          {fields.map((field, index) => {
            return (
              <>
                {field !== '' && (
                  <div className={styles.FiltosSelecccionados_Cell}>
                    <div className={styles.FiltosSelecccionados_CellFiltroTexto}>
                      {field}
                    </div>
                    <div>
                      <IconButton
                        key={index}
                        iconProps={ErrorBadgeIcon}
                        aria-label="ErrorBadge"
                        onClick={() => {
                          deleteFiltro(index);
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export { FiltosSelecccionados };
