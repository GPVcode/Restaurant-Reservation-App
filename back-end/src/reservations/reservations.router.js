/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed);

// router
//     .route("/new")
    
router
    .route("/:reservation_id")
    .get(controller.read)
    .delete(controller.delete)
    .all(methodNotAllowed);

router
    .route("/:reservation_id/status")
    .put(controller.status)
    .all(methodNotAllowed);

    // .route("/:reservationId([0-9]+)")

module.exports = router;
