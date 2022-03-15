import { Router } from "express";
import pool from "../utils/db.js";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"
import multer from "multer"

const productsRouter = Router();

const cloudStorageMedia = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "SQLM6",
    },
})
const cloudMulterMedia = multer({ storage: cloudStorageMedia })

productsRouter.get("/", async (req, res, next) => {
  try {
    const data = await pool.query("SELECT * FROM product;");
    res.send(data.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
})

productsRouter.post("/", async (req, res, next) => {
  try {
    const data = await pool.query(
      "INSERT INTO product(name,description,brand,image_url,price,category) VALUES($1,$2,$3,$4,$5,$6) RETURNING *;", 
      Object.values(req.body)
    );
    const product = data.rows[0];
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
})

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM review WHERE product_id=$1;", [
        req.params.id,
      ]);
    const data = await pool.query("DELETE FROM product WHERE id=$1;", [
      req.params.id,
    ]);

    const isDeleted = data.rowCount > 0;
    if (isDeleted) {
      res.status(204).send();
    } else {
      res.status(404).send({
        message: "Product not found therefore there is nothing to done.",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
})

productsRouter.put("/:id", async (req, res, next) => {
  try {
    const data = await pool.query(
      "UPDATE product SET name=$1,description=$2,brand=$3,image_url=$4,price=$5,category=$6 WHERE id=$7 RETURNING *;",
      [req.body.name, req.body.description, req.body.brand, req.body.image_url, req.body.price, req.body.category, req.params.id]
    )

    const isUpdated = data.rowCount > 0;
    if (isUpdated) {
      res.status(200).send(data.rows[0]);
    } else {
      res.status(404).send({
        message: "Product not found therefore there is nothing to done.",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
})

productsRouter.get("/review", async (req, res, next) => {
    try {
      const data = await pool.query("SELECT * FROM review;");
      res.send(data.rows);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })

  productsRouter.post("/:prodId/review", async (req, res, next) => {
    try {
      const data = await pool.query(
        "INSERT INTO review(comment,rate,product_id) VALUES($1,$2,$3) RETURNING *;", 
        Object.values(req.body)
      );
      const product = data.rows[0];
      res.status(201).send(product);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })

  productsRouter.delete("/:id/review", async (req, res, next) => {
    try {
      const data = await pool.query("DELETE FROM review WHERE id=$1;", [
        req.params.id,
      ]);
  
      const isDeleted = data.rowCount > 0;
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).send({
          message: "Product not found therefore there is nothing to done.",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })

  productsRouter.put("/:id/reviews", async (req, res, next) => {
    try {
      const data = await pool.query(
        "UPDATE review SET comment=$1,rate=$2 WHERE id=$3 RETURNING *;",
        [req.body.comment, req.body.rate, req.params.id]
      )
  
      const isUpdated = data.rowCount > 0;
      if (isUpdated) {
        res.status(200).send(data.rows[0]);
      } else {
        res.status(404).send({
          message: "Product not found therefore there is nothing to done.",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })

  productsRouter.post("/:id/upload", cloudMulterMedia.single("image"), async (req, res, next) => {
    try {
      const data = await pool.query(
        "UPDATE product SET image_url=$1 WHERE id=$2 RETURNING *;",
        [req.file.path, req.params.id]
      )
  
      const isUpdated = data.rowCount > 0;
      if (isUpdated) {
        res.status(200).send(data.rows[0]);
      } else {
        res.status(404).send({
          message: "Product not found therefore there is nothing to done.",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })


export default productsRouter;