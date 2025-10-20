export interface ApiResponse {
  status: string;
  status_code: string;
  object: {
    mt4_account: string;
    original_retention_owner: string;
    accountname: string;
    first_name: string;
    last_name: string;
    email: string;
    country: string;
    phone: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    crm_account_id: number;
    ip: string;
    lead_id: string;
    external_lead_id: string;
    registration_country: string;
    crm_tp_account_id: number;
    date_of_birth: string;
    ftd_date: string;
    id_type: string;
    national_number: string;
    currency: string;
    last_login: string;
    last_modified_date: string;
    balance: string;
    credit: string;
    equity: string;
    group: string;
    leverage: string;
    margin: string;
    margin_level: string;
    margin_free: string;
    password: string;
    account_type:string;
    server_number:number;
    account_type_requested?:string;
    nickname?:string;
    // If you need to allow additional dynamic properties:
    [key: string]: string | number | undefined; // More flexible index signature
  };
}