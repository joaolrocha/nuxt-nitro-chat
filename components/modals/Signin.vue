<script setup lang="ts">
import { navigateTo } from '#imports';
import { computed, ref } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useModalStore } from "~/stores/useModalStore";
import { Button } from "../ui/button";

const modalStore = useModalStore();

const isModalOpen = computed(() => {
  return modalStore?.type === "signin" && modalStore?.isOpen;
});

const onClose = () => {
  modalStore?.setIsOpen(false);
  modalStore?.onClose();
};

const username = ref("");
const password = ref("");

const signInWithCredentials = async () => {
  onClose();

  const payload = {
    username: username.value,
    password: password.value,
  };

  try {
    // Perform login and get the token
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: payload,
    });

    const tokenData = response?.token;

    if (tokenData?.accessToken) {
      // Fetch session data (mocked or real)
      const session = await $fetch('/api/auth/session');
      console.log('Session data:', session);

      // Retrieve the profile by email
      let profile = await $fetch(`/api/profile/${session.email}`, {
        method: "GET",
      });

      // If the profile doesn't exist, create it
      if (!profile) {
        console.log('Profile not found, creating new profile.');
        profile = await $fetch("/api/profile/create", {
          method: "POST",
          body: {
            name: session.name || 'John Doe',
            email: session.email || 'janedoe@gmail.com',
            imageUrl: session.imageUrl || 'https://example.com/johndoe.jpg',
          },
        });
      } else {
        console.log('Profile found:', profile);
      }

      // Now that we have the profile, check or create the group
      const group = await $fetch("/api/profile/create", {
        method: "POST",
        body: {
          name: profile?.name,
          email: profile?.email,
          imageUrl: profile?.imageUrl,
        },
      });

      console.log(group, 'grouppp')

      // Ensure the group ID is passed correctly to the redirection logic
      if (group?.id) {
        console.log('Redirecting to group:', group.id);
        await navigateTo(`/group/${group.id}`);
      } else {
        console.error('Group not found or creation failed');
      }
    } else {
      console.error('Login failed or no token received');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};

const signInWithGithub = async () => {
  onClose();
  // await signIn("github");
};

const signInWithGoogle = async () => {
  onClose();
  // await signIn("google");
};

</script>

<template>
  <Dialog :open="isModalOpen" @update:open="onClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle
          class="text-center text-3xl font-semibold tracking-tighter text-gray-900"
        >
          Nuxt Nitro Chat
        </DialogTitle>
        <DialogDescription class="text-center font-medium text-gray-500">
          Welcome to Nuxt Nitro Chat! 🚀 This Nuxt app uses experimental web
          sockets for real-time group chat in Nuxt.js. 💬✨
        </DialogDescription>
      </DialogHeader>

      <!-- Username and Password Fields -->
      <div class="mb-4">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="rounded-xl w-full h-12 px-5 py-3 mb-2"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="rounded-xl w-full h-12 px-5 py-3"
        />
      </div>

      <!-- Sign in with Credentials -->
      <Button
        @click="signInWithCredentials"
        class="rounded-xl w-full h-12 gap-3 px-5 py-3"
        type="button"
      >
        Sign in with Username & Password
      </Button>

      <!-- Other Sign-in Options -->
      <Button
        @click="signInWithGithub"
        class="rounded-xl w-full h-12 gap-3 px-5 py-3 mt-4"
        type="button"
        aria-label="Sign in with Github"
      >
        <Icon
          name="uiw:github"
          role="img"
          class="md hydrated size-5"
          aria-label="logo github"
        />
        <span>Sign in with Github</span>
      </Button>

      <Button
        @click="signInWithGoogle"
        class="rounded-xl w-full h-12 gap-3 px-5 py-3 mt-4"
        type="button"
        aria-label="Sign in with Google"
      >
        <Icon
          name="flowbite:google-solid"
          role="img"
          class="md hydrated size-5"
          aria-label="logo google"
        />
        <span>Sign in with Google</span>
      </Button>
    </DialogContent>
  </Dialog>
</template>
