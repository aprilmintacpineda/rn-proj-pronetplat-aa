import React from 'react';
import useState from 'hooks/useState';
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
    stayDisabledOnSuccess = false
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
      isTouched
    },
    updateState
  } = useState(() => {
    const formValues =
      initialFormValues.constructor === Function
        ? initialFormValues()
        : { ...initialFormValues };

    const formContext =
      initialFormContext &&
      initialFormContext.constructor === Function
        ? initialFormContext()
        : {};

    return {
      formValues,
      formContext,
      previousFormValues: formValues,
      formErrors: {},
      status: 'initial',
      isTouched: false,
      responseData: null
    };
  });

  const isInitial = status === 'initial';
  const isSubmitting = status === 'submitting';
  const isSubmitSuccess = status === 'submitSuccess';
  const isSubmitError = status === 'submitError';
  const disabled =
    isSubmitting || (isSubmitSuccess && stayDisabledOnSuccess);

  const validateField = React.useCallback(
    (field, values) => {
      const validator = validators[field];
      return validator ? validator(values) : '';
    },
    [validators]
  );

  const setField = React.useCallback(
    (field, value) => {
      updateState(({ formValues, formErrors }) => {
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
        formErrors: newFormErrors,
        isTouched: true
      });
    }

    return hasError;
  }, [initialFormValues, formValues, validateField, updateState]);

  const submitHandler = React.useCallback(
    async ev => {
      if (ev && ev.preventDefault) ev.preventDefault();

      try {
        if (isSubmitting) return;
        if (validateForm()) return;

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

          const response = await xhr(endPoint, {
            body,
            method: 'post'
          });

          if (!ignoreResponse) responseData = await response.json();
        }

        if (onSubmitSuccess) {
          onSubmitSuccess({
            responseData,
            formValues,
            formContext,
            setContext
          });
        }

        updateState({
          status: 'submitSuccess',
          isTouched: true,
          responseData: ignoreResponse ? null : responseData
        });
      } catch (error) {
        console.error('useForm confirmSubmit', error);

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
      transformInput
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
        stayDisabledOnSuccess
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export default React.memo(FormWithContext);
