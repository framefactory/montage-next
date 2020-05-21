#!/bin/bash
# MONGODB INITIALIZATION SCRIPT

cat > /tmp/initdb.js <<EOF
db.createUser({
  user: "$MONGODB_ADMINUSERNAME",
  pwd: "$MONGODB_ADMINPASSWORD",
  roles: [
    {
      role: "userAdminAnyDatabase",
      db: "admin"
    }
  ]
});

db.createUser({
  user: "$MONGODB_USERNAME",
  pwd: "$MONGODB_PASSWORD",
  roles: [
    {
      role: "dbOwner",
      db: "$MONGODB_DATABASE"
    }
  ]
});
EOF

mongo admin /tmp/initdb.js
