import ErroBase from "./ErroBase.js";

class ErroNaValidacao extends ErroBase {
  constructor(erro) {
    const mensagensErro = Object.values(erro.errors)
      .map(erro => erro.message)
      .join("; ");
    super(`Os seguintes erros foram encontrados: ${mensagensErro}`);
  }
}

export default ErroNaValidacao;
