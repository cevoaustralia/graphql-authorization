allow(user: User, "list:users", _: String) if
  # check any of user roles matches rquired user roles
  userRole in user.roles and userRole in user.requires.userRoles;

allow(user: User, "get:project", project: Dictionary) if
  userRole in user.roles and userRole in user.requires.userRoles
  or
  # complicated logic can be built in the actor class
  user.isRequiredProjectRole(project);

allow(user: User, "contract_sum", project: Dictionary) if
  userRole in user.roles and userRole in user.requires.userRoles
  or
  user.isRequiredProjectRole(project);
