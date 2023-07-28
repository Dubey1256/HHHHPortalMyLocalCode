import { Column, Table, FilterFn } from "@tanstack/react-table";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import { HTMLProps } from 'react';
declare module "@tanstack/table-core" {
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}
export declare function Filter({ column, table, placeholder }: {
    column: Column<any, any>;
    table: Table<any>;
    placeholder: any;
}): any;
export declare function IndeterminateCheckbox({ indeterminate, className, ...rest }: {
    indeterminate?: boolean;
} & HTMLProps<HTMLInputElement>): JSX.Element;
declare const GlobalCommanTable: (items: any) => JSX.Element;
export default GlobalCommanTable;
//# sourceMappingURL=GlobalCommanTable.d.ts.map