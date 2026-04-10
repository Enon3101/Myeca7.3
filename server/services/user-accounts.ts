import { adminAuth, adminDb } from "../firebase-admin";

type Role = "admin" | "team_member" | "ca" | "user";

export type AuthIdentity = {
  userId: string;
  email?: string;
};

function parseEmailList(value?: string) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  );
}

const adminEmails = () => parseEmailList(process.env.ADMIN_EMAILS);
const teamMemberEmails = () => parseEmailList(process.env.TEAM_MEMBER_EMAILS);

export function getBootstrapRoleForEmail(email?: string | null): Role | null {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (adminEmails().has(normalized)) {
    return "admin";
  }

  if (teamMemberEmails().has(normalized)) {
    return "team_member";
  }

  return null;
}

export async function syncRoleClaims(userId: string, role?: string | null) {
  const userRecord = await adminAuth.getUser(userId);
  const existingClaims = userRecord.customClaims ?? {};
  const nextClaims = {
    ...existingClaims,
    admin: role === "admin",
    team_member: role === "team_member",
  };

  if (
    existingClaims.admin === nextClaims.admin &&
    existingClaims.team_member === nextClaims.team_member
  ) {
    return;
  }

  await adminAuth.setCustomUserClaims(userId, nextClaims);
}

export async function findOrCreateUserProfile(auth: AuthIdentity) {
  const userRef = adminDb.collection("users").doc(auth.userId);
  let userDoc = await userRef.get();

  if (!userDoc.exists) {
    const usersSnapshot = await adminDb.collection("users").limit(1).get();
    const isFirstUser = usersSnapshot.empty;
    const role = getBootstrapRoleForEmail(auth.email) ?? (isFirstUser ? "admin" : "user");

    const newUser = {
      id: auth.userId,
      email: auth.email ?? null,
      firstName: "User",
      lastName: "",
      role,
      status: "active",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await userRef.set(newUser);
    await syncRoleClaims(auth.userId, role);
    userDoc = await userRef.get();
  } else {
    const existingRole = userDoc.data()?.role;
    await syncRoleClaims(auth.userId, existingRole);
  }

  return userDoc;
}
