import { Router } from "express";

import DonationItemController from "../../controllers/DonationItemController";

const router = Router();

// ============= Geral ============= //

router.get("/items", DonationItemController.getAllItems);

// ============= User ============= //

router.get("/users/:idUser/item/:idDonationItem", DonationItemController.getItemOfUserById);
router.get("/users/:idUser/item", DonationItemController.getAllItemsOfUser);

router.post("/users/:idUser/item/createItem", DonationItemController.createDonationItem);

router.put("/users/:idUser/item/:idDonationItem/updateItem", DonationItemController.updateDonationItem);

router.delete("/users/:idUser/item/:idDonationItem/deleteItem", DonationItemController.deleteDonationItem);

export default router;
