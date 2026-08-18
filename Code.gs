/**
 * BACKEND SIMPLES — Google Apps Script + Google Sheets
 *
 * 1) Crie uma planilha no Google Sheets.
 * 2) Extensões > Apps Script.
 * 3) Cole este arquivo.
 * 4) Execute setup() uma vez.
 * 5) Implantar > Nova implantação > Aplicativo da Web.
 * 6) Execute como: você. Acesso: conforme sua política de publicação.
 * 7) Copie a URL /exec e cole em js/config.js no campo leadEndpoint.
 */

const SHEET_NAME = "Leads_e_Pedidos";

function setup() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);

  const headers = [
    "Timestamp","Tipo","Pedido","Nome Completo","Email","WhatsApp","Interesse",
    "CEP","Logradouro","Número","Complemento","Bairro","Cidade","UF",
    "Endereço Completo","Itens","Subtotal","Frete","Total","Consentimento"
  ];

  // Atualiza a linha de cabeçalho sem apagar pedidos já existentes.
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.setFrozenRows(1);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActive();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    setup();

    let data = {};
    try {
      data = JSON.parse(e.postData.contents || "{}");
    } catch (err) {
      data = e.parameter || {};
    }

    sh.appendRow([
      new Date(),
      safe_(data.tipo),
      safe_(data.pedido),
      safe_(data.nomeCompleto || data.nome),
      safe_(data.email),
      safe_(data.whatsapp),
      safe_(data.interesse),
      safe_(data.cep),
      safe_(data.logradouro),
      safe_(data.numero),
      safe_(data.complemento),
      safe_(data.bairro),
      safe_(data.cidade),
      safe_(data.uf),
      safe_(data.enderecoCompleto),
      safe_(data.itens),
      safe_(data.subtotal),
      safe_(data.frete),
      safe_(data.total),
      safe_(data.consentimento)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ok:true, service:"portfolio-infantil"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function safe_(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Evita fórmula injetada em células quando começa por =, +, - ou @.
  return /^[=+\-@]/.test(str) ? "'" + str : str;
}
