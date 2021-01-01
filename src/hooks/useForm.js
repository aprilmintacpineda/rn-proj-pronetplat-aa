import React from 'react';
import useState from './useState';
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
  const {
    state: {
      responseData,
      formContext,
      formValues,
      formErrors,
      status,
      targetRecordId,
      previousFormValues,
      isTouched
    },
    updateState
  } = useState(() => ({
    responseData: null,
    previousFormValues: { ...initialFormValues },
    formValues: { ...initialFormValues },
    formErrors: {},
    formContext: { ...initialFormContext },
    status: 'initial',
    targetRecordId: null,
    isTouched: false
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

  const setEditMode = React.useCallback(
    callback => {
      updateState(oldState => {
        const {
          formValues = oldState.formValues,
          targetRecordId = null,
          formContext = oldState.formContext
        } = callback({
          formValues: oldState.formValues,
          formContext: oldState.formContext
        });

        return {
          previousFormValues: { ...formValues },
          formContext,
          formValues,
          targetRecordId,
          formErrors: {},
          isTouched: true
        };
      });
    },
    [updateState]
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
              newFormErrors[field] = validateField(field, newFormValues);
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

  const confirmSubmit = React.useCallback(async () => {
    try {
      let responseData = null;

      if (onBeforeSubmitEffect) await onBeforeSubmitEffect({ formValues, formContext });

      if (onSubmit) {
        responseData = await onSubmit({ formValues, formContext });
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
          ? await transformInput({ formValues, formContext })
          : formValues;
        const response = await xhr(path, { body, method });
        if (!ignoreResponse) responseData = await response.json();
      }

      if (onSubmitSuccess) {
        onSubmitSuccess({
          responseData,
          formValues,
          formContext,
          setContext,
          operation,
          isUpdate
        });
      }

      updateState({
        status: 'submitSuccess',
        isTouched: true,
        responseData: ignoreResponse ? null : responseData
      });
    } catch (error) {
      console.error('useForm confirmSubmit', error);

      if (onSubmitError)
        await onSubmitError({ error, formValues, formContext, setContext });

      updateState({
        status: 'submitError',
        isTouched: true
      });
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
    isUpdate,
    updateState
  ]);

  const cancelSubmit = React.useCallback(() => {
    updateState({
      status: 'submitCancelled',
      isTouched: true
    });
  }, [updateState]);

  const submitHandler = React.useCallback(
    async ev => {
      try {
        if (ev && ev.preventDefault) ev.preventDefault();
        if (isSubmitting) return;
        if (validateForm()) return;

        updateState({
          status: 'submitting',
          isTouched: true
        });

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
            updateState({
              status: 'submitConfirmError',
              isTouched: true
            });
          }
        } else {
          confirmSubmit();
        }
      } catch (error) {
        console.error('useForm submitHandler', error);

        if (onSubmitError)
          await onSubmitError(error, { formValues, formContext, setContext });

        updateState({
          status: 'submitError',
          isTouched: true
        });
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
      targetRecordId,
      updateState
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
    updateState({
      previousFormValues: { ...initialFormValues },
      formValues: { ...initialFormValues },
      formErrors: {},
      formContext: { ...initialFormContext },
      status: 'initial',
      isTouched: false
    });
  }, [initialFormValues, initialFormContext, updateState]);

  const setForm = React.useCallback(
    ({ formValues = null, formContext = null, formErrors = null }) => {
      updateState(oldState => ({
        formValues: formValues || oldState.formValues,
        formContext: formContext || oldState.formContext,
        formErrors: formErrors || oldState.formErrors,
        isTouched: true
      }));
    },
    [updateState]
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
    isTouched,
    stayDisabledOnSuccess
  };
}

export default useForm;
