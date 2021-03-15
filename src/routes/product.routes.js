const router = require('express-promise-router')();
const productController = require('../controlllers/product.controller');

// ==> Definindo as rotas do CRUD - 'Product':

// ==> Rota responsável por consultar e atualizar dados no banco
router.get('/products/search', productController.listaProduto);
router.get('/products/', productController.listaTodosProdutos);
router.get('/product/category', productController.getListCategorys);
router.put('/product/update', productController.updateProduct);
router.post('/product/create', productController.registerProduct);

module.exports = router;
