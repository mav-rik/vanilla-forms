<script setup lang="ts" generic="TValue, TFormData, TContext">
import { inject, ref, watch, computed, toRefs } from 'vue'
import type { ComputedRef} from 'vue'
import type { TVuilessRule, TVuilessState } from './vuiless.types'

type Props = {
    name: keyof TFormData
    rules?: TVuilessRule<TValue, TFormData, TContext>[]
}

const props = defineProps<Props>()

const vuiless = inject<ComputedRef<TVuilessState<TFormData, TContext>>>('vuiless')

// submitError stores error when the field is not
// yet touched, but submit button is clicked
const submitError = ref<string>()

// registering field in form
if (vuiless?.value) {
    vuiless.value.register(props.name as string, {
        validate: () => {
            submitError.value = validate()
            return submitError.value || true
        },
        reset: () => {
            touched.value = false
            blur.value = false
        }
    })
}

const touched = ref(false)
const value = computed<TValue>(() => vuiless?.value?.formData?.[props.name] as TValue)

watch([value], () => {
    submitError.value = undefined
    touched.value = true
})

function validate() {
    if (props.rules?.length) {
        for (const rule of props.rules) {
            const result = rule(value.value, vuiless?.value?.formData, vuiless?.value?.formContext)
            if (result !== true) {
                return result || 'Wrong value'
            }
        }
    }
}

const isValidationActive = computed(() => {
    if (vuiless?.value?.firstValidation) {
        switch (vuiless.value.firstValidation) {
            case 'on-change':
                return vuiless.value.firstSubmitHappened.value || touched.value
            case 'touched-on-blur':
                return vuiless.value.firstSubmitHappened.value || blur.value && touched.value
            case 'on-blur':
                return vuiless.value.firstSubmitHappened.value || blur.value
            case 'on-submit':
                return vuiless.value.firstSubmitHappened.value
            case 'none':
                return false
        }
    }
    return false
})

const error = computed<string | undefined>(() => {
    if (isValidationActive.value || submitError.value) {
        console.log('error calculation', props.name, {
            isValidationActive: isValidationActive.value,
            submitError: submitError.value,
        })
        return validate()
    }
})

const blur = ref(false)

function onBlur() {
    blur.value = true
}

// processing insights if provided
if (vuiless?.value?.insights) {
    watch([touched], () => {
        vuiless.value.insights.touched = vuiless.value.insights.touched || []
        if (vuiless.value.insights.touched.findIndex(t => t === props.name) < 0) {
            vuiless.value.insights.touched.push(props.name as string)
        }
    })
    watch([error], () => {
        vuiless.value.insights.errors = vuiless.value.insights.errors || {}
        vuiless.value.insights.errors[props.name as string] = error.value || ''
    })
}
</script>

<template>
<slot
    :error="error"
    :on-blur="onBlur"
>
</slot>
</template>
