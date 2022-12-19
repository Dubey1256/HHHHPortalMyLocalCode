import * as React from 'react';

import '../../cssFolder/Style.scss';
type Props = {
  title: string
  index: number
  setSelectedTab: (index: number) => void
}

const TabTitle: React.FC<Props> = ({ title, setSelectedTab, index }) => {

  return (
      <li onClick={() => setSelectedTab(index)}>{title}</li>
  )
}

export default TabTitle