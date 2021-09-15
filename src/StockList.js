import { Table } from 'reactstrap';
import StockListHeader from './StockListHeader';
import StockListItem from './StockListItem';
import StockListTotals from './StockListTotals';

function StockList(props) {

  const sortedStockList = props.portfolioData.sort((a,b) => a.name < b.name ? -1 : 1); 
  
  return (
    <Table>
      <thead>
        <StockListHeader />
      </thead>
      <tbody>
        {
          sortedStockList.map((item, idx) => <StockListItem key={idx} portfolioItem={item} getPortfolio={props.getPortfolio} /> )
        }
      </tbody>
      <tfoot>
        <StockListTotals portfolioData={props.portfolioData} />
      </tfoot>
    </Table>
  );
}

export default StockList;
