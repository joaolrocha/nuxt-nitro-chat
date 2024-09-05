import { eventHandler, setResponseHeader } from 'h3';

export default eventHandler(async (event) => {
  console.log('entrando no session get');

  // Mock session data to bypass authentication
  const sessionData = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  // Set Content-Type header explicitly to application/json
  setResponseHeader(event, 'Content-Type', 'application/json');

  return sessionData;
});
