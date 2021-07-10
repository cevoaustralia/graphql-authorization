allow(actor: User, "list:users", _: String) if
  actor.role in actor.requires.appRoles;

allow(actor: User, "get:project", project: Dictionary) if
  actor.role in actor.requires.appRoles or
  (
    actor.role in actor.requires.projRoles and 
    project.id in actor.requires.userProjects
  );

allow(actor: User, "contract_sum", keys: List) if
  actor.role in actor.requires.appRoles or
  not "contract_sum" in keys;
