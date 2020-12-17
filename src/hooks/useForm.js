import React from 'react';
import { xhr } from 'libs/xhr';

function useForm ({
  initialFormContext = {},
  initialFormValues,
  endPoint = '',
  validators = {},
  validatorChains = null,
  onBeforeSubmitEffect = null,
  onSubmit = null,
  onSubmitError = null,
  onSubmitSuccess = null,
  transformInput = null,
  onBeforeSaveConfirm = null,
  ignoreResponse = false,
  stayDisabledOnSuccess = false
}) {
  const [
    {
      responseData,
      formContext,
      formValues,
      formErrors,
      status,
      targetRecordId,
      previousFormValues,
      touched
    },
    setState
  ] = React.useState(() => ({
    responseData: null,
    previousFormValues: { ...initialFormValues },
    formValues: { ...initialFormValues },
    formErrors: {},
    formContext: { ...initialFormContext },
    status: 'initial',
    targetRecordId: null,
    touched: false
  }));

  const isInitial = status === 'initial';
  const isSubmitting = status === 'submitting';
  const isSubmitSuccess = status === 'submitSuccess';
  const isSubmitError = status === 'submitError';
  const disabled = isSubmitting || isSubmitSuccess && stayDisabledOnSuccess;
  const operation = targetRecordId ? 'update' : 'others';
  const isUpdate = operation === 'update';

  const validateField = React.useCallback(
    (field, values) => {
      const validator = validators[field];
      return validator ? validator(values) : '';
    },
    [validators]
  );

  const setEditMode = React.useCallback(callback => {
    setState(oldState => {
      const {
        formValues = oldState.formValues,
        targetRecordId = null,
        formContext = oldState.formContext
      } = callback({
        formValues: oldState.formValues,
        formContext: oldState.formContext
      });

      return {
        ...oldState,
        previousFormValues: { ...formValues },
        formContext,
        formValues,
        targetRecordId,
        formErrors: {},
        touched: true
      };
    });
  }, []);

  const setField = React.useCallback(
    (field, value) => {
      setState(oldState => {
        const newFormValues = {
          ...oldState.formValues,
          [field]: value
        };

        const newFormErrors = {
          ...oldState.formErrors,
          [field]: validateField(field, newFormValues)
        };

        if (validatorChains) {
          const chain = validatorChains[field];

          if (chain) {
            chain.forEach(field => {
              newFormErrors[field] = validateField(field, newFormValues);
            });
          }
        }

        return {
          ...oldState,
          previousFormValues: { ...oldState.formValues },
          formValues: newFormValues,
          formErrors: newFormErrors,
          touched: true
        };
      });
    },
    [validateField, validatorChains]
  );

  const setContext = React.useCallback(newContext => {
    setState(oldState => ({
      ...oldState,
      touched: true,
      formContext: {
        ...oldState.formContext,
        ...newContext
      }
    }));
  }, []);

  const validateForm = React.useCallback(() => {
    let hasError = false;
    const newFormErrors = {};

    Object.keys(initialFormValues).forEach(field => {
      const error = validateField(field, formValues);
      if (error) hasError = true;
      newFormErrors[field] = error;
    });

    if (hasError) {
      setState(oldState => ({
        ...oldState,
        formErrors: newFormErrors,
        touched: true
      }));
    }

    return hasError;
  }, [initialFormValues, formValues, validateField]);

  const confirmSubmit = React.useCallback(async () => {
    try {
      let responseData = null;

      if (onBeforeSubmitEffect) await onBeforeSubmitEffect({ formValues, formContext });

      if (onSubmit) {
        responseData = await onSubmit({ formValues, formContext, setContext });
      } else {
        let method = null;
        let path = null;

        if (isUpdate) {
          method = 'patch';
          path = endPoint.replace(':id', targetRecordId);
        } else {
          method = 'post';
          path = endPoint.replace(':id', '');
        }

        const body = transformInput
          ? transformInput({ formValues, formContext })
          : formValues;
        const response = await xhr(path, { body, method });
        if (!ignoreResponse) responseData = await response.json();
      }

      if (onSubmitSuccess) {
        onSubmitSuccess({
          data: responseData,
          formValues,
          formContext,
          setContext,
          operation,
          isUpdate
        });
      }

      setState(oldState => ({
        ...oldState,
        status: 'submitSuccess',
        touched: true,
        responseData: ignoreResponse ? null : responseData
      }));
    } catch (error) {
      console.error('useForm confirmSubmit', error);

      if (onSubmitError)
        await onSubmitError({ error, formValues, formContext, setContext });

      setState(oldState => ({
        ...oldState,
        status: 'submitError',
        touched: true
      }));
    }
  }, [
    onSubmit,
    formValues,
    formContext,
    setContext,
    onSubmitError,
    onSubmitSuccess,
    transformInput,
    operation,
    targetRecordId,
    endPoint,
    ignoreResponse,
    onBeforeSubmitEffect,
    isUpdate
  ]);

  const cancelSubmit = React.useCallback(() => {
    setState(oldState => ({
      ...oldState,
      status: 'submitCancelled',
      touched: true
    }));
  }, []);

  const submitHandler = React.useCallback(
    async ev => {
      try {
        if (ev && ev.preventDefault) ev.preventDefault();
        if (isSubmitting) return;
        if (validateForm()) return;

        setState(oldState => ({
          ...oldState,
          status: 'submitting',
          touched: true
        }));

        if (onBeforeSaveConfirm) {
          const result = await onBeforeSaveConfirm({
            formValues,
            formContext,
            onConfirm: confirmSubmit,
            onCancel: cancelSubmit,
            operation,
            targetRecordId
          });

          if (!result) {
            setState(oldState => ({
              ...oldState,
              status: 'submitConfirmError',
              touched: true
            }));
          }
        } else {
          confirmSubmit();
        }
      } catch (error) {
        console.error('useForm submitHandler', error);

        if (onSubmitError)
          await onSubmitError(error, { formValues, formContext, setContext });

        setState(oldState => ({
          ...oldState,
          status: 'submitError',
          touched: true
        }));
      }
    },
    [
      validateForm,
      isSubmitting,
      confirmSubmit,
      formContext,
      formValues,
      onBeforeSaveConfirm,
      onSubmitError,
      setContext,
      cancelSubmit,
      operation,
      targetRecordId
    ]
  );

  const { onChangeHandlers } = React.useMemo(
    () =>
      Object.keys(initialFormValues).reduce(
        (accumulator, field) => ({
          onChangeHandlers: {
            ...accumulator.onChangeHandlers,
            [field]: value => {
              setField(field, value);
            }
          }
        }),
        {
          onChangeHandlers: {}
        }
      ),
    [initialFormValues, setField]
  );

  const resetForm = React.useCallback(() => {
    setState({
      previousFormValues: { ...initialFormValues },
      formValues: { ...initialFormValues },
      formErrors: {},
      formContext: { ...initialFormContext },
      status: 'initial',
      touched: false
    });
  }, [initialFormValues, initialFormContext]);

  const setForm = React.useCallback(
    ({ formValues = null, formContext = null, formErrors = null }) => {
      setState(oldState => ({
        ...oldState,
        formValues: formValues || oldState.formValues,
        formContext: formContext || oldState.formContext,
        formErrors: formErrors || oldState.formErrors,
        touched: true
      }));
    },
    []
  );

  return {
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
    isUpdate,
    disabled,
    submitHandler,
    setContext,
    setEditMode,
    operation,
    resetForm,
    setForm,
    responseData,
    touched,
    stayDisabledOnSuccess
  };
}

export default useForm;
