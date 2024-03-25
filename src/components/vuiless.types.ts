import type { Ref } from 'vue'
export type TVuilessRule<TValue, TFormData, TContext> = (
  v: TValue,
  data?: TFormData,
  context?: TContext
) => boolean | string;

export type TVuilessInsights = {
  errors?: Record<string, string>;
  touched?: string[];
}

export type TVuilessFieldValidator = () => boolean | string;

export type TVuilessFieldRegisterFn = (
  name: string,
  fns: {
    validate: TVuilessFieldValidator
    reset: () => void
  }
) => void;

export type TVuilessState<TFormData, TContext> = {
  firstSubmitHappened: Ref<boolean>;
  firstValidation:
    | "on-change"
    | "touched-on-blur"
    | "on-blur"
    | "on-submit"
    | "none";
  register: TVuilessFieldRegisterFn;
  formData: TFormData;
  formContext: TContext;
  insights: TVuilessInsights;
};