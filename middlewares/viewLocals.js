<<<<<<< HEAD
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
=======
const { Category } = require('../models/index');

/**
 * Middleware to make category data available to all views.
 * This ensures the navigation bar and other components have access to 
 * categories without needing to fetch them in every controller.
 */
module.exports = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        res.locals.allCategories = categories || [];
        next();
    } catch (err) {
        console.error("Error in viewLocals middleware:", err);
        res.locals.allCategories = [];
        next();
    }
};
>>>>>>> 1bb3d35b65a2e6fce9a0c0b685bf969fee8f7914
