import { createError, eventHandler, readBody } from 'h3';
import jwt from 'jsonwebtoken';

const { sign } = jwt;

const refreshTokens: Record<number, { accessToken: string, user: any }> = {};  // Correctly declare refreshTokens
export const SECRET = 'dummy';

export default eventHandler(async (event) => {
  try {
    // Parse the JSON body from the incoming request
    const body = await readBody(event);

    console.log(body, 'this is body')


    const expiresIn = 15;
    const refreshToken = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1;

    const user = {
      username: body.username,
      picture: 'https://github.com/nuxt.png',
      name: `User ${body.username}`,
    };

    // Sign the JWT token
    const accessToken = sign(
      { ...user, scope: ['test', 'user'] },
      SECRET,
      { expiresIn }
    );

    // Store the refresh token with the user details
    // const acessToken = ''
    refreshTokens[refreshToken] = { // Use the correct variable name here
      accessToken,
      user,
    };

    // Return the tokens to the client
    return {
      token: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    // Handle errors and provide appropriate status messages
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid JSON body',
    });
  }
});


   // // Validate the parsed body using Zod
    // const schema = z.object({
    //   username: z.string().min(1),
    //   password: z.literal('hunter2'),
    // });

    // const result = schema.safeParse(body);

    // if (!result.success) {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Unauthorized, hint: try `hunter2` as password',
    //   });
    // }

    // const { username } = result.data;