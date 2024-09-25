import { Router } from "express";
import { authentication, createAdmin, deleteAdmin, readAdmin, updateAdmin } from "../controller/adminController";
import { authValidation, createValidation, updateValidation } from "../middleware/adminValidate";
import { uploadAdminPhoto } from "../middleware/uploadAdminPhoto";

const router = Router()
router.post(`/`, [uploadAdminPhoto.single(`photo`),createValidation],createAdmin)
router.get(`/`, readAdmin )
router.put('/:id',[uploadAdminPhoto.single(`photo`),updateValidation],updateAdmin)
router.delete(`/:id`, deleteAdmin)


router.post(`/auth`,[authValidation],authentication)

export default router;