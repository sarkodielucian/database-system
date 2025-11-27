const express = require('express');
const router = express.Router();
const clusterController = require('../controllers/clusterController');

router.get('/stats', clusterController.getClusterStats);
router.get('/clusters', clusterController.getAllClusters);
router.post('/clusters', clusterController.createCluster);
router.put('/clusters/:id', clusterController.updateCluster);

router.get('/followups', clusterController.getAllFollowUps);
router.post('/followups', clusterController.createFollowUp);
router.put('/followups/:id', clusterController.updateFollowUp);
router.delete('/followups/:id', clusterController.deleteFollowUp);

module.exports = router;
