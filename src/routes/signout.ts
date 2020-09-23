import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
	req.session = null;
	res.send(null);
});

export { router as signoutRouter };