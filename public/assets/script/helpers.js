const MONTHS_NAMES = {
  1: 'Janeiro',
  2: 'Fevereiro',
  3: 'Março',
  4: 'Abril',
  5: 'Maio',
  6: 'Junho',
  7: 'Julho',
  8: 'Agosto',
  9: 'Setembro',
  10: 'Outubro',
  11: 'Novembro',
  12: 'Dezembro',
}

const getMonthName = (month) => MONTHS_NAMES[Number(month)]

const $get = (url) =>
  new Promise((resolve) => {
    $.get(url, (data) => resolve(data))
  })

const $currency = (amount) =>
  Number(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
