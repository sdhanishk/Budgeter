import React, { useEffect, useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';

import { Grid, Card, Container, Col, Row } from 'react-bootstrap';

import axios from 'axios';
import moment from 'moment';

import { appRoutes } from '../utils/config';
import { apis } from '../utils/apiConfig';
import Loading from '../components/Loading';
import EmptyResults from '../components/EmptyResults';
import { computeRecords, getFormattedDataFromTimeStamp, getMonthDetails } from '../utils/computeRecords';

const MainPage = (props) => {

  const [expenses, setExpenses] = useState(null);
  const [incomes, setIncomes] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState(null);
  const [records, setRecords] = useState(null);
  const [months, setMonths] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {

    await axios
      .get(apis.expenses)
      .then((response) => {
          setExpenses(response.data)
      })
      .catch((err) => console.log(err));
    
    await axios
    .get(apis.incomes)
    .then((response) => {
        setIncomes(response.data)
    })
    .catch((err) => console.log(err));

    await axios
    .get(apis.accounts)
    .then((response) => {
        setAccounts(response.data)
    })
    .catch((err) => console.log(err));

    await axios
    .get(apis.paymentTypes)
    .then((response) => {
        setPaymentTypes(response.data)
    })
    .catch((err) => console.log(err));

  }

  useEffect(() => {
    if(isDataNotAvailable()) {
      return;
    }
    getRecords();
  }, [paymentTypes, accounts, incomes, expenses]);

  function isDataNotAvailable() {

    if(expenses === null || accounts === null || incomes === null || paymentTypes === null ){
      return true;
    }

    return false;

  }

  function getRecords() {

    const {monthlyRecords, months} = computeRecords({expenses, incomes, accounts, paymentTypes});

    setMonths(months);
    setRecords(monthlyRecords);

  }

  function renderMonthlyRecord(month, index) {
    
    if(records === null){
      return;
    }

    let monthRecords = records[month];

    const {income, expense, remaining} = getMonthDetails(monthRecords);

    let carryOverBalance = 0;

    return (<Col key={index} xs={6} sm={6}>
      <Card style={{width: '100%'}}>
        <Card.Text>{getFormattedDataFromTimeStamp(month, 'MMM - YYYY')}</Card.Text>
        <Card.Text>{`Income: \u20A8 ${income}`}</Card.Text>
        <Card.Text>{`Expense: \u20A8 ${expense}`}</Card.Text>
        <Card.Text>{`Remaining: \u20A8 ${remaining}`}</Card.Text>
        <Card.Text>{`Carryover balance: \u20A8 ${carryOverBalance}`}</Card.Text>
        <Card.Text>{`Balance: \u20A8 ${remaining + carryOverBalance}`}</Card.Text>
      </Card>
    </Col>);
  }

  function renderRecords() {

    if(months == null){
      return <Loading/>;
    } else if(months == []) {
      return <EmptyResults message="No records found!"/>;
    } else {
      return months.map((month, index) => {
        return renderMonthlyRecord(month, index);
      });
    }

  }

  let history = useHistory();

  let addPage = () => {
    history.push(appRoutes.addPage);
  }

  const mainPageComponent = <Container>
    <Link href="#" onClick={addPage}>
      Add
    </Link>
    <Row>
      {renderRecords()}
    </Row>
  </Container>;

  return mainPageComponent;
}

export default MainPage;