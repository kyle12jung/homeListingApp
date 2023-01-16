const express = require("express");
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { body, validationResult } = require("express-validator");
const path = require('path');
const mime = require('mime-types');

const House = require("../models/House");

const router = express.Router();

require('dotenv').config();
const S3ACCESSKEY_ID = process.env.S3ACCESSKEY_ID;
const S2ACCESSKEY_SECRET = process.env.S2ACCESSKEY_SECRET;

AWS.config.update({
    accessKeyId: S3ACCESSKEY_ID,
    secretAccessKey: S2ACCESSKEY_SECRET
});
const s3 = new AWS.S3()

const storage = multerS3({
    s3: s3,
    bucket: 'homehopimagesdev',
    metadata: function(req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
        cb(null, Date.now().toString() + '.jpg')
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname);
        console.log(mime.lookup('.' + ext))
        if (mime.lookup('.' + ext) != 'image/jpeg' && mime.lookup('.' + ext) != 'image/jpg' && mime.lookup('.' + ext) != 'image/png') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
});

router.use(bodyParser.json());

// handle form data validation
router.use((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
});

// /api/houses
router.post(
    "/",
    upload.array('images'),
    async(req, res) => {
        if (req.body.title && req.body.title.length < 3) {
            return res.status(400).json({ error: "Title should be at least 3 characters long" });
        } else if (req.body.address && req.body.address.length < 5) {
            return res.status(400).json({ error: "Title should be at least 5 characters long" });
        } else if (req.body.description && req.body.description.length < 10) {
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

        if (req.files && req.files.length) {
            const imageUploadPromises = req.files.map(file => {
                console.log(file)
                return new Promise((resolve, reject) => {
                    const params = {
                        Bucket: "homehopimagesdev",
                        Key: file.location,
                        Body: file.originalname
                    };
                    console.log(params.Key)
                    s3.upload(params, (err, data) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: "Failed to upload image" });
                        } else {
                            console.log(`Image ${file.originalname} uploaded successfully`);
                            house.images.push(params.Key);
                            resolve();
                        }
                    });
                });
            });

            await Promise.all(imageUploadPromises)
                .then(() => {
                    console.log(house)
                    return house.save()
                })
                .then((result) => {
                    res.send({
                        message: "House data created",
                        data: result,
                    });
                })
                .catch((err) => console.log(err));
        }


    }
);

// /api/houses
router.get("/", async(req, res) => {
    try {
        const houses = await House.find();
        res.send(houses)
            // const modifiedHouses = houses.map(async house => {
            //     const images = await Promise.all(house.images.map(async image => {
            //         const url = s3.getSignedUrl('getObject', {
            //             Bucket: 'homehopimagesdev',
            //             Key: image
            //         });
            //         return url;
            //     }));
            //     house.images = images;
            //     return house;
            // });
            // const resolvedHouses = await Promise.all(modifiedHouses);
            // console.log(resolvedHouses)
            // res.send(resolvedHouses);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


// api/houses/id
router.get("/:id", async(req, res) => {
    const house = await House.findById(req.params.id);
    if (!house) {
        return res.status(404).json({
            error: "No house found"
        });
    }
    const images = await Promise.all(house.images.map(async image => {
        const params = {
            Bucket: 'homehopimagesdev',
            Key: image,
        };
        const url = await s3.getSignedUrl('getObject', params);
        return url;
    }));
    house.images = images;
    console.log(house)
    await res.send(house);
});



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