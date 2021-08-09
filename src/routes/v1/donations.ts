import { Router } from "express";

import DonationItemController from "../../controllers/DonationItemController";
import LoginController from "../../controllers/LoginController";

const router = Router();

// ============= Donations ============= //

router.get("/donations", LoginController.ensureAuthorized, DonationItemController.getAllUserDonations);

router.get("/donations/search", LoginController.ensureAuthorized, DonationItemController.searchDonations);

router.get("/donations/:idDonation", LoginController.ensureAuthorized, DonationItemController.getDonation);

router.post("/donations", DonationItemController.createDonationValidations, DonationItemController.createDonation);

router.put("/donations/:idDonation", DonationItemController.updateDonationValidations, DonationItemController.updateDonation);

router.delete("/donations/:idDonation", LoginController.ensureAuthorized, DonationItemController.deleteDonation);

// ============= Photos ============= //

router.post("/donations/:idDonation/photos", LoginController.ensureAuthorized, DonationItemController.savePhoto);

router.delete("/donations/:idDonation/photos/:idPhoto", LoginController.ensureAuthorized, DonationItemController.deletePhoto);

// ============= Validation ============= //

router.get("/donations/pending/validation", LoginController.ensureAuthorized, DonationItemController.getPendingValidation);

router.patch("/donations/:idDonation/validation", DonationItemController.setValidationValidations, DonationItemController.setValidation);

// ============= Solicitations ============= //

router.get("/donations/:idDonation/solicitations", LoginController.ensureAuthorized, DonationItemController.getSolicitations);

router.post("/donations/:idDonation/solicitations", LoginController.ensureAuthorized, DonationItemController.solicit);

router.patch("/donations/:idDonation/solicitations", LoginController.ensureAuthorized, DonationItemController.confirmSolicitation);

export default router;
