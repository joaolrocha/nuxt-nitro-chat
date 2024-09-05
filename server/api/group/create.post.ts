// // server/api/group/create.post.ts
// import prisma from "~/lib/prisma";
// import { nanoid } from 'nanoid';

// export default defineEventHandler(async (event) => {
//   try {
//     const { userEmails, groupName, profileId } = await readBody(event);

//     // Check if a group with these two members already exists
//     const existingGroup = await prisma.group.findFirst({
//       where: {
//         members: {
//           every: {
//             profile: {
//               email: {
//                 in: userEmails,
//               },
//             },
//           },
//         },
//       },
//       include: {
//         members: true,
//       },
//     });

//     if (existingGroup) {
//       // If the group already exists, return it
//       return {
//         success: true,
//         group: existingGroup,
//       };
//     }

//     // Generate a unique invite code
//     let inviteCode: string = ""; // Initialize inviteCode as a string
//     let isUnique = false;

//     while (!isUnique) {
//       inviteCode = nanoid(10); // Generate a 10-character invite code
//       const existingCode = await prisma.group.findUnique({
//         where: { inviteCode },
//       });
//       if (!existingCode) {
//         isUnique = true;
//       }
//     }

//     // Fetch the Profile using the profileId or email
//     const creatorProfile = await prisma.profile.findUnique({
//       where: { email: profileId }, // Assuming profileId is actually the email here
//     });

//     if (!creatorProfile) {
//       throw createError({
//         statusCode: 404,
//         statusMessage: "Profile not found",
//       });
//     }

//     // Create the group with the fetched Profile
//     const newGroup = await prisma.group.create({
//       data: {
//         name: groupName,
//         imageUrl: 'default_image_url', // Replace with actual imageUrl if necessary
//         inviteCode, // This is guaranteed to be a string
//         bio: 'Group description', // Replace with actual bio if necessary
//         profile: {
//           connect: { id: creatorProfile.id },
//         },
//         members: {
//           create: userEmails.map((email: any) => ({
//             profile: {
//               connect: { email },
//             },
//           })),
//         },
//       },
//     });

//     return {
//       success: true,
//       group: newGroup,
//     };
//   } catch (error) {
//     console.error("Error creating group:", error);
//     throw createError({
//       statusCode: 500,
//       statusMessage: "Failed to create group",
//     });
//   }
// });


// server/api/group/create.post.ts
import prisma from "~/lib/prisma";
import { nanoid } from 'nanoid';

export default defineEventHandler(async (event) => {
  try {
    const { userEmails, groupName, profileId } = await readBody(event);

    // Ensure that exactly two user emails are passed (the logged-in user and the clicked user)
    if (userEmails.length !== 2) {
      throw createError({
        statusCode: 400,
        statusMessage: "A group can only be created between two users",
      });
    }

    // Check if a group with these two specific members already exists
    const existingGroup = await prisma.group.findFirst({
      where: {
        members: {
          every: {
            profile: {
              email: {
                in: userEmails,
              },
            },
          },
        },
        AND: [
          {
            members: {
              some: {
                profile: {
                  email: userEmails[0],
                },
              },
            },
          },
          {
            members: {
              some: {
                profile: {
                  email: userEmails[1],
                },
              },
            },
          },
        ],
      },
      include: {
        members: true,
      },
    });

    if (existingGroup) {
      // If a group between these two users already exists, return it
      return {
        success: true,
        group: existingGroup,
      };
    }

    // Generate a unique invite code for the group
    let inviteCode: string = ""; 
    let isUnique = false;

    while (!isUnique) {
      inviteCode = nanoid(10);
      const existingCode = await prisma.group.findUnique({
        where: { inviteCode },
      });
      if (!existingCode) {
        isUnique = true;
      }
    }

    // Fetch the Profile using the profileId (email of the user creating the group)
    const creatorProfile = await prisma.profile.findUnique({
      where: { email: profileId }, // Assuming profileId is actually the email here
    });

    if (!creatorProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: "Profile not found",
      });
    }

    // Create a new group for just these two users
    const newGroup = await prisma.group.create({
      data: {
        name: groupName,
        imageUrl: 'default_image_url', // Replace with actual imageUrl if necessary
        inviteCode, // Unique invite code
        bio: 'Group description', // Replace with actual bio if necessary
        profile: {
          connect: { id: creatorProfile.id },
        },
        members: {
          create: userEmails.map((email: any) => ({
            profile: {
              connect: { email },
            },
          })),
        },
      },
    });

    return {
      success: true,
      group: newGroup,
    };
  } catch (error) {
    console.error("Error creating group:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create group",
    });
  }
});
