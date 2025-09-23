// From components.schemas.PaymentInfo
export interface PaymentInfo {
  method: 'visa' | 'mobile_money';
  card_number?: string | null;
  phone_number?: string | null;
}

// From components.schemas.RegisterIn
export interface RegisterIn {
  name: string;
  email: string;
  password: string;
  payment: PaymentInfo;
}

// From components.schemas.LoginIn
export interface LoginIn {
  email: string;
  password: string;
}

// From components.schemas.UserOut
export interface UserOut {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

// From components.schemas.TokenOut
export interface TokenOut {
  access_token: string;
  token_type?: string;
}

// From components.schemas.ProjectCreate
export interface ProjectCreate {
  name: string;
  site_location_json?: object | null;
  currency?: string;
}

// From components.schemas.ProjectOut
export interface ProjectOut {
  id: number;
  name: string;
  site_location_json: object | null;
  currency: string;
  status: string;
  // Assuming these are available for UI, can be mocked if not
  owner?: string;
  updated_at?: string;
}

// From components.schemas.InputsCreate
export interface InputsCreate {
  payload_json: object;
}

// From components.schemas.InputsOut
export interface InputsOut {
  id: number;
  project_id: number;
  version: number;
  payload_json: object;
  created_at?: string;
}

// From components.schemas.CalcResultOut
export interface CalcResultOut {
  id: number;
  project_id: number;
  version: number;
  results_json: {
      dc_kw?: number;
      kwh_per_kwdc?: number;
      annual_kwh?: number;
      monthly_yield?: number[];
      financials?: {
        capex?: number;
        opex_per_year?: number;
        roi_years?: number;
      };
  };
  created_at?: string;
  notes?: string;
}

// From components.schemas.SocialLinkCreate
export interface SocialLinkCreate {
    platform: string;
    handle: string;
}

// From components.schemas.SocialLinkOut
export interface SocialLinkOut {
    id: number;
    platform: string;
    handle: string;
}


// From components.schemas.ValidationError
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// From components.schemas.HTTPValidationError
export interface HTTPValidationError {
  detail?: ValidationError[];
}

// From components.schemas.PaymentCheckoutIn
export interface PaymentCheckoutIn {
    provider: 'stripe' | 'mobile';
}