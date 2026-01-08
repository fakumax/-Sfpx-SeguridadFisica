import { IChoiceGroupOption, TooltipHost, Icon, Text, Stack } from '@fluentui/react';
import * as React from 'react';
import styles from './Impacto.module.scss';

export const tooltips = {
  ImpactoPersonas: {
    Nulo: 'No existió riesgo a la vida de personas',
    Alto: 'Existieron heridos/muertos o el evento fue de un alto potencial para la vida humana',
  },
  ImpactoInfraestructura: {
    Nulo: 'No se vieron afectados activos.',
    Bajo: 'Se vieron afectados activos entre 1 USD y 1000 USD',
    Medio: 'Se vieron afectados activos entre 1.001 USD y 10.000 USD',
    Alto: 'Se vieron afectados activos por un valor superior a 10.001 USD. Evento de poca afectación económica pero de muy alto potencial',
  },
  ImpactoOperaciones: {
    Nulo: 'No se vieron afectadas las operaciones.',
    Bajo: 'La operación puede verse afectada durante el evento hasta 24 hs.',
    Medio: 'La operación se interrumpió entre 24 hs y 72 hs afectando la producción.',
    Alto: 'La operación se interrumpió por más de 72 hs afectando la producción. Si bien no se afectó la operación, el evento fue de un alto potencial.',
  },
  ImpactoMedioambiente: {
    Nulo: 'No se vio afectado el medio ambiente.',
    Bajo: 'Se afectó al medio ambiente de manera leve.',
    Medio: 'Existió una afectación importante del medio ambiente.',
    Alto: 'Existió una afectación muy importante al medio ambiente, o el evento fue de muy alto potencial.',
  },
  ImpactoImagen: {
    Nulo: 'No se vio afectada la imagen de la Empresa.',
    Bajo: 'Se vio afectada la imagen de la Empresa en medios de comunicación locales o redes sociales.',
    Medio:
      'Se vio afectada la imagen de la Empresa en medios de comunicación nacionales o redes sociales.',
    Alto: 'Se vio afectada la imagen de la Empresa en medios de comunicación internacionales.',
  },
  ImpactoInformacion: {
    Nulo: 'No existió faltante de información.',
    Bajo: 'Fue sustraída información NO sensible para la compañía.',
    Medio: 'Fue sustraída información privada de la compañía.',
    Alto: 'Fue sustraída información confidencial de la compañía.',
  },
};

export const createGruposImpacto = (
  choiceOptions: Record<string, string[]>,
): { name: string; label: string; options: IChoiceGroupOption[] }[] => [
  {
    name: 'ImpactoPerdida.ImpactoPersonas',
    label: 'Personas',
    options:
      choiceOptions['ImpactoPersonas']?.map((option) => ({
        key: option,
        text: option,
        onRenderLabel: (props) =>
          renderLabelWithTooltip(props, tooltips['ImpactoPersonas'][option]),
      })) || [],
  },
  {
    name: 'ImpactoPerdida.ImpactoInfraestructura',
    label: 'Infraestructura / Material',
    options:
      choiceOptions['ImpactoInfraestructura']?.map((option) => ({
        key: option,
        text: option,
        onRenderLabel: (props) =>
          renderLabelWithTooltip(props, tooltips['ImpactoInfraestructura'][option]),
      })) || [],
  },
  {
    name: 'ImpactoPerdida.ImpactoOperaciones',
    label: 'Operaciones',
    options:
      choiceOptions['ImpactoOperaciones']?.map((option) => ({
        key: option,
        text: option,
        onRenderLabel: (props) =>
          renderLabelWithTooltip(props, tooltips['ImpactoOperaciones'][option]),
      })) || [],
  },
  {
    name: 'ImpactoPerdida.ImpactoMedioambiente',
    label: 'Medio ambiente',
    options:
      choiceOptions['ImpactoMedioambiente']?.map((option) => ({
        key: option,
        text: option,
        onRenderLabel: (props) =>
          renderLabelWithTooltip(props, tooltips['ImpactoMedioambiente'][option]),
      })) || [],
  },
  {
    name: 'ImpactoPerdida.ImpactoImagen',
    label: 'Imagen',
    options:
      choiceOptions['ImpactoImagen']?.map((option) => ({
        key: option,
        text: option,
        onRenderLabel: (props) =>
          renderLabelWithTooltip(props, tooltips['ImpactoImagen'][option]),
      })) || [],
  },
  {
    name: 'ImpactoPerdida.ImpactoInformacion',
    label: 'Información',
    options:
      choiceOptions['ImpactoInformacion']?.map((option) => ({
        key: option,
        text: option,
        onRenderLabel: (props) =>
          renderLabelWithTooltip(props, tooltips['ImpactoInformacion'][option]),
      })) || [],
  },
];

