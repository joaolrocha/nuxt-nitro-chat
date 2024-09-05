<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const name = ref('');
const error = ref('');

onBeforeMount(() => {
  const state = router.currentRoute.value.state;

  if (state?.email && state?.name) {
    email.value = state.email;
    name.value = state.name;

    // Instead of passing state, we pass as props in the path
    router.push({
      path: `/group/${state.groupId}`,
      query: {
        email: email.value,
        name: name.value,
      },
    });
  } else {
    error.value = 'Missing email or name.';
  }
});
</script>

<template>
  <section class="w-full flex flex-col items-center py-[10rem]">
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else class="flex flex-col items-center">
      <p>Email: {{ email }}</p>
      <p>Name: {{ name }}</p>
      <!-- Redirecting message -->
      <Loader class="size-16 animate-spin" />
      <p>Redirecting...!</p>
    </div>
  </section>
</template>
