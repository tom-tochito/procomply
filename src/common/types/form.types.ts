export interface FormState {
  error: string | null;
  success: boolean;
}

export interface FormStateWithData<T = unknown> extends FormState {
  data?: T;
}