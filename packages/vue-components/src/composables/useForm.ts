import { ref, reactive, computed } from 'vue';

interface FormOptions<T> {
  initialValues: T;
  onSubmit?: (values: T) => void | Promise<void>;
  validate?: (values: T) => Record<keyof T, string> | null;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export function useForm<T extends Record<string, any>>(options: FormOptions<T>) {
  const { initialValues, onSubmit, validate } = options;
  
  const state = reactive<FormState<T>>({
    values: { ...initialValues } as T,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true
  });
  
  // Computed property to determine if the form is valid
  const isValid = computed(() => {
    if (!validate) return true;
    
    const validationErrors = validate(state.values);
    return validationErrors === null || Object.keys(validationErrors).length === 0;
  });
  
  // Update state.isValid when isValid computed changes
  const updateIsValid = () => {
    state.isValid = isValid.value;
  };
  
  // Handle field changes
  const handleChange = (field: keyof T, value: any) => {
    state.values[field] = value;
    state.touched[field] = true;
    
    if (validate) {
      const validationErrors = validate(state.values);
      if (validationErrors) {
        state.errors = validationErrors;
      } else {
        state.errors = {};
      }
    }
    
    updateIsValid();
  };
  
  // Handle form submission
  const handleSubmit = async (e?: Event) => {
    if (e) {
      e.preventDefault();
    }
    
    // Mark all fields as touched
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    Object.keys(state.values).forEach(key => {
      allTouched[key as keyof T] = true;
    });
    state.touched = allTouched;
    
    // Validate all fields
    if (validate) {
      const validationErrors = validate(state.values);
      if (validationErrors) {
        state.errors = validationErrors;
        updateIsValid();
        return;
      } else {
        state.errors = {};
      }
    }
    
    // Submit if valid
    if (state.isValid && onSubmit) {
      try {
        state.isSubmitting = true;
        await onSubmit(state.values);
      } finally {
        state.isSubmitting = false;
      }
    }
  };
  
  // Reset form to initial values
  const resetForm = () => {
    state.values = { ...initialValues } as T;
    state.errors = {};
    state.touched = {};
    state.isSubmitting = false;
    updateIsValid();
  };
  
  // Set form values programmatically
  const setValues = (values: Partial<T>) => {
    state.values = { ...state.values, ...values };
    updateIsValid();
  };
  
  // Set field value programmatically
  const setFieldValue = (field: keyof T, value: any) => {
    state.values[field] = value;
    updateIsValid();
  };
  
  // Set field error programmatically
  const setFieldError = (field: keyof T, error: string) => {
    state.errors[field] = error;
    updateIsValid();
  };
  
  // Clear field error
  const clearFieldError = (field: keyof T) => {
    if (state.errors[field]) {
      delete state.errors[field];
    }
    updateIsValid();
  };
  
  // Initialize validity
  updateIsValid();
  
  return {
    ...state,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    setFieldValue,
    setFieldError,
    clearFieldError
  };
}