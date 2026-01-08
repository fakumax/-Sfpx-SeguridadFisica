import * as React from 'react';
import { CommandBar, ICommandBarItemProps, Pivot, PivotItem } from '@fluentui/react';
import styles from './Header.module.scss';
import { EstadoAlerta } from '../../../../../core/utils/Constants';

interface HeaderProps {
  selectedKey: string;
  onPivotChange: (item: PivotItem) => void;
  onExportar: () => void;
  onFiltro: () => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedKey,
  onPivotChange,
  onExportar,
  onFiltro,
}) => {
  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: 'export',
      text: 'Exportar',
      iconProps: { iconName: 'Download' },
      onClick: () => onExportar(),
    },
    {
      key: 'filter',
      text: 'Filtrar listado',
      iconProps: { iconName: 'Filter' },
      onClick: () => onFiltro(),
    },
  ];

  return (
    <div className={styles.header}>
      <h3 className={styles.headerTitle}>Listado de alertas</h3>
      <div className={styles.headerTabs}>
        <Pivot selectedKey={selectedKey} onLinkClick={onPivotChange}>
          <PivotItem headerText="Pendientes" itemKey={EstadoAlerta.pendientes} />
          <PivotItem headerText="En tratamiento" itemKey={EstadoAlerta.tratamiento} />
        </Pivot>
      </div>
      <div className={styles.commandBar}>
        <CommandBar items={commandBarItems} />
      </div>
    </div>
  );
};

export { Header };
