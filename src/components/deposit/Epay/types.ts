export interface CreditStep1Props {
  amount: string;
  setAmount: (value: string) => void;
  selectedNetwork: string;
  nextStep: () => void;
  currency: string | undefined;
  setCurrency: (val: string) => void;
}

export interface CreditStep2Props {
  amount: string;
  paymentMethod: string;
  selectedTab?: string;
  error: string | null;
  isProcessing: boolean;
  exchangeRate?: number;
  prevStep: () => void;
  handleContinueToPayment: () => void;
  currency: string | undefined;
  setCurrency: (val: string) => void;
}

export interface CreditStep3Props {
  amount: string;
  countdown: number;
  // selectedCrypto?: Cryptocurrency | null;
  selectedNetwork: string;
  // checkoutData: CheckoutData;
  cregisId: string;
  isLoading: boolean;
}