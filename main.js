// main.js

const form = document.getElementById("oracleForm");  //  Captura formulário <form id="oracleForm"> 
const resultCard = document.getElementById("resultCard");
const resultText = document.getElementById("resultText");

//google forms conexao
const googleFormsUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSeAkmIJ7xqdLKkdbch92AozzZgVXKZDba4bmqi09Pfn_ZJQlQ/formResponse";

form.addEventListener("submit", function(event) {
  event.preventDefault(); // impedir que a página recarregue ao enviar o formulário

  const nome = document.getElementById("name").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const email = document.getElementById("email").value;
  const tema = document.getElementById("theme").value;
  const contactTime = document.getElementById("contactTime").value;
  const contactPermission = document.getElementById("contactPermission").checked;

  if (!contactPermission) {
    alert("Você precisa aceitar o contato para continuar.");
    return;
  }

  const temaMensagem = mensagens[tema];
  const randomIndex = Math.floor(Math.random() * temaMensagem.length); 
  //temaMensagem.length é o tamanho do array. 3 neste caso. Math.random() gera numero >=0 e < 1
  const mensagemFinal = temaMensagem[randomIndex];

  const lead = {
    nome: nome,
    whatsapp: whatsapp,
    email: email,
    tema: tema,
    melhorHorario: contactTime,
    aceitaContato: contactPermission,
    mensagemRecebida: mensagemFinal,
    dataCadastro: new Date().toLocaleString("pt-BR")
  };

  /* -> Cria um objeto chamado lead -> Salva esse lead no localStorage */
 
  saveLeadLocalStorage(lead);
  sendLeadToGoogleForms(lead);

  resultText.innerHTML = `${mensagemFinal}`;
 
  resultCard.classList.remove("hidden"); 
  setTimeout(() => {
  resultCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 150); // aguara 150 ms para exibir e deslocar

  form.reset();
});

function saveLeadLocalStorage(lead) {
  const leadsSalvos =
    JSON.parse(localStorage.getItem("leadsOraculo")) || []; //ou

  leadsSalvos.push(lead); // cria lead

  localStorage.setItem("leadsOraculo", JSON.stringify(leadsSalvos));
}

function sendLeadToGoogleForms(lead) {
  const formData = new FormData();

  formData.append("entry.1375783715", lead.nome);
  formData.append("entry.1946200012", lead.whatsapp);
  formData.append("entry.1515234327", lead.email);
  formData.append("entry.1514016522", lead.tema);
  formData.append("entry.1924634358", lead.melhorHorario);

  fetch(googleFormsUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}