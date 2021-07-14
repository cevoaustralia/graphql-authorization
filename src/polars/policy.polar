allow(user: User, "list:users", _: String) if
  user.isRequiredUserGroup();

allow(user: User, "get:project", project: Dictionary) if
  user.isRequiredUserGroup()
  or
  user.isRequiredProjectGroup(project);

allow(user: User, "update:project", projectId: Integer) if
  user.isRequiredUserGroup()
  or
  projectId in user.filterAllowedProjectIds();

allow(user: User, "list:indicators", _: String) if
  user.isRequiredUserGroup()
  or
  user.filterAllowedProjectIds().length > 0;