const express = require("express");
const { body, validationResult } = require("express-validator");
const Grid = require("gridfs");

const House = require("../models/House");

const router = express.Router();

// /api/houses
router.post(
    "/",
    body("title")
    .isLength({ min: "3", max: "20" })
    .withMessage("Title should be between 3 to 20 characters"),
    body("description")
    .isLength({ min: "10", max: "200" })
    .withMessage("Description should be between 10 to 200 characters"),
    body("address")
    .isLength({ min: "10", max: "100" })
    .withMessage("Address should be between 10 to 100 characters"),
    body("price").isNumeric().withMessage("Price should be a number"),
    body("bedroom").isNumeric().withMessage("Price should be a number"),
    body("bathroom").isNumeric().withMessage("Price should be a number"),
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const house = new House({
            title: req.body.title,
            address: req.body.address,
            bedroom: req.body.bedrooms,
            bathroom: req.body.bathrooms,
            description: req.body.description,
            price: req.body.price,
        });

        // Upload and store the image(s) in gridfs
        const files = req.files;
        if (files) {
            house.images = await Promise.all(
                files.map(async(file) => {
                    const writestream = gfs.createWriteStream({
                        filename: file.name,
                        mode: "w",
                        content_type: file.mimetype,
                    });
                    await fs.createReadStream(file.path).pipe(writestream);
                    const uploadedFile = await new Promise((resolve, reject) => {
                        writestream.on("close", async(file) => {
                            try {
                                const uploadedFile = new File({
                                    filename: file.filename,
                                    contentType: file.contentType,
                                    metadata: req.body.metadata,
                                });
                                await uploadedFile.save();
                                resolve(uploadedFile._id);
                            } catch (error) {
                                reject(error);
                            }
                        });
                    });
                    return uploadedFile;
                })
            );
        }

        await house
            .save()
            .then((result) => {
                res.send({
                    message: "House data created",
                    data: result,
                });
            })
            .catch((err) => console.log(err));
    }
);

// /api/houses
router.get("/", (req, res) => {
    House.find()
        .then((houses) => {
            res.send(houses);
        })
        .catch((err) => console.log(err));
});

// api/houses/id
router.get("/:id", async(req, res) => {
    // const houseID = req.params.id
    // House.findById(houseID)
    //     .then(house => {
    //         res.send(house)
    //     })
    //     .catch(err => console.log(err))
    const house = await House.findById(req.params.id);
    if (!house) {
        return res.status(404).json({
            error: "No house found"
        });
    }
    await res.send(house);
});

// api/houses/id
// router.put(
//     "/:id",
//     body("title")
//     .isLength({ min: "3", max: "50" })
//     .withMessage("Title should be between 3 to 50 characters"),
//     body("description")
//     .isLength({ min: "10", max: "200" })
//     .withMessage("Description should be between 10 to 200 characters"),
//     body("address")
//     .isLength({ min: "10", max: "100" })
//     .withMessage("Address should be between 10 to 100 characters"),
//     body("price").isNumeric().withMessage("Price should be a number"),
//     (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const houseID = req.params.id;
//         House.findById(houseID)
//             .then((house) => {
//                 (house.title = req.body.title),
//                 (house.address = req.body.address),
//                 (house.homeType = req.body.homeType),
//                 (house.description = req.body.description),
//                 (house.price = req.body.price),
//                 (house.image = req.body.image),
//                 (house.yearBuilt = req.body.yearBuilt);

//                 return house.save();
//             })
//             .then((result) => res.send(result))
//             .catch((err) => console.log(err));
//     }
// );

router.patch(
    "/:id",
    body("title")
    .isLength({ min: "3", max: "50" })
    .withMessage("Title should be between 3 to 50 characters"),
    body("description")
    .isLength({ min: "10", max: "200" })
    .withMessage("Description should be between 10 to 200 characters"),
    body("address")
    .isLength({ min: "10", max: "100" })
    .withMessage("Address should be between 10 to 100 characters"),
    body("price").isNumeric().withMessage("Price should be a number"),
    async(req, res) => {
        // Find the house by id and handle any errors
        const house = await House.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!house) {
            return res.status(404).json({
                error: "No house found"
            });
        }
        try {
            const result = await house.save()
            await res.send(result)
        } catch (err) {
            console.log(err)
        }

    });


// api/houses/id
router.delete("/:id", (req, res) => {
    const houseID = req.params.id;
    House.findByIdAndDelete(houseID)
        .then((house) => {
            res.send(house);
        })
        .catch((err) => console.log(err));
});

module.exports = router;