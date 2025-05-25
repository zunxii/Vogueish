export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  customTailoring?: CustomTailoringDetails;
  isHomeTrial?: boolean;
}

export interface CustomTailoringDetails {
  measurements: {
    chest?: number;
    waist?: number;
    hip?: number;
    length?: number;
    shoulders?: number;
    sleeves?: number;
  };
  fabric?: string;
  style?: string;
  additionalNotes?: string;
  additionalCost: number;
}

export interface HomeTrialDetails {
  trialPeriod: number; // days
  trialFee: number;
  deliveryDate: string;
  returnDate: string;
}