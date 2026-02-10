// const { Category } = require('../models/index');

// module.exports = async (req, res, next) => {
//     try {
//         const categories = await Category.findAll({
//             order: [['name', 'ASC']]
//         });
//         res.locals.allCategories = categories || [];
//         next();
//     } catch (err) {
//         console.error("Error in viewLocals middleware:", err);
//         res.locals.allCategories = [];
//         next();
//     }
// };
