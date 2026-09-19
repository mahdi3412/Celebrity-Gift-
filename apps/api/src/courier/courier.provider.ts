export type CourierQuote={provider:string;fanToStationInr:number;stationToCreatorInr:number;currency:"INR";destinationPincode?:string;note:string};
export interface CourierProvider{quote(input:{destinationPincode?:string}):Promise<CourierQuote>;}
export const COURIER_PROVIDER="COURIER_PROVIDER";