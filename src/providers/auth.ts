import { AuthProvider } from "@refinedev/core";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/firebase-config/initialise";
import type { User } from "@/graphql/schema.types";
import { disableAutoLogin, enableAutoLogin } from "@/hooks";

import { API_BASE_URL, API_URL, client, dataProvider } from "./data";

export const emails = [
  "michael.scott@dundermifflin.com",
  "jim.halpert@dundermifflin.com",
  "pam.beesly@dundermifflin.com",
  "dwight.schrute@dundermifflin.com",
  "angela.martin@dundermifflin.com",
  "stanley.hudson@dundermifflin.com",
  "phyllis.smith@dundermifflin.com",
  "kevin.malone@dundermifflin.com",
  "oscar.martinez@dundermifflin.com",
  "creed.bratton@dundermifflin.com",
  "meredith.palmer@dundermifflin.com",
  "ryan.howard@dundermifflin.com",
  "kelly.kapoor@dundermifflin.com",
  "andy.bernard@dundermifflin.com",
  "toby.flenderson@dundermifflin.com",
];

const randomEmail = emails[Math.floor(Math.random() * emails.length)];

export const demoCredentials = {
  email: randomEmail,
  password: "demodemo",
};

export const authProvider: AuthProvider = {
  login: async ({ email, username, password, remember }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // const idToken = await user.getIdToken();

      if (user) {
        console.log(user, "user logged in")
        return {
          success: true,
          redirectTo: "/",
        };
      }
      return {
        success: false,
        error: {
          message:  "Login failed",
          name:  "Please try again",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },
  register: async ({ email, password, role, name, title }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // // await sendEmailVerification(userCredential.user);
      const user = userCredential.user;
      const id = user.uid;

      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { id: id, email, role, name, title },
          rawQuery: `
                mutation register($email: String!, $id: String!, $role: String, $name: String, $title: String ) {
                    register(registerInput: {
                      email: $email
                        id: $id
                        role: $role
                        title: $title
                        name: $name
                    }) {
                        email
                    }
                  }
                `,
        },
      });

      // enableAutoLogin(email);

      // return {
      //   success: true,
      //   redirectTo: `/login?email=${email}`,
      // };
      return {
        success: true,
        redirectTo: `/`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Register failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },
  logout: async () => {
    client.setHeaders({
      Authorization: "",
    });
    await signOut(auth);
    console.log("logged out")

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error?.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    try {
      async function getCurrentUser() {
        return new Promise((resolve, reject) => {
           const unsubscribe = onAuthStateChanged(auth, user => {
        if (user) {
          resolve(user);
        }
        else{
          resolve(null)
        }
              unsubscribe();
           }, reject);
        });
      }

      const user = await getCurrentUser()
     
    // const user = auth.currentUser;
    //   console.log(user, "checking loggedin")
      if (user) {
        return {
          authenticated: true,
        };
      }
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        authenticated: false,
      };
    }
  },
  forgotPassword: async ({ email }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch {
      return {
        success: false,
        error: {
          name: "Forgot Password Error",
          message: "Email address does not exist",
        },
      };
    }
  },
  updatePassword: async () => {
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  getIdentity: async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        console.log(user, "identity user")
        const { data } = await dataProvider.custom<{ me: User }>({
          url: API_URL,
          method: "post",
          headers: {},
          meta: {
            rawQuery: `
                query Me {
                    me {
                        id,
                        name,
                        email,
                        phone,
                        jobTitle,
                        timezone
                        avatarUrl
                    }
                  }
            `,
          },
        });

        console.log(data.me, "identity of user")
        return data.me;
      }

    
    } catch (error) {
      return undefined;
    }
  },
};
