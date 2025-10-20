import { StaticImageData } from "next/image";

export interface PaymentInfo {
  token_symbol: string;
  blockchain: string;
  payment_address: string;
  receive_currency: string;
}

export interface CheckoutData {
  expire_time: string;
  order_currency: string;
  payment_info: PaymentInfo[];
  cregis_id: string;
}

export type PaymentStatus =
  | 'pending'
  | 'expired'
  | 'paid'
  | 'partial_paid'
  | 'overpaid'
  | 'refunded'
  | 'new'
  | 'paid_remain';

export interface PaymentStatusData {
  event_name: string;
  event_type: PaymentStatus;
  order_amount: string;
  paid_amount: string;
  order_currency: string;
  cregis_id: string;
  timestamp: number;
}

export type PaymentImages = {
  [key: string]: string | StaticImageData;
};

export interface NewAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCrypto?: Cryptocurrency | null;
}

export interface Step1FormProps {
  amount: string;
  setAmount: (amount: string) => void;
  selectedNetwork: string;
  setSelectedNetwork: (network: string) => void;
  selectedCrypto: Cryptocurrency | null;
  nextStep: () => void;
  toWallet: string; // Add this
  setToWallet: (address: string) => void; // Add this
}
export interface Step2ConfirmationProps {
  amount: string;
  selectedNetwork: string;
  selectedCrypto?: Cryptocurrency | null;
  paymentMethod: string;
  paymentImages: PaymentImages;
  selectedTab?: string;
  error: string | null;
  isProcessing: boolean;
  exchangeRate?: number;
  prevStep: () => void;
  handleContinueToPayment: () => void;
}

export interface Step3PaymentProps {
  amount: string;
  countdown: number;
  selectedCrypto?: Cryptocurrency | null;
  selectedNetwork: string;
  checkoutData: CheckoutData;
  cregisId: string;
  isLoading: boolean;
}

export interface Step4StatusProps {
  statusData: PaymentStatusData;
  onRetry: () => void;
  onClose: () => void;
}
export type NetworkInfo = {
  blockchain: string;
  logoUrl: string;
};
export type Cryptocurrency = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  networks?: NetworkInfo[];
  network: string
};

export interface Account {
  mt4_account: string;
  crm_account_id: number;
  accountname: string;
  email: string;
  currency: string;
  balance: string;
  credit: string;
  equity: string;
  group: string;
  leverage: string;
  margin: string;
  margin_level: string;
  margin_free: string;
  password: string;
  account_type: string;
  server_number: number;
  account_type_requested?: string;
}
export interface AccountDetails {
  status: string;
  status_code: string;
  data: {
    crm_account_id: number;
    accountname: string;
    email1: string;
    verification_status: string | null;
    account_bill_ads_general: {
      bill_city: string;
      bill_country: string;
      bill_state: string;
      bill_street: string;
    };
    tp_accounts_general_info: Account[];
  }[];
}

export interface TransferFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  method: 'between_accounts' | 'to_another_user';
}

export interface WithdrawFormProps {
  withdrawAmount: string;
  setWithdrawAmount: (val: string) => void;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  toWallet: string;
  setToWallet: (val: string) => void;
  fromAccount: string;
  setFromAccount: (val: string) => void;
  open: boolean,
  onOpenChange: (open: boolean) => void,
  selectedCrypto?: Cryptocurrency | null;
}