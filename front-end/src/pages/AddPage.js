import React, { useState, useEffect } from 'react';
import { TextField, Form, Card, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';

import { apis } from '../utils/apiConfig';
import { appRoutes } from '../utils/config';

function AddPage(props) {

  const [accounts, setAccounts] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState(null);
  const [categories, setCategories] = useState(null);

  const defaultItem = {
    name: "",
    category: "",
    quantity: 0,
    price_per_unit: 0,
    paid_with_account: "",
    payment_type: "",
    description: ""
  };

  const defaultPlace = {
    items: [defaultItem]
  }

  const defaultExpenseData = {
    places: [defaultPlace]
  };
  
  const [expenseData, setExpenseData] = useState(defaultExpenseData);

  const history = useHistory();

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {

    await axios
    .get(apis.categories)
    .then((response) => {
        setCategories(response.data)
    })
    .catch((err) => console.log(err));

    await axios
    .get(apis.paymentTypes)
    .then((response) => {
        setPaymentTypes(response.data)
    })
    .catch((err) => console.log(err));

    await axios
    .get(apis.accounts)
    .then((response) => {
        setAccounts(response.data)
    })
    .catch((err) => console.log(err));

  }

  const AddingTypes = {
    INCOME: 'income',
    EXPENSE: 'expense'
  };

  const [formType, setFormType] = useState(AddingTypes.INCOME);

  const formData = {
    sources: []
  };

  const source = {
    description: "",
    name: "",
    amount: 0,
    account: ""
  };

  function renderExpensesForm() {

    if(accounts == null) {
      return;
    }

    if(paymentTypes == null) {
      return;
    }

    if(categories == null) {
      return;
    }

    const onDateChange = (e) => {

      const _expenseData = {...expenseData};

      if(e.target.value == '') {
        delete(_expenseData.datetime);
      }

      _expenseData.datetime = e.target.value;

      setExpenseData(_expenseData);

    }

    const onNameChange = (e, index) => {

      const _expenseData = {...expenseData};

      _expenseData.places[index].name = e.target.value;

      setExpenseData(_expenseData);

    }

    const onItemNameChange = (e, placeIndex, index) => {

      const _expenseData = {...expenseData};

      _expenseData.places[placeIndex].items[index].name = e.target.value;

      setExpenseData(_expenseData);

    }

    const onNumberChange = (e, placeIndex, index, key) => {

      const _expenseData = {...expenseData};

      _expenseData.places[placeIndex].items[index][key] = e.target.value;

      setExpenseData(_expenseData);

    }

    const renderCategories = () => {

      if(categories == null){
        return;
      }
  
      return <>
        {categories.map((category, index) => {
          // if(index == 0){
          //   source.account = account._id;
          // } 
          return <option value={category._id} key={'category'+index}>{category.name}</option>
        })}
      </>;

    }

    const renderAccounts = () => {

      if(accounts == null){
        return;
      }
  
      return <>
        {accounts.map((account, index) => {
          // if(index == 0){
          //   source.account = account._id;
          // } 
          return <option value={account._id} key={'account'+index}>{account.bank}</option>
        })}
      </>;

    }

    const renderPaymentTypes = () => {

      if(paymentTypes == null){
        return;
      }
  
      return <>
        {paymentTypes.map((paymentType, index) => {
          // if(index == 0){
          //   source.account = account._id;
          // } 
          return <option value={paymentType._id} key={'paymentType'+index}>{paymentType.type}</option>
        })}
      </>;

    }

    const addItemToPlace = (index) => {

      const _expenseData = {...expenseData};

      _expenseData.places[index].items.push(defaultItem);

      setExpenseData(_expenseData);

    }

    const addPlace = () => {

      const _expenseData = {...expenseData};

      _expenseData.places.push(defaultPlace);

      setExpenseData(_expenseData);

    }

    function addExpenseData(e) {
      e.preventDefault()
      if(typeof expenseData.datetime != 'undefined'){
        let datetime = moment(expenseData.datetime, "DD/MM/YYYY").toDate().getTime();
        expenseData.datetime = datetime;
      }

      axios
        .post(apis.addExpense, expenseData)
        .then(() => {
            history.push(appRoutes.mainPage);
        })
        .catch((err) => {
            console.log(err);
        });

    }

    return <Form>
      <Card style={{padding: 8, backgroundColor: '#e74c3c'}}>
        <Form.Group controlId="form.datetime">
          <Form.Label>Date</Form.Label>
          <Form.Control type="text" onChange={onDateChange}/>
        </Form.Group>
        {expenseData.places.map((place, placeIndex) => {
          return <Card key={'places'+placeIndex} style={{padding: 8, marginBottom: 8, backgroundColor: '#bdc3c7'}}> 
          <h3>{`Place #${placeIndex+1}`}</h3>
          <Form.Group controlId="form.name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" onChange={(e) => onNameChange(e, placeIndex)} value={place.name}/>
          </Form.Group>
          {place.items.map((item, index) => {
            return <Card key={'items'+index} style={{padding:8, marginBottom:8, backgroundColor: '#ecf0f1'}}>
              <h4>{`Item #${index+1}`}</h4>
              <Form.Group controlId="form.item.name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" onChange={(e) => onItemNameChange(e, placeIndex, index)} value={item.name}/>
              </Form.Group>
              <Form.Group controlId="form.item.category">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" onChange={(e) => {}}>
                  {renderCategories()}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="form.item.quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" onChange={(e) => {onNumberChange(e, placeIndex, index, 'quantity')}} value={item.quantity}/>
              </Form.Group>
              <Form.Group controlId="form.item.price_per_unit">
                <Form.Label>Price/Unit</Form.Label>
                <Form.Control type="number" onChange={(e) => {onNumberChange(e, placeIndex, index, 'price_per_unit')}} value={item.price_per_unit}/>
              </Form.Group>
              <Form.Group controlId="form.item.account">
                <Form.Label>Account</Form.Label>
                <Form.Control as="select" onChange={(e) => {}}>
                  {renderAccounts()}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="form.item.payment_type">
                <Form.Label>Payment type</Form.Label>
                <Form.Control as="select" onChange={(e) => {}}>
                  {renderPaymentTypes()}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="form.item.description">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" onChange={(e) => {}} value={item.description}/>
              </Form.Group>
            </Card>
          })}
          <Button type='button' onClick={() => {addItemToPlace(placeIndex)}}>Add Item</Button>
          </Card>
        })}
        <Button type='button' onClick={() => {addPlace()}}>Add Place</Button>
      </Card>
      <Button type='button' onClick={(e) => {addExpenseData(e)}}>Submit</Button>
    </Form>;

  }

  function renderMenuItems() {

    if(accounts == null){
      return;
    }

    return <>
      {accounts.map((account, index) => {
        if(index == 0){
          source.account = account._id;
        } 
        return <option value={account._id} key={index}>{account.bank}</option>
      })}
    </>;

  }

  const onNameChange = (e) => {

    source.name = e.target.value;

  }

  const onAmountChange = (e) => {

    source.amount = e.target.value;

  }

  const onDescriptionChange = (e) => {

    source.description = e.target.value;

  }

  const onAccountChange = (e) => {

    source.account = e.target.value;

  }

  const onDateChange = (e) => {

    if(e.target.value == '') {
      delete(source.datetime);
    } 

    source.datetime = e.target.value;
  }

  function addData(e) {
    e.preventDefault()
    if(typeof source.datetime != 'undefined'){
      console.log(source.datetime);
      let datetime = moment(source.datetime, "DD/MM/YYYY").toDate().getTime();
      source.datetime = datetime;
    }
    
    formData.sources.push(source);

    axios
      .post(apis.addIncome, formData)
      .then(() => {
          history.push(appRoutes.mainPage);
      })
      .catch((err) => {
          console.log(err);
      });

  }

  const incomeForm = <Card style={{padding: 8, marginBottom: 8}}>
    <Form>
    <Form.Group controlId="form.datetime">
        <Form.Label>Date</Form.Label>
        <Form.Control type="text" onChange={onDateChange}/>
      </Form.Group>
      <Form.Group controlId="form.name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" onChange={onNameChange}/>
      </Form.Group>
      <Form.Group controlId="form.amount">
        <Form.Label>Amount</Form.Label>
        <Form.Control type="number" onChange={onAmountChange}/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Account</Form.Label>
        <Form.Control as="select" onChange={onAccountChange}>
          {renderMenuItems()}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="form.description">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" onChange={onDescriptionChange}/>
      </Form.Group>
      <Button variant="primary" type="button" onClick={addData}>
        Add
      </Button>
    </Form>
  </Card>;

  function changeType() {

    if(formType == AddingTypes.INCOME){
      setFormType(AddingTypes.EXPENSE);
    } else {
      setFormType(AddingTypes.INCOME);
    }

  }

  return accounts == null ? "Loading..." : <>
    <Link to="#" onClick={changeType}>
      Change Form Type
    </Link>
    <h2>{formType.toUpperCase()}</h2>
    {formType == AddingTypes.INCOME ? incomeForm : renderExpensesForm()}
  </>;

}

export default AddPage;