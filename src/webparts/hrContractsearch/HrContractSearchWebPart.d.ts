import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
export interface IHrContractSearchWebPartProps {
    description: string;
    ContractListID: 'c0106d10-a71c-4153-b204-7cf7b45a68b8';
    EmployeeDetailListID: 'a7b80424-e5e1-47c6-80a1-0ee44a70f92c';
    SmartMetaDataListID: '63CAE346-409E-4457-B996-85A788074BCE';
}
export default class HrContractSearchWebPart extends BaseClientSideWebPart<IHrContractSearchWebPartProps> {
    private _isDarkTheme;
    private _environmentMessage;
    render(): void;
    protected onInit(): Promise<void>;
    private _getEnvironmentMessage;
    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=HrContractSearchWebPart.d.ts.map