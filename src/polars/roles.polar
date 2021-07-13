allow(user: User, "list:users", _: String) if
  # check any of user roles matches rquired user roles
  userGroup in user.groups and userGroup in user.requires.userGroups;

allow(user: User, "get:project", project: Dictionary) if
  # conditions can be created in the actor class
  user.isRequiredUserGroup()
  or
  user.isRequiredProjectGroup(project);

allow(user: User, "project_field", project: Dictionary) if
  user.isRequiredUserGroup()
  or
  user.isRequiredProjectGroup(project);

