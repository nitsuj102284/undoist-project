export interface EntityIndex {
    entity: new () => any;
    columns: string[];
}


export interface EntityRecords {
    entityName: string;
    records: any[];
}