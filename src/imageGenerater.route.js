import express, { Router } from "express";

const router = Router();

// dummy route
router.get("/", async (req, res) => {
  return res.status(200).send({
    message: "Response message from get",
  });
});

// TODO: define actual routes
router.post("/");

export default router;
