import * as React from 'react';
import styles from './DatosBase.module.scss';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PrimeraFila } from './PrimeraFila/PrimeraFila';
import { SegundaFila } from './SegundaFila/SegundaFila';
import { TerceraFila } from './TerceraFila/TerceraFila';

interface DatosBaseProps {
  alertData: any;
  context: WebPartContext;
}

const DatosBase: React.FC<DatosBaseProps> = ({ alertData, context }) => {
  return (
    <div className={styles.gridContainer}>
      <PrimeraFila alertData={alertData} />
      <SegundaFila alertData={alertData} />
      <TerceraFila alertData={alertData} />
    </div>
  );
};

export default DatosBase;
