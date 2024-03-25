<script setup lang="ts" generic="TFormData, TContext">
import { provide, ref, computed, nextTick } from 'vue'
import type { TVuilessInsights, TVuilessFieldValidator, TVuilessFieldRegisterFn, TVuilessState } from './vuiless.types'

type Props = {
    formData: TFormData         // form data
    formContext?: TContext      // form context, can be used in validations logic
    insights?: TVuilessInsights // for debugging
    firstValidation?: TVuilessState<TFormData, TContext>['firstValidation']
}

const props = withDefaults(defineProps<Props>(), {
    firstValidation: 'on-change',
})

// registry of fields
const registry: Record<string, { validate: TVuilessFieldValidator, reset: () => void }> = {}

const register: TVuilessFieldRegisterFn = (fieldName: string, fieldCallbacks: {
    validate: TVuilessFieldValidator
    reset: () => void
}) => {
    registry[fieldName as string] = fieldCallbacks
}

const firstSubmitHappened = ref(false)

const vuiless = computed(() => ({
    firstSubmitHappened,
    firstValidation: props.firstValidation,
    register,
    formData: props.formData,
    formContext: props.formContext,
    insights: props.insights,
}))

provide('vuiless', vuiless)

const emit = defineEmits<{
    (e: 'submit', data: TFormData): void
}>()

function resetValidations() {
    firstSubmitHappened.value = false
    for (const fieldCallbacks of Object.values(registry)) {
        fieldCallbacks.reset()
    }
}

async function clearFields() {
    for (const key of Object.keys(registry)) {
        delete props.formData[key as keyof typeof props.formData]
    }
    await nextTick()
    resetValidations()
}

function onSubmit() {
    firstSubmitHappened.value = true
    let hasErrors = false
    for (const [field, r] of Object.entries(registry)) {
        if (r.validate() !== true) {
            hasErrors = true
        }
    }
    if (hasErrors) {
        // the form has errors
        return
    }
    // checks passed, firing submit
    emit('submit', props.formData)
}
</script>

<template>

<form @submit.prevent="onSubmit">
    <div>{{ firstValidation }}</div>
    <slot
        :reset-validations="resetValidations"
        :clear-fields="clearFields"
    ></slot>
</form>

</template>