# Vuiless Forms

Vuiless Forms is a Vue.js library designed to facilitate form management, including validation and submission, in a UI-agnostic way. It empowers developers to integrate complex form logic and validation into their Vue applications without being tied to any specific UI framework or component library. By focusing on the logic and state management of forms, Vuiless Forms ensures that developers can use any UI components they prefer, offering unparalleled flexibility and customization.

## Key Features

- **UI-Agnostic**: Works seamlessly with any UI components or libraries.
- **Comprehensive Validation**: Supports a wide range of validation rules, including custom validations with access to the entire form data and context.
- **Dynamic Form Context**: Allows passing dynamic context to forms for advanced validation scenarios.
- **Flexible Validation Triggers**: Offers multiple strategies for when validations are triggered, including on change, on blur, on submit.
- **Slot-Based Composition**: Utilizes Vue's slot mechanism for maximum flexibility in input and error display.

## Installation

You can install Vuiless Forms using npm or yarn:

```bash
npm install vuiless-forms
# or
yarn add vuiless-forms
```

## Usage

Below is a step-by-step guide on how to use Vuiless Forms in your Vue application.

### Step 1: Define the Form Structure and Validation Rules

First, we'll set up our component with the necessary imports and define the form's structure, context, and validation rules.

```typescript
<script setup lang="ts">
import { ref } from 'vue';
import { VuilessForm, VuilessField } from 'vuiless-forms';
import { isRequired, isEmail, min, max, phoneNumberValidator } from './validationRules';

interface FormData {
  name: string;
  email: string;
  phone: string;
  participateInWorkshops: boolean;
  workshopDetails: string;
}

const formData = ref<FormData>({
  name: '',
  email: '',
  phone: '',
  participateInWorkshops: false,
  workshopDetails: '',
});

const formContext = ref({
  country: 'US', // Default country code, could be dynamically set
});

const rules = {
  isRequired,
  isEmail,
  min,
  max,
  phoneNumber: (value: string, formData: FormData, context: { country: string }) => phoneNumberValidator(value, context.country),
  workshopDetailsRequired: (value: string, formData: FormData) => formData.participateInWorkshops ? isRequired(value) : true,
};
</script>
```

### Step 2: Implement the Form in the Template

Next, we'll use `VuilessForm` and `VuilessField` in the template, incorporating our validation rules and leveraging slots for custom input components.

```html
<template>
  <VuilessForm
    :form-data="formData"
    :form-context="formContext"
    first-validation="on-change"
    @submit="handleSubmit"
    v-slot="form">

    <VuilessField
        v-model="formData.name"
        :rules="[rules.isRequired]"
        v-slot="field">
      <label for="name">Name</label>
      <input id="name"
        name="name"
        v-model="formData.name"
        placeholder="Name"
        @blur="field.onBlur"
        :class="{ error: !!field.error }">
      <div v-if="field.error">{{ field.error }}</div>
    </VuilessField>

    <VuilessField
        v-model="formData.email"
        :rules="[rules.isRequired, rules.isEmail]"
        v-slot="field">
      <label for="email">Email</label>
      <input
        id="email"
        name="email"
        v-model="formData.email"
        placeholder="Email"
        @blur="field.onBlur"
        :class="{ error: !!field.error }">
      <div v-if="field.error">{{ field.error }}</div>
    </VuilessField>

    <VuilessField
        v-model="formData.phone"
        :rules="[rules.phoneNumber]"
        v-slot="field">
      <label for="phone">Phone</label>
      <input
        id="phone"
        name="phone"
        v-model="formData.phone"
        placeholder="Phone"
        @blur="field.onBlur"
        :class="{ error: !!field.error }">
      <div v-if="field.error">{{ field.error }}</div>
    </VuilessField>

    <VuilessField
        v-model="formData.participateInWorkshops"
        v-slot="field">
      <input
        type="checkbox"
        id="workshops"
        name="workshops"
        v-model="formData.participateInWorkshops">
      <label for="workshops">Participate in workshops?</label>
    </VuilessField>

    <VuilessField
        v-model="formData.workshopDetails"
        :rules="[rules.workshopDetailsRequired]"
        v-slot="field">
      <label for="workshopDetails">Workshop Details</label>
      <textarea
        id="workshopDetails"
        name="workshopDetails"
        v-model="formData.workshopDetails"
        placeholder="Workshop Details"
        @blur="field.onBlur"
        :class="{ error: !!field.error }"></textarea>
      <div v-if="field.error">{{ field.error }}</div>
    </VuilessField>

    <button type="submit">Register</button>

    <div class="buttons">
      <button type="button" @click="form.clearErrors">Clear Errors</button>
      <button type="button" @click="form.reset">Reset</button>
    </div>
  </VuilessForm>
</template>
```

