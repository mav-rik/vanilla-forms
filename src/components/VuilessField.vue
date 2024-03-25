<script setup lang="ts" generic="TValue, TFormData, TContext">
import { inject, ref, watch, computed } from 'vue'
import type { TVuilessRule, TVuilessInsights, TVuilessFieldRegisterFn } from './vuiless.types'

type Props = {
    name: keyof TFormData
    rules?: TVuilessRule<TValue, TFormData, TContext>[]
}

const props = defineProps<Props>()

const data = inject<TFormData>('vuiless-form-data')
const context = inject<TContext>('vuiless-form-context')
const insights = inject<TVuilessInsights>('vuiless-form-insights')
const register = inject<TVuilessFieldRegisterFn>('vuiless-form-register')

// submitError stores error when the field is not
// yet touched, but submit button is clicked
const submitError = ref<string>()

// registering field in form
if (register) {
    register(props.name as string, () => {
        submitError.value = validate()
        return submitError.value || true
    })
}

const touched = ref(false)
const value = computed<TValue>(() => data?.[props.name] as TValue)

watch([value], () => {
    submitError.value = undefined
    touched.value = true
})

function validate() {
    if (props.rules?.length) {
        for (const rule of props.rules) {
            const result = rule(value.value, data, context)
            if (result !== true) {
                return result || 'Wrong value'
            }
        }
    }
}

const error = computed<string | undefined>(() => {
    if (touched.value || submitError.value) {
        return validate()
    }
})

// processing insights if provided
if (insights) {
    watch([touched], () => {
        insights.touched = insights.touched || []
        if (insights.touched.findIndex(t => t === props.name) < 0) {
            insights.touched.push(props.name as string)
        }
    })
    watch([error], () => {
        insights.errors = insights.errors || {}
        insights.errors[props.name as string] = error.value || ''
    })
}
</script>

<template>
<slot
    :error="error"
>
</slot>
</template>
