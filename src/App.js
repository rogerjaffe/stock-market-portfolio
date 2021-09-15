import { useState, useEffect } from 'react';
import './App.css';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import StockList from './StockList';
import utilities from './utilities';

function App() {
  
  const AWS_API_GATEWAY = 'https://ega8a1diz4.execute-api.us-east-1.amazonaws.com/prod/';
  const GET_PORTFOLIO = AWS_API_GATEWAY+'get-portfolio';
  const GET_STOCK_PRICE = AWS_API_GATEWAY+'get-stock-price';
  // Uncomment setMyName if required, for example, if the name
  // is stored in the DynamoDB
  const [myName/*, setMyName*/] = useState('Roger');
  
  const [stocks, setStocks] = useState([]);
  const [tickerList, setTickerList] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [portfolioData, setPortfolioData] = useState([]);
  const getPortfolio = () => {
    const options = {
      method: 'POST',
      cache: 'default'
    };
    
    fetch(GET_PORTFOLIO, options)
      .then(function(response) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(function(response) {
        let lambdaResponse = JSON.parse(response.body);
        let stocks = lambdaResponse.Items.map(item =>{
          return {
            purchasePrice: item.purchasePrice.N,
            ticker: item.ticker.S,
            shares: item.shares.N,
          }
        });
        setStocks(stocks);
      })
      .catch(function(error) {
        console.log(error);
      })
  }
  
  const createTickerList = (stocks) => {
    let tickerList = stocks.reduce((tickerSet, stock) => {
      tickerSet.add(stock.ticker);
      return tickerSet;
    }, new Set())
    setTickerList(Array.from(tickerList));
  }
  
  const getStockPrice = (ticker) => {
    return new Promise((resolve, reject) => {
        const fetchOptions = {
          method: 'POST',
          body: JSON.stringify({ticker: ticker})
        }
      fetch(GET_STOCK_PRICE, fetchOptions)
        .then(response => response.json())
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
    })
  };
  
  // Retrieve the current stock information when the page loads
  useEffect(() => {
    getPortfolio();
  }, []);
  
  useEffect(() => {
    createTickerList(stocks);
  }, [stocks])
  
  // With the stock data add purchase value, current price
  // and current value to the stock record
  useEffect(() => {
    let promises = tickerList.map(ticker => getStockPrice(ticker));
    Promise.all(promises)
      .then(stocks => {
        const stockPrices = stocks.reduce((obj, stock) => {
          if (stock) {
            const info = {
              name: stock.data.longName,
              price: stock.data.regularMarketPrice
            }
            obj[stock.ticker] = info;
          }
          return obj;
        }, {});
        setStockPrices(stockPrices);
      })
  }, [tickerList]);
  
  useEffect(() => {
    const portfolioData = stocks.reduce((arr, stock) => {
      let obj = {...stock};
      const priceData = stockPrices[stock.ticker];
      obj.name = priceData ? priceData.name : "---";
      if (priceData) {
        obj.currentPrice = priceData.price;
        obj.currentPriceStr = utilities.formatNumber(obj.currentPrice);
        obj.purchasePriceStr = utilities.formatNumber(obj.purchasePrice);
        obj.purchaseValue = obj.purchasePrice * obj.shares;
        obj.currentValue = obj.currentPrice * obj.shares;
        obj.profit = obj.currentValue - obj.purchaseValue;
        obj.purchaseValueStr = utilities.formatNumber(obj.purchaseValue);
        obj.currentValueStr = utilities.formatNumber(obj.currentValue);
        obj.profitStr = utilities.formatNumber(obj.profit);
      }
      arr.push(obj);
      return arr;
    }, []);
    setPortfolioData(portfolioData);
  }, [stocks, stockPrices]);
  
  const addStock = evt => {
    console.log('add stock clicked');
  }

  return (
    <div className="App">
      <Card>
        <CardHeader className="card-header-color">
          <h4>{myName}'s Stock Portfolio</h4>
        </CardHeader>
        <CardBody>
          <StockList portfolioData={portfolioData} getPortfolio={getPortfolio} />
        </CardBody>
        <CardFooter>
          <Button size="sm" onClick={addStock}>Add stock</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
