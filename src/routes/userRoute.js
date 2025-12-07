const express = require('express');
const router = express.Router();
const { listUsers, getUserById, updateUser, deleteUser, getAllSiswa, getAllGuru, listSiswaByKelas } = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { allowRoles } = require('../middlewares/roles');
const { auditLog } = require('../middlewares/audit');
const { updatePassword } = require('../controllers/profileController');
router.get('/', authenticate, allowRoles('admin'), auditLog, listUsers);
router.get('/:userId', authenticate, allowRoles('admin'), auditLog, getUserById);
router.put('/:userId', authenticate, allowRoles('admin'), auditLog, updateUser);
router.delete('/:userId', authenticate, allowRoles('admin'), auditLog, deleteUser);
router.get('/siswa/all', authenticate, allowRoles('admin','guru'), getAllSiswa);
router.get('/guru/all', authenticate, allowRoles('admin','guru'), getAllGuru);
router.get('/kelas/:kelasId', authenticate, allowRoles('admin','guru'), listSiswaByKelas);

router.put('/:userId/password', authenticate, updatePassword);
module.exports = router;