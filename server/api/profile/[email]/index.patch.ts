// server/api/profile/[email]/index.patch.ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const { email } = event.context.params;
  const body = await readBody(event);

  // Ensure the email is provided
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required",
    });
  }

  // Validate if the online status is provided in the request body
  if (typeof body.online !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: "Online status (boolean) is required",
    });
  }

  // Update the online status of the profile
  const updatedProfile = await prisma.profile.update({
    where: {
      email,
    },
    data: {
      online: body.online,
    },
  });

  return {
    success: true,
    profile: updatedProfile,
  };
});
