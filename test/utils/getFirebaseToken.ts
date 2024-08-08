import axios from 'axios';

interface FirebaseSignInResponse {
  idToken: string;
  // ... include other properties from the response if needed
}

export async function getFirebaseToken(email: string, password: string): Promise<string> {
  const apiKey = process.env.FIREBASE_API_KEY;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  try {
    const response = await axios.post<FirebaseSignInResponse>(url, {
      email,
      password,
      returnSecureToken: true,
    });
    return response.data.idToken;
  } catch (error) {
    throw new Error('Failed to authenticate with Firebase');
  }
}
