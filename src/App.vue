<script setup lang="ts">
import { ref } from 'vue'
import MyInput from './components/MyInput.vue'
import VuilessForm from './components/VuilessForm.vue'
import VuilessField from './components/VuilessField.vue'
import type { MyForm } from './form.type'
import * as rules from './rules'

const data = ref<MyForm>({
  firstName: 'Vasia',
  lastName: '',
  email: '',
  phone: '',
})

const insights = ref<{
  errors?: Record<string, string>
  touched?: string[] 
}>({
  errors: {},
  touched: [],
})

const toSend = ref()

const fv = ref<'on-change'>('on-change')
</script>

<template>
<div class="flex">

<div>
  <!-- form -->

  <h2>Form</h2>

  <select v-model="fv">
    <option value="none">None</option>
    <option value="on-change">On Change</option>
    <option value="touched-on-blur">On Blur (Touched)</option>
    <option value="on-blur">On Blur</option>
    <option value="on-submit">On Submit</option>
  </select>
  <VuilessForm
    :form-data="data"
    :insights
    :form-context="{
      nameIsRequired: true,
    }"
    :first-validation="fv"
    @submit="toSend = $event"
  >
  
    <template v-slot="form">

    <button type="button" @click="form.resetValidations">Reset</button>

    <button type="button" @click="form.clearFields">Clear</button>

    <VuilessField
      name="firstName"
      :rules="[rules.firstOrLastName]"
    >
      <input v-model="data.firstName" hidden />
    </VuilessField>

    <VuilessField
      name="lastName"
      :rules="[rules.firstOrLastName]"
    >
      <template v-slot="meta">
        <MyInput
          label="Last Name (Cross Checks)"
          v-model="data.lastName"
          :error="meta.error"
          @blur="meta.onBlur"
        />
      </template>
    </VuilessField>

    <VuilessField
      name="email"
      :rules="[rules.isRequired, rules.isEmail]"
    >
      <template v-slot="meta">
        <MyInput
          label="Email"
          v-model="data.email"
          :error="meta.error"
          @blur="meta.onBlur"
        />
      </template>
    </VuilessField>

    <VuilessField
      name="phone"
      :rules="[rules.isRequired, rules.isNumber, rules.min(10), rules.max(12)]"
    >
      <template v-slot="meta">
        <MyInput
          label="Phone"
          v-model="data.phone"
          :error="meta.error"
          @blur="meta.onBlur"
        />
      </template>
    </VuilessField>

    <button role="submit">Submit</button>

    </template>

  </VuilessForm>
</div>

<div>
  <!-- data -->
  <h2>Data</h2>
  <pre style="font-size: 10px;">{{ data }}</pre>
</div>

<div>
  <!-- errors -->
  <h2>Errors</h2>
  <pre style="font-size: 10px;">{{ insights.errors }}</pre>
</div>

<div v-if="!!insights.touched?.length">
  <!-- touched -->
  <h2>Touched</h2>
  <pre style="font-size: 10px;">{{ insights.touched }}</pre>
</div>

<div v-if="!!toSend">
  <!-- sent form -->
  <h2>Sent form</h2>
  <pre style="font-size: 10px;">{{ toSend }}</pre>
</div>

</div>
</template>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.flex > div {
  flex: 1;
}
</style>
