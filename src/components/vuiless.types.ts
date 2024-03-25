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

export type TVuilessFieldRegisterFn = (name: string, validate: TVuilessFieldValidator) => void