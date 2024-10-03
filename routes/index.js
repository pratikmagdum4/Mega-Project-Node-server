import express from "express";
const router = express.Router();


/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

// router.use('/signup',)

export default router;
