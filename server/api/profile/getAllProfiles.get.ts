import prisma from "~/lib/prisma";
import { eventHandler } from 'h3';

export default eventHandler(async (event) => {
  try {
    // Fetch all profiles from the database
    const profiles = await prisma.profile.findMany();
    return profiles;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});
