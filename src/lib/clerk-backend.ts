import { clerkClient } from '@clerk/nextjs/server';

export async function findOrCreateUserByEmail(email: string) {
  const client = await clerkClient();
  const existing = await client.users.getUserList({ emailAddress: [email], limit: 1 });
  if (existing.data.length > 0) return existing.data[0];
  return client.users.createUser({ emailAddress: [email] });
}

export async function findOrCreateOrgForUser(userId: string, name: string) {
  const client = await clerkClient();
  const memberships = await client.users.getOrganizationMembershipList({ userId });
  if (memberships.data.length > 0) {
    return memberships.data[0].organization;
  }
  return client.organizations.createOrganization({ name, createdBy: userId });
}

export async function createSignInToken(userId: string) {
  const client = await clerkClient();
  return client.signInTokens.createSignInToken({ userId, expiresInSeconds: 60 * 60 });
}
