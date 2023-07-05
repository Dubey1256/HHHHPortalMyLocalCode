import * as React from 'react';
import './styles.css';
type Props = {
  title: string
  index: number
  setSelectedTab: (index: number) => void
}

const TabTitle: React.FC<Props> = ({ title, setSelectedTab, index }) => {

  return (
      <button type='button' onClick={() => setSelectedTab(index)}>{title}</button>
  )
}

export default TabTitle