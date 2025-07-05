export enum MeasureType {
  WATER = "WATER",
  ELECTRICITY = "ELECTRICITY",
}

export interface IMeasurePayload {
  image: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: MeasureType;
}