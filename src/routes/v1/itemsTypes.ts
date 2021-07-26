import { Router } from "express";

import ItemTypeController from "../../controllers/ItemTypeController";
import LoginController from "../../controllers/LoginController";

const router = Router();

router.get("/itemTypes", LoginController.ensureAuthorized, ItemTypeController.getAllItemTypes);

router.post("/itemTypes", ItemTypeController.createItemTypeValidations, ItemTypeController.createItemType);

router.patch("/itemTypes/:idItemType", LoginController.ensureAuthorized, ItemTypeController.updateItemType);

router.delete("/itemTypes/:idItemType", LoginController.ensureAuthorized, ItemTypeController.deleteItemType);

export default router;
