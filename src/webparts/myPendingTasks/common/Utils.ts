import { IColumn, IContextualMenuItem } from "@fluentui/react";

export class Utils {
    /**
     * Returns sorting menu
     */
    public GetSortingMenuItems(column: IColumn, onSortColumn: (column: IColumn, isSortedDescending: boolean) => void): IContextualMenuItem[] {
        let menuItems = [];
        if (column.data == Number) {
            menuItems.push(
                {
                    key: 'smallToLarger',
                    name: 'Smaller to larger',
                    canCheck: true,
                    checked: column.isSorted && !column.isSortedDescending,
                    onClick: () => onSortColumn(column, false)
                },
                {
                    key: 'largerToSmall',
                    name: 'Larger to smaller',
                    canCheck: true,
                    checked: column.isSorted && column.isSortedDescending,
                    onClick: () => onSortColumn(column, true)
                }
            );
        }
        else if (column.data == Date || column.key=="Created" || column.key=="Modified") {
            menuItems.push(
                {
                    key: 'oldToNew',
                    name: 'Older to newer',
                    canCheck: true,
                    checked: column.isSorted && !column.isSortedDescending,
                    onClick: () => onSortColumn(column, false)
                },
                {
                    key: 'newToOld',
                    name: 'Newer to Older',
                    canCheck: true,
                    checked: column.isSorted && column.isSortedDescending,
                    onClick: () => onSortColumn(column, true)
                }
            );
        }
        else
        //(column.data == String) 
        // NOTE: in case of 'complex columns like Taxonomy, you need to add more logic'
        {
            menuItems.push(
                {
                    key: 'aToZ',
                    name: 'A to Z',
                    canCheck: true,
                    checked: column.isSorted && !column.isSortedDescending,
                    onClick: () => onSortColumn(column, false)
                },
                {
                    key: 'zToA',
                    name: 'Z to A',
                    canCheck: true,
                    checked: column.isSorted && column.isSortedDescending,
                    onClick: () => onSortColumn(column, true)
                }
            );
        }
        return menuItems;
    }

    /**
     * Returns the site relative url from an absolute url
     */
    public GetFilterValues(column: IColumn, arrayObjects: any[], onFilterClickCallback: (ev?: React.MouseEvent<HTMLElement>, item?: IContextualMenuItem) => void): IContextualMenuItem[] {

        let filters: IContextualMenuItem[] = [];
        for (let i = 0; i < arrayObjects.length; i++) {
            let item = arrayObjects[i];
            let value: any = item[column.key];
            if (item[column.key]) {
                //in case we have specific column, we can add more complex logic
                if (column.data == "Taxonomy") {
                    let columnValue: string = item[column.key];
                    let valuesAsStrings: string[] = columnValue.split(";");
                    valuesAsStrings.map((termValue) => {
                        termValue = termValue.trim();
                        if (termValue && !this._IsValuePresented(filters, termValue)) {
                            filters.push(
                                {
                                    key: termValue,
                                    name: termValue,
                                    data: column.key,
                                    onClick: onFilterClickCallback,
                                    isChecked: i == 0 ? true : false
                                });
                        }
                    });
                }
                else if(column.data == Array) {
                    let columnValues: string[] = item[column.key];
                    columnValues.forEach(columnValue => {
                        if(!this._IsValuePresented(filters, columnValue)) {
                            filters.push(
                                {
                                    key: columnValue,
                                    name: columnValue,
                                    data: column.key,
                                    onClick: onFilterClickCallback,
                                    isChecked: i == 0 ? true : false
                                });
                        }
                    });
                }
                else if(column.data == Object) {
                    if(column.key == "Created" || column.key == "Modified") {
                        const _date = value.Date;
                        if(!this._IsValuePresented(filters, _date)) {
                            filters.push(
                            {
                                key: _date,
                                name: _date,
                                data: column.key,
                                onClick: onFilterClickCallback,
                                isChecked: i == 0 ? true : false
                            });
                        }
                    }
                    else if(column.key == "TeamUsers") {
                        const _teamUsers = [
                            ...value.AssignedUsers.map((i: { UserName: string; })=>i.UserName),
                            ...value.ResponsibleTeam.map((i: { UserName: string; })=>i.UserName),
                            ...value.TeamMembers.map((i: { UserName: string; })=>i.UserName)
                        ];
                        _teamUsers.forEach(_teamUser=>{
                            if (!this._IsValuePresented(filters, _teamUser)) {
                                filters.push(
                                {
                                    key: _teamUser,
                                    name: _teamUser,
                                    data: column.key,
                                    onClick: onFilterClickCallback,
                                    isChecked: i == 0 ? true : false
                                });
                            }
                        });
                    }
                }
                else {
                    if (!this._IsValuePresented(filters, value)) {
                        filters.push(
                        {
                            key: value,
                            name: value,
                            data: column.key,
                            onClick: onFilterClickCallback,
                            isChecked: i == 0 ? true : false
                        });
                    }
                }
            }
        }
        return filters;
    }
    /**
     * Helper method that check if a value is in the IContextualMenuItem[]
     */
    private _IsValuePresented(currentValues: IContextualMenuItem[], newValue: string): boolean {

        for (let i = 0; i < currentValues.length; i++) {
            if (currentValues[i].key == newValue) {
                return true;
            }
        }
        return false;
    }

    public filterListItems(valueToFilter: string, allItems: any[], filteredItems: any[]) {
        valueToFilter = valueToFilter.toLowerCase();
        if (valueToFilter && valueToFilter.length > 2) {
            let filterItems: Array<any> = [];
            let itemsToFilter = allItems;
            let searchableFields: string[] = [
                "TaskId",
                "TaskTitle",
                "DueDate",
                "Categories",
                "Created",
                "TeamUsers"
            ];
            itemsToFilter.map(item => {
                searchableFields.map(field => {
                if (filterItems.indexOf(item) < 0) {
                    if(field=="TaskId" || field=="TaskTitle" || field=="DueDate") {
                        if (item[field].toString().toLowerCase().indexOf(valueToFilter) > -1) {
                            filterItems.push(item);                    
                        }
                    }
                    else if(field=="Categories") {
                        if(item.Categories.filter((i:string)=>i.toLowerCase().indexOf(valueToFilter)>-1).length>0) {
                            filterItems.push(item);
                        }
                    }
                    else if(field=="Created") {
                        if (item.Created.Date.toString().toLowerCase().indexOf(valueToFilter) > -1) {
                            filterItems.push(item);                    
                        }
                    }
                    else if(field=="TeamUsers") {
                        let teamUsers = [
                            ...item.TeamUsers.AssignedUsers.map((i: { UserName: string; })=>i.UserName),
                            ...item.TeamUsers.ResponsibleTeam.map((i: { UserName: string; })=>i.UserName),
                            ...item.TeamUsers.TeamMembers.map((i: { UserName: string; })=>i.UserName)
                        ];
                        if(teamUsers.filter((i:string)=>i.toLowerCase().indexOf(valueToFilter)>-1).length>0) {
                            filterItems.push(item);
                        }
                    }
                  
                  return item;
                }
              });
      
            });
            return filterItems;
            
          }

          return filteredItems;
          
    }
}