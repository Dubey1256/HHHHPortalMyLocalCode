import * as React from 'react';
import { Input } from 'reactstrap';

export const Filter = ({ column } : any) => {
  return (
    <div style={{ marginTop: 5 }}>
      {column.canFilter && column.render('Filter')}
    </div>
  );
};

export const DefaultColumnFilter :any =  ({
  column: {
    filterValue,
    setFilter,
    internalHeader,
    preFilteredRows: { length },
  },
}:any) => {
  return (
    <Input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }} title={`${internalHeader}`}
      placeholder={`${internalHeader}`}
    />
  );
};

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) => {
  const options = React.useMemo(() => {
    const options : any = new Set();
    preFilteredRows.forEach((row :any) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <Input
      id='custom-select'
      type='select'
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value=''>All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Input>
  );
};