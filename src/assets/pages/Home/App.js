import React, { Component } from 'react';
import { api, apiOfertaPut } from '../../services/api';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput, MDBAlert } from 'mdbreact';
import { Button, Modal } from 'react-bootstrap';
import Header from '../../components/Header/header.js';
import { parseJwt, usuarioAutenticado } from '../../services/auth';



export default class App extends Component {

  //#region  Construtor

  constructor() {
    super();

    let token = "";
    if (usuarioAutenticado()) {
      token = parseJwt().idUsuario;
    }

    this.state = {
      listarProduto: [],
      listarOferta: [],
      puxaCategorias: [],

      postReserva: {
        idOferta: "",
        titulo: "",
        idUsuario: token,
        quantidadeReserva: "",
        cronometro: "23:59:59",
        statusReserva: true
      },

      modal: false,
      modal2: false,
      modal3: false,
      modalProduto: false,
      modalOferta: false,
      modalReserva: false,
      show: false,


      logar: false
    }



  }
  //#endregion


  //#region Ciclos De Vida

  componentDidMount() {
    console.log("Página carregada")
    this.listaOfertaAtualizada();
    // this.puxaCategorias();
  }


  componentDidUpdate() {
    console.log("Pagina atualizada");
  }

  //#endregion


  //#region Togles

  toggleProduto = () => {
    this.setState({
      modalProduto: !this.state.modalProduto
    });

  }


  toggleOferta = () => {
    this.setState({
      modalOferta: !this.state.modalOferta
    });

  }


  toggle2 = () => {
    this.setState({
      modal2: !this.state.modal2
    });
  }


