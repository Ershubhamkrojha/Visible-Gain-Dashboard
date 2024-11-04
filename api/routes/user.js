import express from 'express';
import {updateUser,deleteUser,getUser,getAllUser} from '../controllers/user.js'

const router=express.Router();


router.put("/:id",updateUser)
//delete
router.delete("/:id",deleteUser)



//get 
router.get("/:id",getUser)
//getall
router.get("/", getAllUser)

 
 

export default router;  