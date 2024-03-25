<script setup lang="ts" generic="TFormData, TContext">
import { provide } from 'vue'
import type { TVuilessInsights, TVuilessFieldValidator, TVuilessFieldRegisterFn } from './vuiless.types'

type Props = {
    data: TFormData
    context?: TContext
    insights?: TVuilessInsights
}

const props = defineProps<Props>()

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

function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    let hasErrors = false
    for (const [field, r] of Object.entries(registry)) {
        if (r.validate() !== true) {
            hasErrors = true
        }
    }
    if (hasErrors) {
        console.log('the form has errors')
        return
    }
    console.log('checks passed, firing submit')
    emit('submit', props.data)
}

</script>

<template>

<form @submit="onSubmit">
    <slot></slot>
</form>

</template>