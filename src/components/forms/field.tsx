"use client";

import { cloneElement, type ReactElement } from "react";

/**
 * Form field wrapper. Owns the label, the aria-invalid /
 * aria-describedby contract, and the inline error message. The caller
 * passes the actual control (input, textarea, select) as a single child
 * so type-specific props (autoComplete, rows, options) stay at the call
 * site without being mediated through this component.
 *
 * The id and aria attributes are injected onto the child via
 * cloneElement, so the caller never has to thread `${formId}-name` and
 * `${formId}-name-error` strings by hand.
 */

export const inputClasses =
  "w-full rounded-2xl border-2 border-neutral-200 bg-background px-3 py-2 text-base text-primary-900 placeholder:text-neutral-400 focus:border-primary-700 focus:outline-none aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:border-red-600";

const labelClasses =
  "block font-heading text-sm font-semibold text-primary-900";

const errorClasses = "mt-1 text-sm text-red-700";

type FieldChildProps = {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

type FieldProps = {
  /** Stable per-form prefix from React.useId, ensures unique ids when the form renders twice on a page. */
  readonly formId: string;
  /** Field name, used to build `${formId}-${name}` and `${formId}-${name}-error`. */
  readonly name: string;
  readonly label: string;
  /** Validation error to render under the field. Falsy means the field passes. */
  readonly error?: string;
  /** Render an "(optional)" hint next to the label. */
  readonly optional?: boolean;
  readonly children: ReactElement<FieldChildProps>;
};

export function Field({
  formId,
  name,
  label,
  error,
  optional,
  children,
}: FieldProps) {
  const inputId = `${formId}-${name}`;
  const errorId = `${inputId}-error`;
  const hasError = !!error;
  return (
    <div>
      <label htmlFor={inputId} className={labelClasses}>
        {label}
        {optional && (
          <span className="font-normal text-neutral-500"> (optional)</span>
        )}
      </label>
      {cloneElement(children, {
        id: inputId,
        "aria-invalid": hasError ? true : undefined,
        "aria-describedby": hasError ? errorId : undefined,
      })}
      {hasError && (
        <p id={errorId} className={errorClasses}>
          {error}
        </p>
      )}
    </div>
  );
}
