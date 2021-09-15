import numeral from 'numeral';

const utilities = {
  formatNumber: m => Number.isNaN(m) ? "----" : numeral(m).format('0,0.00')
}

export default utilities;
