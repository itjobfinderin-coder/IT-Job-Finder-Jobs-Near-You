export const ROLES = {
  CANDIDATE: "CANDIDATE",
  RECRUITER: "RECRUITER",
};

export function dashboardPathFor(role) {
  return role === ROLES.RECRUITER ? "/recruiter/dashboard" : "/candidate/dashboard";
}
