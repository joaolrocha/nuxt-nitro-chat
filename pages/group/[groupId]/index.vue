<script setup lang="ts">
import ChatInfo from "~/components/chats/ChatInfo.vue";
import GroupChatWrapper from "~/components/chats/group/GroupChatWrapper.client.vue";
import { useRoute } from '#imports';
import { ref, computed, onMounted } from 'vue';
import type { GroupInfo } from "~/types";

definePageMeta({
  layout: "chat",
});

const { params } = useRoute();

// Fetch the group data using the groupId from the route params
const { data, error } = await useFetch(`/api/group/${params.groupId}/info`);



const emailTeste= sessionStorage.getItem('email')



const group = computed(() => {
  const groupData = data.value as any;
  return groupData ? (groupData as GroupInfo) : null;
});

// Reactive variable to store the email of the clicked user
const clickedUserEmail = ref<string | null>(null);

// Function to handle user click in ChatInfo and set the clicked email
function handleUserClick(email: string) {
  clickedUserEmail.value = email;
}
</script>

<template>
  <section class="w-full flex">
    <!-- Group chat for the logged-in user -->
    <GroupChatWrapper :group="group" :email="emailTeste" />

    <!-- Group chat for clicked user (dynamic) -->
    <!-- <GroupChatWrapper :group="group" :email="clickedUserEmail" v-if="clickedUserEmail" /> -->

    <!-- ChatInfo component -->
    <ChatInfo :group="group" :email="emailTeste" @user-clicked="handleUserClick" />
  </section>
</template>

