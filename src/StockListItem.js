import { TiDeleteOutline } from 'react-icons/ti';
const AWS_API_GATEWAY = 'https://ega8a1diz4.execute-api.us-east-1.amazonaws.com/prod/';
const DELETE_STOCK = AWS_API_GATEWAY+'delete-stock';

function StockListItem(props) {
  
  const { portfolioItem } = props;
  const profitClass = portfolioItem.profit < 0 ? 'loss' : 'profit';
  
  const deleteStock = evt => {
    const ticker = evt.currentTarget.getAttribute('data-ticker');
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ticker: ticker})
    }
    fetch(DELETE_STOCK, fetchOptions)
      .then(response => response.json())
      .then(response => {
        props.getPortfolio();
        console.log('delete-stock completed');
      })
      .catch(error => {
        console.log('fetch error');
      })
  }
  
  return (
    <tr>
      <td>
        <div onClick={deleteStock} data-ticker={portfolioItem.ticker}><TiDeleteOutline /></div>
      </td>
      <td>{portfolioItem.ticker}</td>
      <td>{portfolioItem.name}</td>
      <td>{portfolioItem.shares}</td>
      <td className="money">{portfolioItem.purchasePriceStr}</td>
      <td className="money">{portfolioItem.purchaseValueStr}</td>
      <td className="money">{portfolioItem.currentPriceStr}</td>
      <td className="money">{portfolioItem.currentValueStr}</td>
      <td className="money"><span className={profitClass}>{portfolioItem.profitStr}</span></td>
    </tr>
  );
}

export default StockListItem;