#### Explanation

- **Field Validation and Error Handling**: Each `VuilessField` component uses the `v-slot` directive to access its current state, including any validation errors. This allows for dynamic class binding (`:class="{ error: !!field.error }"`) to visually indicate fields with validation errors and display error messages directly below the inputs.
- **Form Control Buttons**: Within the `VuilessForm`'s slot, we access form-level methods (`clearErrors` and `reset`) provided by the `v-slot="form"` directive. These methods are used to clear validation errors and reset the form, respectively, enhancing user interaction by allowing users to easily correct mistakes or start over.

#### Additional Notes

- **Styling for Error State**: The example assumes you have CSS styles defined for the `.error` class to visually indicate error states on inputs. Ensure you include appropriate CSS to make use of this functionality.
- **Form Submission**: The `handleSubmit` method should be defined within your `<script setup>` to process the form submission, such as sending the data to a server or performing client-side logic.

This approach leverages the full capabilities of the Vuiless Forms library, providing a rich, interactive form experience that handles validation feedback and user actions gracefully.

### Step 3: Define the Submission Handler and Additional Logic

Finally, we'll add a submission handler and any additional logic required for the form. This might include API calls, form reset functionality, or handling form state changes based on user input.

```typescript
function handleSubmit(formData: FormData) {
  console.log('Submitting form data:', formData);
  // Here you would typically send the form data to a server or perform other actions based on the form submission.
}
```

### Validation Rules Implementation

Here's a brief look at how some of the custom validation rules might be implemented, including a country-specific phone number validator as an example.

```typescript
// validationRules.ts
export function isRequired(value: string): boolean | string {
  return !!value || 'This field is required.';
}

export function isEmail(value: string): boolean | string {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) || 'Invalid email address';
}

export function min(length: number) {
  return (value: string) => value.length >= length || `Minimum length is ${length}`;
}

export function max(length: number) {
  return (value: string) => value.length <= length || `Maximum length is ${length}`;
}

export function phoneNumberValidator(phone: string, country: string): boolean | string {
  // Placeholder for actual phone number validation logic, which would vary by country
  return phone.length > 0 || 'Phone number is required'; // Simplified example
}
```

## Advanced Usage

### Dynamic Validation Context

The `form-context` prop allows you to pass dynamic context to your validation rules. This is particularly useful for conditional validations based on other parts of the form data or external state.

### Validation Triggers

The `first-validation` prop controls when validations are first triggered:

- `"on-change"`: Validates each field as soon as its value changes.
- `"touched-on-blur"`: Validates a field once it has been changed and lost focus.
- `"on-blur"`: Validates a field when it loses focus, regardless of whether its value has changed.
- `"on-submit"`: Delays all validations until the form is submitted.
- `"none"`: Disables automatic validation.

After the first validation trigger, subsequent validations for a field occur on every change to ensure the user receives immediate feedback as they correct errors.

## Contributing

Contributions to Vuiless Forms are welcome! Feel free to submit pull requests or create issues for bugs, feature requests, or documentation improvements.

## License

Vuiless Forms is open-sourced software licensed under the [MIT license](./LICENSE).
