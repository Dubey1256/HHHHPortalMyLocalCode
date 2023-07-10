export interface ISmartMetadataItem {
    ID?: number;
    Title?: string;
    AlternativeTitle?: string;
    LongTitle?: string;
    Parent?: IParent | undefined;
    ParentId?: number | undefined;
    ParentID?: number | undefined;
    Description1?: string;
    SortOrder?: string;
    SmartFilters?: string[] | undefined;
    TaxType?: string;
    IsVisible?: boolean;
    SmartSuggestions?: boolean;
    Selectable?: boolean;
    ItemRank?: string | number;
    Status?: string | number;
    siteName?: string;
    Item_x005F_x0020_Cover?: IItemCover;
    isDeleted?: boolean;
    subRows?: ISmartMetadataItem[];
    parentItems?: ISmartMetadataItem[];
}

export interface IParent {
    Id: number;
    Title: string;
}

export interface IItemCover {
    Url: string;
    Description: string;
}