export interface EntityIndex {
    entityName: string;
    indexes: {
        name: string,
        columns: string[],
        isUnique?: boolean
    }[];
}


export interface EntityRecords {
    entityName: string;
    records: any[];
}