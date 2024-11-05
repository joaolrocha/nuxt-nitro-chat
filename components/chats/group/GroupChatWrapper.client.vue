<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { GroupInfo, SocketMessage } from "~/types";
import ChatHeader from "../messages/ChatHeader.vue";
import ChatMessages from "../messages/ChatMessages.vue";
import ChatInput from "../messages/ChatInput.vue";
import type { Profile } from "@prisma/client";

// Define the props that this component accepts, which includes the group information and user email
const props = defineProps<{
  group: GroupInfo;
  email: string;
}>();

// Fetch the profile data for the given email address
const { data: profileData } = await useFetch(`/api/profile/${props?.email}`, {
  method: "get",
});

// Compute the profile data from the fetched data
const profile = computed(() => {
  const dataProfile = profileData.value as any;
  return dataProfile ? (dataProfile as Profile) : null;
});

// Initialize the messages array to store chat messages
const messages = ref<SocketMessage[]>([]);

// Function to fetch chat messages from the server
const fetchMessages = async () => {
  const { data: groupData } = await useFetch(
    `/api/group/${props?.group?.id}/messages`
  );
  const groupMessageData = groupData.value as any;
  // Map the fetched messages to the SocketMessage structure
  const allMessages: SocketMessage[] = groupMessageData?.messages.map(
    (message: any) => ({
      user: {
        name: message.member.profile.name,
        imgUrl: message.member.profile.imageUrl,
        profileId: message.member.profile.id,
      },
      message: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        fileUrl: message.fileUrl,
        deleted: message.deleted,
        imageUrl: message.imageUrl,
      },
    })
  );
  // Store the messages in the reactive `messages` array
  messages.value = allMessages;
};

fetchMessages()


// Set up WebSocket connection to handle real-time messages
const { status, data, send, open, close } = useWebSocket(
  `ws://localhost:3001/api/websockets/${props?.group?.id}?profileId=${profile?.value?.id}`
);

// Watch for incoming WebSocket data and update the messages array
watch(data, (newValue: any) => {
  console.log("Received WebSocket data:", newValue);
  if (newValue && typeof newValue === "string") {
    try {
      const parsedValue = JSON.parse(newValue);
      console.log("Parsed WebSocket data:", parsedValue);
      if (parsedValue) {
        // Add the new message to the messages array
        messages.value.push({
          user: parsedValue.user || {},
          message: parsedValue.message || parsedValue.content || "",
        });
      } else {
        console.warn("Parsed data is missing required properties:", parsedValue);
      }
    } catch (e) {
      console.error("Failed to parse WebSocket data:", e);
    }
  } else {
    console.warn("Received data is not a string:", newValue);
  }
});
</script>

<template>
  <div class="w-full flex-col h-screen flex bg-[#f8ede2]">
    <!-- Chat header showing group info and WebSocket connection status -->
    <ChatHeader :group="props?.group" :status="status" />
    <!-- Chat messages area displaying the conversation -->
    <ChatMessages
      :socketMessages="messages"
      :id="group?.id as string"
      :profileId="profile?.id"
    />
    <!-- Chat input area for sending new messages -->
    <ChatInput :send="send" />
  </div>
</template>
