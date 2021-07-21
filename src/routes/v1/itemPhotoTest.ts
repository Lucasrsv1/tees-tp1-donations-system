import { Router } from "express";

import ItemPhotoController from "../../controllers/ItemPhotoControllerTest";

const router = Router();

// ============= Geral ============= //

router.get("/items/:idDonationItem/img", ItemPhotoController.getAllItemsPhotos);
router.get("/items/:idDonationItem/img/idItemPhoto", ItemPhotoController.getItemPhotoById);

// ============= User ============= //

router.get("/users/:idUser/item/:idDonationItem/img", ItemPhotoController.getAllItemsPhotos);
router.get("/users/:idUser/item/:idDonationItem/img/:idItemPhoto", ItemPhotoController.getItemPhotoById);

router.post("/users/:idUser/item/:idDonationItem/img/addPhoto", ItemPhotoController.createItemPhoto);

router.put("/users/:idUser/item/:idDonationItem/img/update/:idItemPhoto", ItemPhotoController.updateItemPhoto);

router.delete("/users/:idUser/item/:idDonationItem/img/delete/:idItemPhoto", ItemPhotoController.deleteItemPhoto);

export default router;
