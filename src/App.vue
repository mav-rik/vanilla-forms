<script setup lang="ts">
import { ref } from 'vue'
import MyInput from './components/MyInput.vue'
import VuilessForm from './components/VuilessForm.vue'
import VuilessField from './components/VuilessField.vue'
import type { MyForm } from './form.type'
import * as rules from './rules'

const data = ref<MyForm>({
  firstName: '',
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

</script>

<template>
<div class="flex">

<div>
  <!-- form -->

  <h2>Form</h2>

  <VuilessForm
    :data
    :insights
    @submit="toSend = $event"
  >

    <VuilessField
      name="firstName"
      :rules="[rules.firstOrLastName]"
    >
      <template v-slot="meta">
        <MyInput
          label="First Name (Cross Checks)"
          v-model="data.firstName"
          :error="meta.error"
        />
      </template>
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
        />
      </template>
    </VuilessField>

    <button role="submit">Submit</button>

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