  toggle3 = () => {
    this.setState({
      modal3: !this.state.modal3
    });
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleReserva = () => {

    this.setState({
      modalReserva: !this.state.modalReserva
    });
  }

  //#endregion


  //#region Ofertas

  deleteOferta(id) {
    api.delete("Oferta/" + id)
      .then(response => {
        if (response === 200) {
          console.log('Item deletado')
        }
      }).catch(error => {
        console.log(error);
      })
    setTimeout(() => {
      this.listaOfertaAtualizada()
    }, 1000)
  }


  postOferta = (e) => {
    console.log(this.state.postSetStateOferta)
    e.preventDefault();
    let Oferta = new FormData();

    Oferta.set('idProduto', this.state.postSetStateOferta.idProduto);
    Oferta.set('titulo', this.state.postSetStateOferta.titulo);
    Oferta.set('dataOferta', this.state.postSetStateOferta.dataOferta);
    Oferta.set('dataVencimento', this.state.postSetStateOferta.dataVencimento);
    Oferta.set('preco', this.state.postSetStateOferta.preco);
    Oferta.set('quantidade', this.state.postSetStateOferta.quantidade);
    Oferta.set('imagemServer', this.state.postSetStateOferta.imagem.current.files[0]);
    Oferta.set('imagem', this.state.postSetStateOferta.imagem.current.value);

    console.log(this.state.postSetStateOferta.imagem.current.value)
    console.log(Oferta)

    fetch('http://localhost:5000/api/Oferta', {
      method: "POST",
      body: Oferta,
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.toggle2();
        this.listaOfertaAtualizada();
      })
      .catch(error => console.log('Não foi possível cadastrar:' + error))
  }


  putSetStateOferta = (input) => {
    this.setState({
      putSetStateOferta: {
        ...this.state.putSetStateOferta,
        [input.target.name]: input.target.value
      }
    })
  }


  putSetStateOfertaImg = (input) => {
    this.setState({
      putSetStateOferta: {
        ...this.state.putSetStateOferta,
        [input.target.name]: input.target.files[0]
      }
    })
  }


  listaOfertaAtualizada = () => {
    fetch("http://localhost:5000/api/Oferta")
      .then(response => response.json())
      .then(data => this.setState({ listarOferta: data })
        , console.log(this.listarOferta));
  }


  postSetStateOferta = (input) => {
    this.setState({
      postSetStateOferta: {
        ...this.state.postSetStateOferta,
        [input.target.name]: input.target.value
      }
    })
  }


  abrirModalOferta = (Oferta) => {
    this.toggle2();
  }


  abrirModalOferta2 = (Oferta) => {
    this.setState({ putSetStateOferta: Oferta });
    console.log(this.state.putSetStateOferta);
    this.toggle3();
  }


  putOferta = (e) => {
    e.preventDefault();
    let Oferta = new FormData();

    Oferta.set('idOferta', this.state.putSetStateOferta.idOferta);
    Oferta.set('idProduto', this.state.putSetStateOferta.idProduto);
    Oferta.set('titulo', this.state.putSetStateOferta.titulo);
    Oferta.set('dataOferta', this.state.putSetStateOferta.dataOferta);
    Oferta.set('dataVencimento', this.state.putSetStateOferta.dataVencimento);
    Oferta.set('preco', this.state.putSetStateOferta.preco);
    Oferta.set('quantidade', this.state.putSetStateOferta.quantidade);
    Oferta.set('imagems', this.state.putSetStateOferta.imagem.current.files[0], this.state.putSetStateOferta.imagem.value);
    Oferta.set('imagem', this.state.putSetStateOferta.imagem.value);

    console.log("aaa", Oferta)

    apiOfertaPut.put('Oferta/' + this.state.putSetStateOferta.idOferta, Oferta)
      .then(res => console.log("Sucesso"))
      .catch(error => {
        console.log("Erro: ", error);
      })

    this.toggle3();
    setTimeout(() => {
      this.listaOfertaAtualizada();
    }, 1500);
  }


  //#endregion


  //#region  Reserva
  cadastrarReservar = (c) => {
    c.preventDefault();


    api.post('/reserva', this.state.postReserva)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
        this.setState({ erroMsg: "Não foi possível cadastrar essa Reserva" });
      })
    setTimeout(() => {
      this.listaOfertaAtualizada();
    }, 1200);
    this.toggleReserva();
  }

  abrirModalReserva = (id, titulo) => {
      
      this.toggleReserva();
      this.setState({ ...this.state.postReserva.idOferta = id });
      this.setState({ ...this.state.postReserva.titulo = titulo });
      console.log("Post", this.state.postReserva);
  }


  logarReserva = () => {
      this.setState({
        logar: !this.state.logar
      })

      console.log(this.state.logar)
      console.log(this.usuarioAutenticado)      
  }

  logarReservaToggle = () => {
    this.logarReserva();
    
  }

  postSetStateReserva = (input) => {

    this.setState({
      postReserva: {
        ...this.state.postReserva,
        [input.target.name]: input.target.value
      }
    })

  }

  

  //#endregion




  render() {



    return (
      <div>
        <Header logar={this.state.logar}  {...this.props} />

        <main>

          <section class="container sessao-produtos">

            {
              this.state.listarOferta.map(
                function (Oferta) {
                  return (
                    <a key={Oferta.idOferta} class="card-item">

                      <div class="header-card">
                        <span class="uk-label uk-label-success .uk-position-right">Vencimento<br></br>{Oferta.dataVencimento}</span>
                        <img src={"http://localhost:5000/Images/" + Oferta.imagem} alt="" />
                        <div class="avaliacao">
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star unchecked"></span>
                          <span class="fa fa-star unchecked"></span>
                        </div>
                      </div>

                      <div class="main-card">
                        <p>{Oferta.titulo} - Quantidade: {Oferta.quantidade}</p>
                        <p class="preco">R$ {Oferta.preco}  ---  <span class="local">{Oferta.idProdutoNavigation.idUsuarioNavigation.nomeRazaoSocial}</span></p>
                      </div>

                      <div class="footer-card">
                        <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom" onClick={() => this.abrirModalReserva(Oferta.idOferta, Oferta.titulo)}>Adicionar a Reserva&nbsp;&nbsp;<span uk-icon="tag"></span>
                        </button>
                        <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom" onClick={() => this.logarReservaToggle()}>Teste&nbsp;&nbsp;<span uk-icon="tag"></span>
                        </button>
                      </div>
                    </a>
                  )
                }.bind(this)
              )
            }

            <MDBContainer>

              <form onSubmit={this.cadastrarReservar}>
                <MDBModal isOpen={this.state.modalReserva} toggle={this.toggleReserva}>
                  <div>
                    <MDBModalHeader toggle={this.toggleReserva}>Reservar - {this.state.postReserva.titulo}</MDBModalHeader>
                    <MDBModalBody>
                      <MDBInput type="numeric" label="Quantidade" name="quantidadeReserva" value={this.state.postReserva.quantidadeReserva} onChange={this.postSetStateReserva.bind(this)} />
                    </MDBModalBody>
                    <MDBModalFooter>
                      <MDBBtn color="secondary" onClick={this.toggleReserva}>Fechar</MDBBtn>
                      <MDBBtn color="primary" type="submit">Salvar</MDBBtn>
                    </MDBModalFooter>
                  </div>
                </MDBModal>
              </form>
            </MDBContainer>



          </section>
        </main>

      </div>
    );
  }
}