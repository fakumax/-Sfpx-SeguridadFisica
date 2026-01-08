import * as React from 'react';
import {
  DefaultButton,
  PrimaryButton,
  Panel,
  IRenderFunction,
  IPanelProps,
  Separator,
} from '@fluentui/react';

import styles from './FormPanelInvolucrados.module.scss';

export interface IFormPanelProps {
  title: string;
  isOpen?: boolean;
  className?: string;
  saveLabel?: string;
  cancelLabel?: string;
  onSave?: ((event?: React.FormEvent<HTMLFormElement>) => void) | (() => void);
  onCancel?: () => void;
  formName?: string;
  isSaveDisabled?: boolean;
}

const FormPanelInvolucrados: React.FunctionComponent<IFormPanelProps> = ({
  title,
  isOpen,
  className,
  saveLabel,
  cancelLabel,
  onCancel,
  onSave,
  formName,
  children,
  isSaveDisabled,
}) => {
  const handleDismiss = (event?: React.SyntheticEvent<HTMLElement>) => {
    if (event) event.preventDefault();
    if (onCancel) onCancel();
  };

  const handleFooterRender = () => {
    const saveProps = { onClick: () => onSave(), disabled: isSaveDisabled };
    return (
      <React.Fragment>
        <Separator />
        {saveLabel && <PrimaryButton {...saveProps}>{saveLabel}</PrimaryButton>}
        {cancelLabel && (
          <DefaultButton onClick={() => handleDismiss()} className={styles.rightButton}>
            {cancelLabel}
          </DefaultButton>
        )}
      </React.Fragment>
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSave) onSave(event);
  };

  const showButtons: boolean = !!(saveLabel || cancelLabel);

  return (
    <Panel
      headerText={title}
      isOpen={isOpen}
      onDismiss={handleDismiss}
      closeButtonAriaLabel={cancelLabel}
      className={`${styles.formPanel} ${className}`}
      onRenderFooterContent={showButtons ? handleFooterRender : undefined}
      isFooterAtBottom={showButtons}
    >
      {children}
    </Panel>
  );
};

export default FormPanelInvolucrados;
