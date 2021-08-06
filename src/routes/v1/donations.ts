import { Router } from "express";

import DonationItemController from "../../controllers/DonationItemController";
import EmailController from "../../controllers/EmailController";
import LoginController from "../../controllers/LoginController";

const router = Router();

// ============= Donations ============= //

router.get("/donations", LoginController.ensureAuthorized, DonationItemController.getAllUserDonations);

router.get("/donations/:idDonation", LoginController.ensureAuthorized, DonationItemController.getDonation);

router.post("/donations", DonationItemController.createDonationValidations, DonationItemController.createDonation);

router.put("/donations/:idDonation", DonationItemController.updateDonationValidations, DonationItemController.updateDonation);

router.delete("/donations/:idDonation", LoginController.ensureAuthorized, DonationItemController.deleteDonation);

router.post("/donations/:idDonation/validate", EmailController.validateDonationEmail);

// ============= Photos ============= //

// router.post("/donations/:idDonation/photos", LoginController.ensureAuthorized, DonationItemController.savePhotos);

router.delete("/donations/:idDonation/photos", LoginController.ensureAuthorized, DonationItemController.deletePhotos);

// ============= Validation ============= //

router.get("/donations/pending/validation", LoginController.ensureAuthorized, DonationItemController.getPendingValidation);

router.patch("/donations/:idDonation/validation", DonationItemController.setValidationValidations, DonationItemController.setValidation);

// ============= Solicitations ============= //

router.get("/donations/:idDonation/solicitations", LoginController.ensureAuthorized, DonationItemController.getSolicitations);

router.patch("/donations/:idDonation/solicitations", LoginController.ensureAuthorized, DonationItemController.confirmSolicitation);

router.post("/donations/:idDonation/solicitations/:idSolicitation/validate", LoginController.ensureAuthorized, EmailController.validateSolicitationEmail);

export default router;
