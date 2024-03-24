//@ts-nocheck
import { AuthProvider } from "@refinedev/core";

import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";

import {auth} from "@/firebase-config/initialise"
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

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (accessToken && refreshToken) {
      client.setHeaders({
        Authorization: `Bearer ${accessToken}`,
      });

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      return {
        success: true,
        redirectTo: "/",
      };
    }

    if (providerName) {
      window.location.href = `${API_BASE_URL}/auth/${providerName}`;

      return {
        success: true,
      };
    }

    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
                mutation Login($email: String!) {
                    login(loginInput: {
                      email: $email
                    }) {
                      accessToken,
                      refreshToken
                    }
                  }
                `,
        },
      });

      // const data = {
      //   login: {
      //     accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjgsImVtYWlsIjoicGh5bGxpcy5zbWl0aEBkdW5kZXJtaWZmbGluLmNvbSIsImlhdCI6MTcxMDkzNjY1OSwiZXhwIjoxNzExMTk1ODU5fQ.rT94vWHIEFEKZYMzok4qks29bMG9SrSXnTXw0Aghdbc"
      //     ,
      //     refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjgsImVtYWlsIjoicGh5bGxpcy5zbWl0aEBkdW5kZXJtaWZmbGluLmNvbSIsImlhdCI6MTcxMDkzNjY1OSwiZXhwIjoxNzExMTk1ODU5fQ.rT94vWHIEFEKZYMzok4qks29bMG9SrSXnTXw0Aghdbc"
      //     ,
      //   },
      // };
      // console.log("data", data);

      client.setHeaders({
        Authorization: `Bearer ${data.login.accessToken}`,
      });


      enableAutoLogin(email);
      localStorage.setItem("access_token", data.login.accessToken);
      localStorage.setItem("refresh_token", data.login.refreshToken);

      return {
        success: true,
        redirectTo: "/",
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
  register: async ({ email, password }) => {
    try {
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // // await sendEmailVerification(userCredential.user);
      // const user = userCredential.user;
const id = "peUwH5hXWihB2YvJKQ3j6Pevfzw2";

const email = "omg2@gmail.com";
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { id: id, email: email },
          rawQuery: `
                mutation register($email: String!, $id: String!) {
                    register(registerInput: {
                      email: $email
                        id: $id
                    }) {
                        email
                    }
                  }
                `,
        },
      });

      // enableAutoLogin(email);

      return {
        success: true,
        redirectTo: `/login?email=${email}`,
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

    disableAutoLogin();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

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
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
                    query Me {
                        me {
                          name
                        }
                      }
                `,
        },
      });

      return {
        authenticated: true,
      };
    } catch (error) {
      return {
        authenticated: false,
      };
    }
  },
  forgotPassword: async () => {
    return {
      success: true,
      redirectTo: "/update-password",
    };
  },
  updatePassword: async () => {
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  getIdentity: async () => {
    try {
      // const { data } = await dataProvider.custom<{ me: User }>({
      //   url: API_URL,
      //   method: "post",
      //   headers: {},
      //   meta: {
      //     rawQuery: `
      //               query Me {
      //                   me {
      //                       id,
      //                       name,
      //                       email,
      //                       phone,
      //                       jobTitle,
      //                       timezone
      //                       avatarUrl
      //                   }
      //                 }
      //           `,
      //   },
      // });
      const me = {
        id: "3",
        name: "John Doe",
        email: "john@doe.com",
        phone: "+1-202-555-0121",
        jobTitle: "Software Engineer",
        timezone: "America/New_York",
        avatarUrl: null
      }
      // return data.me;
      return me;
    } catch (error) {
      return undefined;
    }
  },
};
