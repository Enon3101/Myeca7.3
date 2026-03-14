import React from "react";
import { RequireRole } from "./RequireRole";

export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <RequireRole roles={['admin']}>{children}</RequireRole>;
};

export default RequireAdmin;
