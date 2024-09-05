import prisma from "~/lib/prisma";
// import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {

  const email = getRouterParam(event, "email");
  console.log(email)

  const profile = await prisma.profile.findUnique({
    where: {
      email,
    },
  });
  return profile;
});
