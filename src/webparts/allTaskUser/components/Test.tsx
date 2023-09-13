import * as React from 'react';
import { ContextualMenu, IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";

export const TermLabel: React.FC = () => {
  const linkRef = React.useRef(null);
  
  const [showContextualMenu, setShowContextualMenu] = React.useState<boolean>(false);

 

  const hideContextualMenu = React.useCallback(() => {
    setShowContextualMenu(false);
  },[setShowContextualMenu]);
  const menuItems: IContextualMenuItem[] = [
    {
      key: 'copyItem',
      text: 'Create new file with term (Copy)',
      onClick: (ev,item) => {
        console.log(item);
      }
    },
    {
      key: 'moveItem',
      text: 'Replace with new term (Move)',
      onClick: (ev,item) => {
        console.log(item);
      }
    },
    {
      key: 'linkItem',
      text: 'Add new term (Link)',
      onClick: (ev,item) => {
        console.log(item);
      }
    }];
 
  return (
    <li>            
      <div ref={linkRef} onClick={()=>setShowContextualMenu(true)}>
        TEST
      </div>
      <ContextualMenu
        items={menuItems}
        hidden={!showContextualMenu}
        target={linkRef}
        onItemClick={hideContextualMenu}
        onDismiss={hideContextualMenu}
      />
                 
    </li>
  );
};