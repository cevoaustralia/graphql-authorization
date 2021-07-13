allow(user: User, "list:users", _: String) if
  # check any of user roles matches rquired user roles
  userRole in user.roles and userRole in user.requires.userRoles;

allow(user: User, "get:project", project: Dictionary) if
  # conditions can be created in the actor class
  user.isRequiredUserRole()
  or
  user.isRequiredProjectRole(project);

allow(user: User, "project_field", project: Dictionary) if
  user.isRequiredUserRole()
  or
  user.isRequiredProjectRole(project);

