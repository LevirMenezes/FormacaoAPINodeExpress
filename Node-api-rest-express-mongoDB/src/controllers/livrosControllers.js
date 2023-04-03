import { livros } from "../models/index.js";
import { autores } from "../models/index.js";
import NaoEncontrado from "../../erros/NaoEncontrado.js";

class LivroController {

  static listarLivros = async(req, res, next) => {
    try
    {
      const buscaLivros = livros.find();

      req.resultado = buscaLivros;

      next();

    }
    catch (erro)
    {
      next(erro);
    }

  };

  static listarLivrosPorId = async (req, res, next) => {
    try
    {
      const id = req.params.id;

      const livrosResultado = await livros.findById(id, {}, { autopopulate: false })
        .populate("autor");

      if (livrosResultado !== null) {
        res.status(200).send(livrosResultado);
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    }
    catch (erro)
    {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try
    {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    }
    catch (erro)
    {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try
    {
      const id = req.params.id;

      const livrosResultado = await livros.findByIdAndUpdate(id, { $set: req.body });

      if (livrosResultado !== null) {
        res.status(200).send({ message: "Livro atualizado com sucesso" });
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    }
    catch (erro)
    {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try
    {
      const id = req.params.id;

      const livrosResultado = await livros.findByIdAndDelete(id);

      if (livrosResultado !== null) {
        res.status(200).send({message: "Livro removido com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }


    }
    catch (erro)
    {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try
    {
      const busca = await processaBusca(req.query);

      if (busca !== null) {
        const livrosResultado = livros
          .find(busca);

        req.resultado = livrosResultado;

        next();
      } else {
        res.status(200).send([]);
      }
    }
    catch (erro)
    {
      next(erro);
    }
  };
}

async function processaBusca(parametros)
{
  const { editora, titulo, maxPaginas, minPaginas, nomeAutor } = parametros;
  let busca = {};

  if (editora) busca.editora = editora;

  if (titulo) busca.titulo = { $regex: titulo, $options: "i" };//essa alternativa {$regex: titulo, $options: "i"} é uma alternativa própria do mongoDB

  if (minPaginas || maxPaginas) busca.numeroPaginas = {};

  // operador do mongoDB $gte = GREATER THAN OR EQUAL = MAIOR OU IGUAL QUE
  if (minPaginas) busca.numeroPaginas.$gte = minPaginas;

  // operador do mongoDB $lte = LESS THAN OR EQUAL = MENOR OU IQUAL QUE
  if (maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if (nomeAutor) {
    const autor = await autores.findOne({ nome: nomeAutor });

    if (autor !== null) {
      busca.autor = autor._id;
    } else {
      busca = null;
    }

    return busca;
  }
}
export default LivroController;
