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

export interface IMeasureConfirmPayload {
  measure_uuid: string;
  confirmed_value: number;
}

export interface IMeasureFilter {
  customer_code: string;
  measure_type?: MeasureType;
}