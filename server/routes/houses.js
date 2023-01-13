const express = require("express");
const mongoose = require('mongoose')
const Grid = require("gridfs-stream");
const { body, validationResult } = require("express-validator");
const fs = require('fs')

const House = require("../models/House");
const File = require("../models/File");

const router = express.Router();

const bodyParser = require('body-parser')

const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db)
});

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '.jpg')
    }
})

router.use(bodyParser.json());

const validate = [
    body("title")
    .isLength({ min: "3", max: "50" })
    .withMessage("Title should be between 3 to 50 characters"),
    body("description")
    .isLength({ min: "10", max: "200" })
    .withMessage("Description should be between 10 to 200 characters"),
    body("address")
    .isLength({ min: "10", max: "100" })
    .withMessage("Address should be between 10 to 100 characters"),
    body("price").isNumeric().withMessage("Price should be a number")
]

// handle form data validation
router.use((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
});

const upload = multer({ storage: storage });

// /api/houses
router.post(
    "/",
    upload.array('images'),
    async(req, res) => {
        if (req.body.title && req.body.title.length < 3) {
            return res.status(400).json({ error: "Title should be at least 3 characters long" });
        } else if (req.body.address && req.body.title.length < 5) {
            return res.status(400).json({ error: "Title should be at least 5 characters long" });
        } else if (req.body.description && req.body.title.description < 10) {
            return res.status(400).json({ error: "Title should be at least 10 characters long" });
        }

        const house = new House({
            title: req.body.title,
            address: req.body.address,
            bedroom: req.body.bedroom,
            bathroom: req.body.bathroom,
            description: req.body.description,
            price: req.body.price,
        });

        // Upload and store the image(s) in gridfs
        const files = req.files;
        if (files && files.length) {
            house.images = await Promise.all(
                files.map(async(file) => {
                    const stream = gfs.openUploadStream(file.filename);
                    fs.createReadStream(file.path).pipe(stream);
                    const uploadedFile = await new Promise((resolve, reject) => {
                        stream.on("finish", async(file) => {
                            try {
                                const uploadedFile = new File({
                                    filename: file.filename,
                                    contentType: "multipart/form-data",
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
// body("title")
// .isLength({ min: "3", max: "50" })
// .withMessage("Title should be between 3 to 50 characters"),
// body("description")
// .isLength({ min: "10", max: "200" })
// .withMessage("Description should be between 10 to 200 characters"),
// body("address")
// .isLength({ min: "10", max: "100" })
// .withMessage("Address should be between 10 to 100 characters"),
// body("price").isNumeric().withMessage("Price should be a number"),
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
    async(req, res) => {
        console.log(req.body)
        if (req.body.title && req.body.title.length < 3) {
            return res.status(400).json({ error: "Title should be at least 3 characters long" });
        } else if (req.body.address && req.body.title.length < 5) {
            return res.status(400).json({ error: "Title should be at least 5 characters long" });
        } else if (req.body.description && req.body.title.description < 10) {
            return res.status(400).json({ error: "Title should be at least 10 characters long" });
        }

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
            res.send({
                message: 'deleted',
                data: house
            });
        })
        .catch((err) => console.log(err));
});

module.exports = router;