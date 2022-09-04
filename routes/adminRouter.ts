import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  checkAccess,
  refreshAdminToken,
} from "../controllers/adminController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";

export const adminRouter = Router();

adminRouter
  .post("/login", adminLogin)
  .get("/check-access", adminAuthMiddleware, checkAccess)
  .delete("/logout", adminAuthMiddleware, adminLogout)
  .put("/refresh-token", adminAuthMiddleware, refreshAdminToken);
// .post("/create", createAdmin);
