allow(user: User, "list:users", _: String) if
  user.isRequiredUserGroup();

allow(user: User, "*:project", project: Dictionary) if
  user.isRequiredUserGroup()
  or
  # conditions can be created in the actor class
  user.isRequiredProjectGroup(project);

allow(user: User, "list:indicators", _: String) if
  user.isRequiredUserGroup()
  or
  user.filterAllowedProjectIds().length > 0;