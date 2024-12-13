import express from 'express';

const router = express.Router();

// middlewares
import { requireSignin, isAdmin } from '../middlewares/auth.js';
// controllers
import { register, login, secret } from '../controllers/auth.js';

router.post('/register', register);
router.post('/login', login);
// testing
router.get('/secretadmin', requireSignin, isAdmin, secret);
router.get('/secretgeneraluser', requireSignin, secret);
router.get('/auth-check', requireSignin, (req, res) => {
  res.json({ ok: true });
});

export default router;
