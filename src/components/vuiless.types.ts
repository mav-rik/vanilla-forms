import type { ComponentInstance, Ref } from 'vue'
export type TVuilessRule<TValue, TFormData, TContext> = (
  v: TValue,
  data?: TFormData,
  context?: TContext
) => boolean | string;

export type TVuilessFieldValidator = () => boolean | string;

export type TVuilessFieldCallbacks = {
    validate: TVuilessFieldValidator
    clearErrors: () => void
    reset: () => void
  }

export type TVuilessFieldRegisterFn = (instance: ComponentInstance<any>, fieldCallbacks: TVuilessFieldCallbacks) => void;

export type TVuilessState<TFormData, TContext> = {
  firstSubmitHappened: boolean;
  firstValidation:
    | "on-change"
    | "touched-on-blur"
    | "on-blur"
    | "on-submit"
    | "none";
  register: TVuilessFieldRegisterFn;
  unregister: (instance: ComponentInstance<any>) => void;
  formData: TFormData;
  formContext?: TContext;
};