import { Router } from "express";

import ItemPhotoController from "../../controllers/ItemPhotoController";

const router = Router();

// ============= Geral ============= //

router.get("/items/:idDonationItem/img", ItemPhotoController.getAllItemPhotos);
router.get("/items/:idDonationItem/img/:idItemPhoto", ItemPhotoController.getItemPhotoById);

// ============= User ============= //

router.get("/users/:idUser/item/:idDonationItem/img", ItemPhotoController.getAllItemPhotos);
router.get("/users/:idUser/item/:idDonationItem/img/:idItemPhoto", ItemPhotoController.getItemPhotoById);

router.post("/users/:idUser/item/:idDonationItem/img/addPhoto", ItemPhotoController.createItemPhoto);

router.put("/users/:idUser/item/:idDonationItem/img/:idItemPhoto/update", ItemPhotoController.updateItemPhoto);

router.delete("/users/:idUser/item/:idDonationItem/img/:idItemPhoto/delete", ItemPhotoController.deleteItemPhoto);

export default router;
