'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/Alert';
import { InlineError } from '@/components/ui/ErrorDisplay';
import { validateThaiName } from '@/lib/validation';
import { cn } from '@/lib/cn';

export interface ThaiNameInputProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  showValidation?: boolean;
  className?: string;
}

interface ValidationState {
  isValid: boolean;
  error?: string;
}

function validate(value: string, field: 'firstName' | 'lastName'): ValidationState {
  const result = validateThaiName(value, field);
  return result.success ? { isValid: true } : { isValid: false, error: result.error.message };
}

interface NameFieldProps {
  id: 'firstName' | 'lastName';
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
  showSuccess: boolean;
  error?: string;
  onBlur: () => void;
}

function NameField({ id, label, placeholder, value, onChange, showError, showSuccess, error, onBlur }: NameFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} <span className="text-danger" aria-hidden="true">*</span>
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete="off"
          lang="th"
          className={cn(showSuccess && 'pr-11', showError && 'pr-4')}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : hintId}
        />
        {showSuccess && (
          <Check
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold"
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
      </div>
      {showError && error ? (
        <div id={errorId}>
          <InlineError message={error} />
        </div>
      ) : (
        <p id={hintId} className="text-[13px] text-fg-muted">ใช้ตัวอักษรไทยเท่านั้น</p>
      )}
    </div>
  );
}

/**
 * Thai Name Input Component
 *
 * Two text fields (ชื่อ / นามสกุล) with real-time validation: Thai characters
 * only (U+0E00–U+0E7F) plus spaces, at least two characters each. Errors are
 * Thai, shown after the field has been touched and `showValidation` is on.
 *
 * Requirements: 6.1, 6.6, 6.7, 9.6
 */
export function ThaiNameInput({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  showValidation = false,
  className
}: ThaiNameInputProps) {
  const [firstNameTouched, setFirstNameTouched] = React.useState(false);
  const [lastNameTouched, setLastNameTouched] = React.useState(false);

  const firstNameValidation = React.useMemo(() => validate(firstName, 'firstName'), [firstName]);
  const lastNameValidation = React.useMemo(() => validate(lastName, 'lastName'), [lastName]);

  const showFirstNameError = showValidation && firstNameTouched && !firstNameValidation.isValid;
  const showLastNameError = showValidation && lastNameTouched && !lastNameValidation.isValid;
  const showFirstNameSuccess = showValidation && firstNameTouched && firstNameValidation.isValid;
  const showLastNameSuccess = showValidation && lastNameTouched && lastNameValidation.isValid;

  return (
    <div className={cn('space-y-5', className)}>
      <NameField
        id="firstName"
        label="ชื่อ"
        placeholder="ระบุชื่อของคุณ"
        value={firstName}
        onChange={onFirstNameChange}
        onBlur={() => setFirstNameTouched(true)}
        showError={showFirstNameError}
        showSuccess={showFirstNameSuccess}
        error={firstNameValidation.error}
      />

      <NameField
        id="lastName"
        label="นามสกุล"
        placeholder="ระบุนามสกุลของคุณ"
        value={lastName}
        onChange={onLastNameChange}
        onBlur={() => setLastNameTouched(true)}
        showError={showLastNameError}
        showSuccess={showLastNameSuccess}
        error={lastNameValidation.error}
      />

      {showValidation && (!firstNameValidation.isValid || !lastNameValidation.isValid) && (
        <Alert tone="danger" role="alert">
          <div className="font-medium">กรุณาตรวจสอบข้อมูล</div>
          <ul className="mt-1 space-y-0.5 text-[13px]">
            {!firstNameValidation.isValid && <li>• {firstNameValidation.error}</li>}
            {!lastNameValidation.isValid && <li>• {lastNameValidation.error}</li>}
          </ul>
        </Alert>
      )}
    </div>
  );
}

/**
 * Hook to manage Thai name input state and validation
 *
 * @returns Object containing name values, setters, and validation state
 */
export function useThaiNameInput() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [showValidation, setShowValidation] = React.useState(false);

  const isValid = React.useMemo(() => {
    const firstNameResult = validateThaiName(firstName, 'firstName');
    const lastNameResult = validateThaiName(lastName, 'lastName');
    return firstNameResult.success && lastNameResult.success;
  }, [firstName, lastName]);

  const validate = React.useCallback(() => {
    setShowValidation(true);
    return isValid;
  }, [isValid]);

  const reset = React.useCallback(() => {
    setFirstName('');
    setLastName('');
    setShowValidation(false);
  }, []);

  return {
    firstName,
    lastName,
    setFirstName,
    setLastName,
    isValid,
    showValidation,
    validate,
    reset
  };
}
