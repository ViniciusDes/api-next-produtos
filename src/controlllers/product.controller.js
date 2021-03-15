const db = require('../config/database');
const pg = require('pg');

module.exports = {
  //Metado resposanvel pela listagem individual
  async listaProduto(req, res) {
    console.log(req.query.tipoPesq);

    if (req.query.tipoPesq == '0') {
      //pesquisa por codigo
      console.log('pesquisa por codigo');

      const mat_001 = parseInt(req.query.codProduto);
      const response = await db.query(
        'SELECT mat_001, mat_003, mat_008, mat_016, Valor_atacado, mat_012, mat_014 FROM materiais WHERE mat_001 =$1',
        [mat_001],
      );
      if (req.params.id != mat_001) {
        console.log('Produto nao encontrado');
      }
      res.status(200).send(response.rows);
    } else {
      console.log('pesquisa por descrição');

      const mat_003 = req.query.descProduto;

      const response = await db.query(
        `SELECT mat_001, mat_003, mat_008, mat_016, Valor_atacado, mat_012, mat_014 FROM materiais WHERE mat_003 LIKE '%${mat_003.toUpperCase()}%'`,
      );
      // console.log(response);
      if (req.query.descProduto != mat_003) {
        console.log('Produto nao encontrado');
      }
      console.log(response.rows);

      res.status(200).send(response.rows);
    }
  },

  //Metado resposanvel pela listagem individual
  async listaTodosProdutos(req, res) {
    console.log('listssa ');
    const response = await db.query(
      'SELECT mat_001, mat_003, mat_008, mat_016, Valor_atacado, mat_012, mat_014 FROM materiais  ORDER BY mat_003 LIMIT 30',
    );

    res.status(200).send(response.rows);
  },

  async registerProduct(req, res) {
    var {
      mat_001, //ID
      emp_001, //ID_EMPRESA
      mat_003, //DESCRICAO
      mat_004, //COD.PROD
      uni_001, //ID_UNIDADE
      mat_008, //PRECO_VAREJO
      mtp_001, //Tipo1=MATERIAL/2=SERVICO
      mat_009, //
      sit_001, //
      usu_001_1, //
      usu_001_2, //
      mat_012, //PRE_CUSTO
      mat_014, //
      mat_015, //
      mat_016, //ESTOQUE_ATUAL
      mat_017, //
      cat_001, //CATEGORIA
      mat_018, //MARGEM_LUCRO_VAREJO
      mat_020, //
      mat_021, //
      orm_codigo, //
      cfop_consumidor, //cfop_consumidor
      pis_codigo_saida, //pis_codigo_saida
      cof_codigo_saida, //cof_codigo_saida
      ncm, //
      cso_codigo, //cso_codigo
      tipo_producao, //
      valor_tam_m, //
      b_venda_tamanho, //
      tamanho_padrao, //
      valor_tabela2, //
      valor_atacado, //valor_atacado
      taxClassification, //classificação fiscal 0 - isento 1 tributado 2 - substituição
    } = req.body;

    async function trataErros() {
      if (mat_001 === '' || mat_001 == null) {
        const resMaxId = await getLastIdProduct();
        const { max } = resMaxId;
        mat_001 = max + 1;
        //informações estaticas---------------------------------------------------------------------
      }

      mtp_001 = 1;
      mat_009 = 0;
      sit_001 = 4;
      usu_001_1 = 1;
      usu_001_2 = 2;
      mat_014 = 0.0;
      mat_015 = 0.0;
      mat_017 = 0.0;
      mat_020 = 0;
      mat_021 = 0;
      orm_codigo = 0;
      tipo_producao = 'p';
      valor_tam_m = 1.0;
      b_venda_tamanho = false;
      tamanho_padrao = 'M';
      valor_tabela2 = 1.2;

      if (taxClassification === 0) {
        //isento
        cfop_consumidor = 5102;
        pis_codigo_saida = 49;
        cof_codigo_saida = 49;
        cso_codigo = 300;
      }
    }

    await trataErros();

    async function getLastIdProduct() {
      const resp = await db.query('SELECT (MAX(mat_001)) FROM materiais');
      return resp.rows[0];
    }

    const response = db.query();

    res.send([
      mat_001, //ID
      emp_001, //ID_EMPRESA
      mat_003, //DESCRICAO
      mat_004, //COD.PROD
      uni_001, //ID_UNIDADE
      mat_008, //PRECO_VAREJO
      mtp_001, //Tipo1=MATERIAL/2=SERVICO
      mat_009, //
      sit_001, //
      usu_001_1, //
      usu_001_2, //
      mat_012, //PRE_CUSTO
      mat_014, //
      mat_015, //
      mat_016, //ESTOQUE_ATUAL
      mat_017, //
      cat_001, //CATEGORIA
      mat_018, //MARGEM_LUCRO_VAREJO
      mat_020, //
      mat_021, //
      orm_codigo, //
      cfop_consumidor, //cfop_consumidor
      pis_codigo_saida, //pis_codigo_saida
      cof_codigo_saida, //cof_codigo_saida
      ncm, //
      cso_codigo, //cso_codigo
      tipo_producao, //
      valor_tam_m, //
      b_venda_tamanho, //
      tamanho_padrao, //
      valor_tabela2, //
      valor_atacado, //valor_atacado
      taxClassification,
    ]);
  },

  async getListCategorys(req, res) {
    try{
      const resp = await db.query('SELECT cat_001, cat_002 FROM categoria');
      res.status(200).send({data: resp.rows});

    }catch(err){
      res.status(240).send({message: err});

    }
  },

  async getLastIdProduct(req, res) {
    const resp = await db.query('SELECT (MAX(mat_001)) FROM materiais');
    res.send(resp.rows[0]);
  },

  async updateProduct(req, res) {
    const data = req.body;
    const codigo = data.codigo;
    const description = data.description;
    const countStock = data.countStock;
    const price = data.price;
    console.log(data);
    try {
      const response = await db.query(
        'UPDATE MATERIAIS SET mat_003 =$1, mat_008 =$2, mat_016 =$3 WHERE mat_001 =$4',
        [description, price, countStock, codigo],
      );
      res.status(200).send({ message: 'produto alterado com sucesso' });
    } catch {
      err => {
        console.log(err);
      };
      res.status(240).send({ message: 'error internal server' });
    }
  },
  //Metodo responsavel pela atualização do preço
  // async updatePreco(req, res) {
  //   const mat_001 = parseInt(req.params.id);
  //   const { mat_008 } = req.body;

  //   const response = await db.query(
  //     "UPDATE MATERIAIS SET mat_008 =$3 WHERE mat_001 =$4",
  //     [mat_008, mat_001]
  //   );

  //   res.status(200).send({ messange: "Preço atualizado!" });
  // },
};
