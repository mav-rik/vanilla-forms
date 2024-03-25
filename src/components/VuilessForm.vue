<script setup lang="ts" generic="TFormData, TContext">
import { provide } from 'vue'
import type { TVuilessInsights, TVuilessFieldValidator, TVuilessFieldRegisterFn } from './vuiless.types'

type Props = {
    data: TFormData         // form data
    context?: TContext      // form context, can be used in validations logic
    insights?: TVuilessInsights // for debugging
}

const props = defineProps<Props>()

// registry of fields
const registry: Record<string, { validate: TVuilessFieldValidator }> = {}

const register: TVuilessFieldRegisterFn = (name: string, validate: TVuilessFieldValidator) => {
    console.log('register ' + name)
    registry[name as string] = {
        validate,
    }
}

provide('vuiless-form-register', register)
provide('vuiless-form-data', props.data)
provide('vuiless-form-context', props.context)
provide('vuiless-form-insights', props.insights)

const emit = defineEmits<{
    (e: 'submit', data: TFormData): void
}>()

function onSubmit(event: Event) {
    event.preventDefault()
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
    emit('submit', props.data)
}
</script>

<template>

<form @submit="onSubmit">
    <slot></slot>
</form>

</template>