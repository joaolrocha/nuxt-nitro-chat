// server/api/profile/[profileId].get.ts
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Extract the profileId from the request parameters
  const profileId = getRouterParam(event, "profileId");

  console.log("Received profileId:", profileId); // Log the profileId received

  try {
    // Fetch the profile details using the profileId
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    console.log("Fetched profile:", profile); // Log the fetched profile

    // If the profile is not found, return a 404 error
    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: "Profile not found",
      });
    }

    // Return the profile details as the response
    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error.message); // Log any error that occurs
    // Handle any errors that occur during the fetch process
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
