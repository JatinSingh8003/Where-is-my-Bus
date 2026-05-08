import { Router } from 'express'
import { getBusDetails, getLiveByBus, searchBuses } from '../controllers/busController'

const router = Router()

router.get('/search', searchBuses)
router.get('/:busId', getBusDetails)
router.get('/:busId/live', getLiveByBus)

export default router
