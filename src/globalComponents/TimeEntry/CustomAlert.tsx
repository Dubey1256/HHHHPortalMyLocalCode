import * as React from 'react';
import { Dialog, DialogFooter, DialogType, PrimaryButton, DialogContent } from '@fluentui/react';

const CustomAlert = ({ hidden, toggleDialog, message, linkText, linkUrl }:any) => {
  const messageParts = message.split("Please click here");

  return (
    <Dialog
      hidden={hidden}
      onDismiss={toggleDialog}
      dialogContentProps={{
        type: DialogType.normal,
        title: 'Alert',
      
      }}
      modalProps={{
        isBlocking: true,
        styles: { main: { maxWidth: 350 } },
      }}
    >
      <DialogContent>
        <p>
          {messageParts[0]}
          <a href={linkUrl} target="_blank" rel="noreferrer noopener" style={{ margin: '0 4px' }}>
            {linkText}
          </a>
          {messageParts[1]}
        </p>
      </DialogContent>
      <DialogFooter>
        <PrimaryButton onClick={toggleDialog} text="Close" />
      </DialogFooter>
    </Dialog>
  );
};

export default CustomAlert;