export const getColorForImpactValue = (valor: string): string => {
  switch (valor.toUpperCase()) {
    case 'ALTO':
      return '#8A2BE2'; // Morado para "ALTO"
    case 'MEDIO':
      return '#f47700'; // Naranja para "MEDIO"
    case 'BAJO':
      return '#1ebbff'; // Celeste para "BAJO"
    case 'NULO':
      return '#32CD32'; // Verde para "NULO"
    default:
      return '#FFFFFF'; // Blanco por defecto para otros valores
  }
};

export const renderLabelWithTooltip = (
  option: IChoiceGroupOption,
  tooltipText: string,
) => (
  <span className={styles.choiceLabelContainer}>
    <span className={styles.choiceLabelText}>{option.text}</span>
    <TooltipHost content={tooltipText}>
      <Icon iconName="Info" className={styles.tooltipIcon} />
    </TooltipHost>
  </span>
);

const campoToTooltipMap = {
  Personas: 'ImpactoPersonas',
  'Infraestructura/Material': 'ImpactoInfraestructura',
  Operaciones: 'ImpactoOperaciones',
  'Medio Ambiente': 'ImpactoMedioambiente',
  Imagen: 'ImpactoImagen',
  Información: 'ImpactoInformacion',
};

export const findMensaje = (campo, mensajes) => {
  const mensaje = mensajes.find((m) => m.campo === campo);
  if (mensaje) {
    const tooltipKey = campoToTooltipMap[campo];
    return {
      campo: mensaje.campo,
      valor: mensaje.valor,
      tooltip: tooltips[tooltipKey]?.[mensaje.valor] || '',
    };
  }
  return null;
};

const renderImpactDetail = (campo, mensajes) => {
  const mensaje = findMensaje(campo, mensajes);
  if (!mensaje) return null;

  return (
    <Stack
      verticalAlign="start"
      horizontalAlign="start"
      className={styles.impactDetailContainer}
    >
      <Stack className={styles.impactDetailTitleContainer}>
        <Text variant="large" className={styles.impactDetailTitle}>
          {mensaje.campo}
        </Text>
      </Stack>
      <Stack horizontal className={styles.impactDetailValueContainer}>
        <Stack
          horizontal
          className={styles.impactDetailValuePair}
          style={{
            backgroundColor: getColorForImpactValue(mensaje.valor),
          }}
        >
          <Text className={styles.impactLabelValue}>{mensaje.valor.toUpperCase()}</Text>
        </Stack>
        <Stack horizontal className={styles.impactDetailDescription}>
          <Text className={styles.impactLabelTooltip}>{mensaje.tooltip}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const MensajeImpacto = ({ mensajes }) => {
  const materialAfectado = findMensaje('Material Afectado Total', mensajes);
  const perdidaDiaria = findMensaje('Pérdida Diaria de Producción', mensajes);
  const uniMedida = findMensaje('Unidad de Medida', mensajes);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
      <div className={styles.impactWrapContainer}>
        <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
          Impacto asociado
        </Text>
        {renderImpactDetail('Personas', mensajes)}
        {renderImpactDetail('Infraestructura/Material', mensajes)}
        {renderImpactDetail('Operaciones', mensajes)}
        {renderImpactDetail('Medio Ambiente', mensajes)}
        {renderImpactDetail('Imagen', mensajes)}
        {renderImpactDetail('Información', mensajes)}
      </div>
      <div className={styles.impactWrapContainer}>
        <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
          Pérdida asociada
        </Text>
        {materialAfectado && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text
              variant="smallPlus"
              styles={{ root: { color: '#666666', fontWeight: 400 } }}
            >
              {materialAfectado.campo}
            </Text>
            <Text
              variant="medium"
              styles={{ root: { fontWeight: 600, marginBottom: '10px' } }}
            >
              {materialAfectado.valor}
            </Text>
          </div>
        )}

        {perdidaDiaria && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text
              variant="smallPlus"
              styles={{ root: { color: '#666666', fontWeight: 400 } }}
            >
              {perdidaDiaria.campo}
            </Text>
            <Text variant="medium" styles={{ root: { fontWeight: 600 } }}>
              {`${perdidaDiaria.valor} ${uniMedida.valor}`}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
