import React from 'react';
import {
  showErrorPopup,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import useState from 'hooks/useState';
import { logEvent } from 'libs/logging';
import { xhr } from 'libs/xhr';

export const FormContext = React.createContext();

function FormWithContext ({
  formOptions: {
    initialFormContext = {},
    initialFormValues,
    endPoint = '',
    validators = {},
    validatorChains = null,
    onSubmit = null,
    onSubmitError = null,
    onSubmitSuccess = null,
    transformInput = null,
    ignoreResponse = false,
    stayDisabledOnSuccess = false,
    resetOnSuccess = false,
    formErrorMessages = {}
  },
  children
}) {
  const {
    state: {
      responseData,
      formContext,
      formValues,
      formErrors,
      status,
      previousFormValues,
      isTouched,
      targetId,
      originalFormValues
    },
    updateState
  } = useState(() => {
    const formContext =
      initialFormContext &&
      initialFormContext.constructor === Function
        ? initialFormContext()
        : {};

    const formValues =
      initialFormValues.constructor === Function
        ? initialFormValues(formContext)
        : { ...initialFormValues };

    return {
      originalFormValues: null,
      formValues,
      formContext,
      previousFormValues: formValues,
      formErrors: {},
      status: 'initial',
      isTouched: false,
      responseData: null,
      targetId: null
    };
  });

  const isInitial = status === 'initial';
  const isSubmitting = status === 'submitting';
  const isSubmitSuccess = status === 'submitSuccess';
  const isSubmitError = status === 'submitError';
  const isValidationFailed = status === 'formValidationFailed';
  const disabled =
    isSubmitting || (isSubmitSuccess && stayDisabledOnSuccess);

  const setUpdateMode = React.useCallback(
    ({ targetId, formValues, formContext }) => {
      updateState({
        originalFormValues: formValues,
        targetId,
        formValues,
        formContext
      });
    },
    [updateState]
  );

  const validateField = React.useCallback(
    (field, values) => {
      const validator = validators[field];
      return validator ? validator(values, formContext) : '';
    },
    [validators, formContext]
  );

  const formDidChange = React.useCallback(() => {
    if (!originalFormValues) return true; // can't detect, just return true

    const fieldChanged = Object.keys(formValues).find(field => {
      const newValue = formValues[field];
      const oldValue = originalFormValues[field];
      return (
        (newValue && newValue !== oldValue) ||
        (!newValue && oldValue)
      );
    });

    return Boolean(fieldChanged);
  }, [originalFormValues, formValues]);

  const setField = React.useCallback(
    (field, _value) => {
      updateState(({ formValues, formErrors, formContext }) => {
        const value =
          typeof _value === 'function'
            ? _value({ formValues, formContext })
            : _value;

        const newFormValues = {
          ...formValues,
          [field]: value
        };

        const newFormErrors = {
          ...formErrors,
          [field]: validateField(field, newFormValues)
        };

        if (validatorChains) {
          const chain = validatorChains[field];

          if (chain) {
            chain.forEach(field => {
              newFormErrors[field] = validateField(
                field,
                newFormValues
              );
            });
          }
        }

        return {
          previousFormValues: { ...formValues },
          formValues: newFormValues,
          formErrors: newFormErrors,
          isTouched: true
        };
      });
    },
    [validateField, validatorChains, updateState]
  );

  const setContext = React.useCallback(
    newContext => {
      updateState(({ formContext }) => ({
        isTouched: true,
        formContext: {
          ...formContext,
          ...newContext
        }
      }));
    },
    [updateState]
  );

  const validateForm = React.useCallback(() => {
    let hasError = false;
    const newFormErrors = {};

    Object.keys(initialFormValues).forEach(field => {
      const error = validateField(field, formValues);
      if (error) hasError = true;
      newFormErrors[field] = error;
    });

    if (hasError) {
      updateState({
        status: 'formValidationFailed',
        formErrors: newFormErrors,
        isTouched: true
      });

      return newFormErrors;
    }

    return false;
  }, [initialFormValues, formValues, validateField, updateState]);

  const submitHandler = React.useCallback(
    async ev => {
      if (ev && ev.preventDefault) ev.preventDefault();

      try {
        if (isSubmitting) return;

        const validationErrors = validateForm();

        if (validationErrors) {
          logEvent('formValidationFailed', {
            endPoint,
            errors: validationErrors
          });

          return;
        }

        if (!formDidChange()) {
          showErrorPopup({ message: 'No change to save.' });
          return;
        }

        updateState({
          status: 'submitting',
          isTouched: true
        });

        let responseData = null;

        if (onSubmit) {
          responseData = await onSubmit({ formValues, formContext });
        } else {
          const body = transformInput
            ? await transformInput({ formValues, formContext })
            : formValues;

          let finalEndpoint = '';
          let method = '';

          if (targetId) {
            finalEndpoint = endPoint.replace(/:targetId+/, targetId);
            method = 'patch';
          } else {
            finalEndpoint = endPoint.replace(/:targetId+/, '');
            method = 'post';
          }

          const response = await xhr(finalEndpoint, {
            body,
            method
          });

          if (!ignoreResponse) responseData = await response.json();
        }

        if (onSubmitSuccess) {
          onSubmitSuccess({
            responseData,
            formValues,
            formContext,
            setContext,
            targetId
          });
        }

        updateState(oldState => {
          return {
            status: 'submitSuccess',
            isTouched: !resetOnSuccess,
            responseData: ignoreResponse ? null : responseData,
            formValues:
              resetOnSuccess && !targetId
                ? initialFormValues.constructor === Function
                  ? initialFormValues()
                  : { ...initialFormValues }
                : oldState.formValues
          };
        });
      } catch (error) {
        console.log('FormwithContext submitHandler', error);
        showRequestFailedPopup(formErrorMessages[error.status]);

        if (onSubmitError) {
          await onSubmitError({
            error,
            formValues,
            formContext,
            setContext
          });
        }

        updateState({
          status: 'submitError',
          isTouched: true
        });
      }
    },
    [
      validateForm,
      isSubmitting,
      formContext,
      formValues,
      setContext,
      updateState,
      endPoint,
      ignoreResponse,
      onSubmit,
      onSubmitSuccess,
      onSubmitError,
      transformInput,
      initialFormValues,
      resetOnSuccess,
      targetId,
      formErrorMessages,
      formDidChange
    ]
  );

  const { onChangeHandlers } = React.useMemo(() => {
    const formValues =
      initialFormValues.constructor === Function
        ? initialFormValues()
        : initialFormValues;

    return Object.keys(formValues).reduce(
      (accumulator, field) => ({
        onChangeHandlers: {
          ...accumulator.onChangeHandlers,
          [field]: value => {
            setField(field, value);
          }
        }
      }),
      { onChangeHandlers: {} }
    );
  }, [initialFormValues, setField]);

  const resetForm = React.useCallback(() => {
    const formValues =
      initialFormValues.constructor === Function
        ? initialFormValues()
        : { ...initialFormValues };

    const formContext =
      initialFormContext &&
      initialFormContext.constructor === Function
        ? initialFormContext()
        : {};

    updateState({
      formValues,
      formContext,
      previousFormValues: formValues,
      formErrors: {},
      status: 'initial',
      isTouched: false,
      responseData: null
    });
  }, [initialFormValues, initialFormContext, updateState]);

  const setForm = React.useCallback(
    ({
      formValues = null,
      formContext = null,
      formErrors = null
    }) => {
      updateState(oldState => ({
        formValues: formValues || oldState.formValues,
        formContext: formContext || oldState.formContext,
        formErrors: formErrors || oldState.formErrors,
        isTouched: true
      }));
    },
    [updateState]
  );

  return (
    <FormContext.Provider
      value={{
        previousFormValues,
        formValues,
        formErrors,
        formContext,
        setField,
        onChangeHandlers,
        status,
        isSubmitting,
        isInitial,
        isSubmitSuccess,
        isSubmitError,
        disabled,
        submitHandler,
        setContext,
        resetForm,
        setForm,
        responseData,
        isTouched,
        stayDisabledOnSuccess,
        setUpdateMode,
        isValidationFailed
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export default React.memo(FormWithContext);
