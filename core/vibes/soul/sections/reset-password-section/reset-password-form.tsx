'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint } from '@conform-to/zod';
import { useTranslations } from 'next-intl';
import { ReactNode, startTransition, useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { PasswordComplexitySettings } from '@/vibes/soul/form/dynamic-form/schema';
import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Button } from '@/vibes/soul/primitives/button';
import { parseWithZodTranslatedErrors } from '~/i18n/utils';

import { resetPasswordErrorTranslations, resetPasswordSchema } from './schema';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export type ResetPasswordAction = Action<
  { lastResult: SubmissionResult | null; successMessage?: string },
  FormData
>;

interface Props {
  action: ResetPasswordAction;
  customerEntityId: number;
  token: string;
  submitLabel?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
  passwordComplexitySettings?: PasswordComplexitySettings | null;
}

export function ResetPasswordForm({
  action,
  customerEntityId,
  token,
  newPasswordLabel = 'New password',
  confirmPasswordLabel = 'Confirm Password',
  submitLabel = 'Update',
  passwordComplexitySettings,
}: Props) {
  const t = useTranslations('Auth.ChangePassword');
  const errorTranslations = resetPasswordErrorTranslations(t, passwordComplexitySettings);
  const schema = resetPasswordSchema(passwordComplexitySettings, errorTranslations);
  const [{ lastResult, successMessage }, formAction] = useActionState(action, {
    lastResult: null,
  });
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => {
        formAction(formData);
      });
    },
    onValidate({ formData }) {
      return parseWithZodTranslatedErrors(formData, { schema, errorTranslations });
    },
  });

  const passwordField = fields.password;
  const confirmPasswordField = fields.confirmPassword;

  if (!passwordField || !confirmPasswordField) {
    return null;
  }

  return (
    <form {...getFormProps(form)} className="space-y-5">
      <input name="customerEntityId" type="hidden" value={customerEntityId} />
      <input name="token" type="hidden" value={token} />
      <Input
        {...getInputProps(passwordField, { type: 'password' })}
        autoComplete="new-password"
        errors={passwordField.errors}
        key={passwordField.id}
        label={newPasswordLabel}
      />
      <Input
        {...getInputProps(confirmPasswordField, { type: 'password' })}
        autoComplete="new-password"
        className="mb-6"
        errors={confirmPasswordField.errors}
        key={confirmPasswordField.id}
        label={confirmPasswordLabel}
      />
      <SubmitButton>{submitLabel}</SubmitButton>
      {form.errors?.map((error, index) => (
        <FormStatus key={index} type="error">
          {error}
        </FormStatus>
      ))}
      {form.status === 'success' && successMessage != null && (
        <FormStatus>{successMessage}</FormStatus>
      )}
    </form>
  );
}

function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} size="small" type="submit" variant="secondary">
      {children}
    </Button>
  );
}
