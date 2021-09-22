import { useState, useEffect } from 'react';
import { Form, FormGroup, Input, Button, Label, Row, Col } from 'reactstrap';
import './App.css';
import StockList from './StockList';
import utilities from './utilities';

function AddStockForm(props) {
  
  const AWS_API_GATEWAY = 'https://ega8a1diz4.execute-api.us-east-1.amazonaws.com/prod/';
  const ADD_STOCK = AWS_API_GATEWAY+'add-stock';
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [addStockError, setAddStockError] = useState(false);

  const onChange = function(setFcn) {
    return function(evt) {
      setFcn(evt.currentTarget.value.toUpperCase());
    }
  }

  useEffect(() => {
    let isValid = (ticker.length > 0);              // ticker isn't blank
    isValid = isValid && (shares.length > 0);       // shares isn't blank
    isValid = isValid && (purchasePrice.length > 0);// purchasePrice isn't blank
    isValid = isValid && !/[^A-Z]/.test(ticker);    // ticker has letters only
    setIsValid(isValid);
  }, [ticker, shares, purchasePrice]);
  
  const addStock = () => {
    setAddStockError(false);
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ticker, shares, purchasePrice})
      // body: JSON.stringify({ticker, shares:parseInt(shares,10), purchasePrice:parseInt(purchasePrice,10)})
    }
    fetch(ADD_STOCK, fetchOptions)
      .then(response => {
        props.getPortfolio();
        props.closeAddStockForm();
      })
      .catch(error => {
        setAddStockError(true);
      })
  };
  
  return (
    <Row>
      <Col md={{size:4, offset: 4}}>
        <FormGroup row>
          <Label for="ticker">Ticker symbol:</Label>
          <Input type="text" name="ticker" id="ticker" placeholder="Ticker" value={ticker} onChange={onChange(setTicker)} />
        </FormGroup>
        <FormGroup row>
          <Label for="shares">Shares purchased:</Label>
          <Input type="number" name="shares" id="shares" placeholder="Shares" value={shares} onChange={onChange(setShares)} />
        </FormGroup>
        <FormGroup row>
          <Label for="purchasePrice">Purchase price</Label>
          <Input type="number" name="purchasePrice" id="purchasePrice" placeholder="Purchase price" value={purchasePrice} onChange={onChange(setPurchasePrice)} />
        </FormGroup>
        <Button disabled={!isValid} onClick={addStock}>Add stock</Button>
        <Button onClick={props.closeAddStockForm}>Cancel</Button>
        {
          addStockError ? <div className="add-stock-error">There was an error adding the stock</div> : null
        }
      </Col>  
    </Row>
  );
}

export default AddStockForm;
