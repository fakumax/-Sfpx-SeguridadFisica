import * as React from 'react';
import { MessageBar as MessageBarFabric, MessageBarType, Layer } from '@fluentui/react';

import { ShowPanel } from '../';
import styles from './MessageBarCustom.module.scss';

export interface IMessageBarProps {
  text?: string;
  messageType: MessageBarType;
  time?: number;
}

const MessageBarCustom: React.FunctionComponent<IMessageBarProps> = ({
  text,
  messageType,
  time,
}) => {
  const [showMessage, setShowMessage] = React.useState<boolean>(!!text);

  const handleDismiss = () => setShowMessage(false);

  React.useEffect(() => {
    setShowMessage(!!text);
    let timeoutId;
    if (time !== 0) {
      timeoutId = setTimeout(() => {
        handleDismiss();
      }, 5000);
    }
    return () => {
      return clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <ShowPanel show={showMessage}>
      <Layer className={styles.messageBar}>
        <div className={styles.container}>
          <MessageBarFabric
            messageBarType={messageType}
            isMultiline={false}
            onDismiss={handleDismiss}
            dismissButtonAriaLabel="Close"
          >
            {text}
          </MessageBarFabric>
        </div>
      </Layer>
    </ShowPanel>
  );
};

export default MessageBarCustom;
