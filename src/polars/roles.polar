# TODO: Add some rules!
# allow(actor: String, "GET", _expense: Expense) if
#     actor.endsWith("@example.com");

allow(actor: User, "users", _user: User) if
  actor.role in actor.context.appRoles;
