<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const name = ref('');
const error = ref('');
const router = useRouter();

async function handleSubmit() {
  if (!email.value || !name.value) {
    error.value = 'Please enter both email and name.';
    return;
  }

  try {
    const response = await $fetch('/api/profile/create', {
      method: 'POST',
      body: {
        email: email.value,
        name: name.value,
        imageUrl: 'https://example.com/default-avatar.png',
      },
    });

    if (response?.id) {
      // Save email and name in sessionStorage
      sessionStorage.setItem('email', email.value);
      sessionStorage.setItem('name', name.value);

      // Redirect to group page with group ID
      router.push(`/group/${response.id}`);
    } else {
      error.value = 'Error: Could not fetch or create profile.';
    }
  } catch (err) {
    error.value = 'Error occurred during profile creation.';
    console.error(err);
  }
}
</script>

<template>
  <section class="relative">
    <div class="overflow-hidden pt-20 px-6">
      <div class="relative container px-4 mx-auto" style="height: 10rem;">
        <div class="flex flex-wrap -m-8">
          <div class="w-full">
            <input
              v-model="name"
              type="text"
              placeholder="Enter your name"
              class="border p-2 rounded w-full"
              style="color: black;"
            />
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="border p-2 rounded w-full mt-4"
              style="color: black;"
            />
            <button @click="handleSubmit" class="mt-4 p-2 bg-blue-500 text-white rounded">
              Enter Chat
            </button>
            <p v-if="error" class="text-red-500">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
