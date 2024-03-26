import type { MyForm } from "./form.type";

export function isRequired(v: string) {
  return !!v || "Required";
}

export function isEmail(v: string) {
  return (
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      v
    ) || "Incorrect email address"
  );
}

export function isNumber(v: string) {
  return !Number.isNaN(Number(v)) || "Wrong Number";
}

export function firstOrLastName(
  v: string,
  formData: MyForm | undefined,
  context: { nameIsRequired: boolean } | undefined
) {
  return (
    context?.nameIsRequired && (
    !!formData?.firstName || !!formData?.lastName || "Please enter first name or last name" ) || true
  );
}

export function min(n: number) {
  return (v: string) => (v?.length < n ? `Min length ${n}` : true);
}

export function max(n: number) {
  return (v: string) => (v?.length > n ? `Max length ${n}` : true);
}
