export interface ColumnTextValues {
  [index: string]: string;
}

export type CheckBoxType = {
  value: any;
  name: string;
};

export type FilterType = {
    exclude: any;
    value: any;
    type: any;
  };
  
export type FilterMap = {
    [index: string]: { [index2: string]: FilterType };
  }
