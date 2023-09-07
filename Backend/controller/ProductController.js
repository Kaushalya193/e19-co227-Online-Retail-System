const db = require('../database');


async function getCategory(req, res) {

    try {
        const query1 = 'SELECT * FROM category';
        const query2 = 'SELECT * FROM sub_category';

        Promise.all([
            new Promise((resolve, reject) => {
                db.query(query1, [], (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }),
            new Promise((resolve, reject) => {
                db.query(query2, [], (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            }),
        ])
            .then(([category, subCategory]) => {
                // Combine category and subCategory data into a single object
                const combinedData = { category, subCategory };
                console.log(combinedData)
                // Send the combined data as a JSON response
                res.status(200).json(combinedData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                res.status(500).json({ error: 'Database error' });
            });



    }catch (e) {
        return  res.status(500).json({ error: 'Internal server error' });
    }
}

async function addProduct(req,res){
    try {

        let { sellerID,productName,categoryID,productPrice,productQty,productImage1,productImage2,productImage3,productImage4,productImage5,productDetails } = req.body;
        console.log(req.body)
        const query = 'INSERT INTO product ( sellerID,productName,categoryID,productPrice,productQty,productImage1,productImage2,productImage3,productImage4,productImage5,productDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)';
        db.query(query, [ sellerID,productName,categoryID,productPrice,productQty,productImage1,productImage2,productImage3,productImage4,productImage5,productDetails],(error,data)=>{
            if (error) {
                console.log(error)
                return res.status(500).json({ error: 'Database error' });
            }else {
                console.log("Product Added")
                return  res.status(200).json({message: 'Product Added'});

            }

        });

    } catch (error) {
        console.log(error)
        return  res.status(500).json({ error: 'Internal server error' });
    }

}

async function getTopSellingProducts(req, res) {
  try {
    const sql = 'SELECT * FROM product'; 
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Error fetching top-selling products from the database:', error);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(results); 
      }
    });
  } catch (error) {
    console.error('Error fetching top-selling products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function getNewlyAddedProducts(req, res) {
    try {
      const sql = 'SELECT * FROM product ORDER BY productID DESC LIMIT 2;';
      db.query(sql, (error, result) => {
        if (error) {
          console.error('Error fetching newly added products from the database:', error);
          res.status(500).json({ error: 'Database error' });
        } else {
          res.json(result);
        }
      });
    } catch (error) {
      console.error('Error fetching newly added products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

module.exports = {
  getTopSellingProducts,
  getNewlyAddedProducts,
  getCategory,addProduct
};
