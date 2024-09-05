<script setup lang="ts">
import type { Ref } from 'vue';
import type { GroupInfo } from "~/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ref, computed, onMounted } from "vue";
import { downloadContent, formatBytes, shortenFileName } from "~/lib/utils";
import { useRouter } from 'vue-router';

// Define the Profile type
interface Profile {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updateAt: Date;
}

// Define props for the component
const props = defineProps<{
  group: GroupInfo;
  email: string;
}>();

// Emit event for parent component
const emit = defineEmits(['user-clicked']);

// Use the Vue router
const router = useRouter();

// Reactive variable to store all profiles
const profiles: Ref<Profile[]> = ref([]);

// Reactive variable to track online status
const onlineUsers: Ref<{ [key: string]: boolean }> = ref({});

// Fetch all profiles on component mount
onMounted(async () => {
  try {
    const { data } = await useFetch<Profile[]>('/api/profile/getAllProfiles', {
      method: 'GET',
    });

    if (data.value) {
      profiles.value = data.value;
    } else {
      console.error('Failed to fetch profiles: No data returned');
    }
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
  }

});

/**
 * Handle creating a new group with the clicked user
 * @param {Profile} clickedProfile - The profile of the user that was clicked
 */
async function createGroupWithUser(clickedProfile: Profile) {
  try {
    // Emit the email of the clicked user
    emit('user-clicked', clickedProfile.email);

    console.log(clickedProfile)

    // Check if the user's email is available via props
    if (!props.email) {
      console.error('User email is missing.');
      return;
    }

    // Use the current user's email from props directly
    const response = await $fetch('/api/group/create', {
      method: 'POST',
      body: {
        userEmails: [props.email, clickedProfile.email],
        groupName: `Chat with ${clickedProfile.name}`,
        profileId: props.email, // Using the email as a unique identifier for the group creator
      },
    });

    if (response.success) {
      // Navigate to the newly created group
      router.push(`/group/${response.group.id}`);
    } else {
      console.error('Failed to create group:', response.message);
    }
  } catch (error) {
    console.error('Error creating group:', error);
  }
}
</script>

<template>
  <aside class="w-[20rem] sticky top-0 h-screen border space-y-3 overflow-hidden flex-shrink-0 hidden lg:block">
    <div class="p-3 border-b">
      <h2 class="font-bold text-sm">Group Info</h2>
    </div>
    <div class="flex flex-col items-center justify-center space-y-1 py-3 border-b">
      <Avatar class="size-20">
        <AvatarImage :src="props?.group?.imageUrl!" :alt="props?.group?.name" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div class="text-center">
        <h4 class="font-bold">{{ props?.group?.name }}</h4>
        <p class="text-sm text-muted-foreground">
          {{ props?.group?.members.length! > 1 ? `${props?.group?.members.length} Members` : `${props?.group?.members.length} Member` }}
        </p>
      </div>
    </div>
    <div class="px-3 border-b pb-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Icon name="solar:chat-round-line-linear" />
          <p class="text-sm font-semibold">Description</p>
        </div>
        <p class="text-xs">
          {{ props?.group?.bio }}
        </p>
      </div>
    </div>
    <div class="px-3 border-b pb-5">
      <div>
        <div class="flex items-center">
          <div class="flex items-center gap-2">
            <Icon name="solar:video-frame-play-horizontal-broken" />
            <p class="text-sm font-semibold">Media</p>
          </div>
          <Button variant="link" class="ml-auto text-xs">View All</Button>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="media in limitedMedias"
            :key="media.id"
            class="aspect-square rounded-md relative group"
          >
            <NuxtImg
              :src="media.imageUrl"
              class="w-full h-full object-cover rounded-md group-hover:opacity-45 group-hover:grayscale"
              :alt="media.name"
            />
            <Button
              @click="
                downloadContent({
                  name: media.name,
                  url: media.imageUrl,
                })
              "
              variant="ghost"
              size="icon"
              class="ml-auto hidden group-hover:block absolute top-1 right-0 hover:bg-transparent"
            >
              <Icon
                name="solar:download-minimalistic-bold"
                class="size-5 group-hover:animate-bounce"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="px-3 border-b pb-4">
      <div class="flex items-center">
        <div class="flex items-center gap-2">
          <Icon name="solar:users-group-rounded-bold" />
          <p class="text-sm font-semibold">Contacts</p>
        </div>
      </div>
      <div class="mt-3 space-y-2" style="height: 10rem; overflow: auto;">
        <div
          v-for="profile in profiles"
          :key="profile.id"
          class="flex items-center gap-3 p-2 rounded-md hover:bg-muted-foreground cursor-pointer"
          @click="createGroupWithUser(profile)"
        >
          <Avatar class="size-8">
            <AvatarImage :src="profile.imageUrl" :alt="profile.name" />
            <AvatarFallback>{{ profile.name.charAt(0) }}</AvatarFallback>
          </Avatar>
          <div>
            <p class="font-bold">{{ profile.name }}</p>
            <p class="text-xs text-muted-foreground">{{ profile.email }}</p>
          </div>
          <!-- Online status indicator -->
          <div :class="{'bg-green-500': onlineUsers[profile.id], 'bg-gray-300': !onlineUsers[profile.id]}" class="w-2 h-2 rounded-full"></div>
        </div>
      </div>
    </div>
    <div class="px-3 pb-4 space-y-2">
      <div class="flex items-center">
        <div class="flex items-center gap-2">
          <Icon name="solar:notification-unread-lines-linear" />
          <p class="text-sm font-semibold">Files</p>
        </div>
        <Button variant="link" class="ml-auto text-xs">View All</Button>
      </div>
      <div class="space-y-2">
        <div
          v-for="file in limitedFiles"
          class="flex items-center gap-3 group border px-2 py-1 rounded-md bg-secondary"
        >
          <Icon name="solar:notification-unread-lines-linear" class="size-8" />
          <div>
            <p class="text-xs font-bold">{{ shortenFileName(file.name) }}</p>
            <div class="text-xs text-muted-foreground flex items-center gap-1">
              <p>{{ formatBytes(file.size) }}</p>
              <div class="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <p>{{ useTimeAgo(file.createdAt) }}</p>
            </div>
          </div>
          <Button
            @click="
              downloadContent({
                name: file.name,
                url: file.fileUrl,
              })
            "
            variant="ghost"
            size="icon"
            class="ml-auto"
          >
            <Icon
              name="solar:download-minimalistic-bold"
              class="size-5 group-hover:animate-bounce"
            />
          </Button>
        </div>
      </div>
    </div>
  </aside>
</template>
