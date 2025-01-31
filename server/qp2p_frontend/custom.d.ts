declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_PAYSTACK_PUBLIC_KEY: string;
    REACT_APP_API_BASE_URL: string;
    PAYSTACK_SECRET_KEY?: string;
  }
}
