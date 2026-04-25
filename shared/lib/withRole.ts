import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./getSession";
import { UserRole } from "../../backend/models/user.model";
 
// Role hierarchy: owner > admin > agent > viewer
const ROLE_RANK: Record<UserRole, number> = {
    owner: 4,
    admin: 3,
    agent: 2,
    viewer: 1,
};
 
/**
 * Use this in any API route to restrict access by role.
 *
 * Usage:
 *   const check = await requireRole(req, "admin");
 *   if (check) return check; // returns 401/403 response if unauthorized
 *
 * Roles and what they can do:
 *   owner  — full access, billing, settings, invite team
 *   admin  — full CRM access, can edit/send messages, cannot change billing
 *   agent  — can view contacts, send messages, update stages. Cannot change settings.
 *   viewer — read-only. Cannot send messages or change anything.
 */
export async function requireRole(
    req: NextRequest,
    minimumRole: UserRole
): Promise<NextResponse | null> {
    const session = await getSession();
 
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
 
    const userRole = ((session as any).role as UserRole) || "viewer";
    if (ROLE_RANK[userRole] < ROLE_RANK[minimumRole]) {
        return NextResponse.json(
            { message: `Access denied. Required role: ${minimumRole}` },
            { status: 403 }
        );
    }
 
    return null; // Access granted
}
 
/**
 * Check if the current session has at least the given role.
 * Use in client components to conditionally show/hide UI.
 *
 * Example:
 *   const canSend = hasRole(session.role, "agent");
 */
export function hasRole(userRole: UserRole, minimumRole: UserRole): boolean {
    return ROLE_RANK[userRole] >= ROLE_RANK[minimumRole];
}
 
/**
 * Permission map — use these instead of hardcoding role strings everywhere.
 */
export const CAN = {
    viewCRM: (role: UserRole) => hasRole(role, "viewer"),
    sendMessages: (role: UserRole) => hasRole(role, "agent"),
    editContacts: (role: UserRole) => hasRole(role, "agent"),
    changeSettings: (role: UserRole) => hasRole(role, "admin"),
    manageTeam: (role: UserRole) => hasRole(role, "owner"),
    billing: (role: UserRole) => hasRole(role, "owner"),
};
