import React, { Component } from 'react';
import Greeting from './Componets/Greeting';
import LineChart from './Componets/LineChart'
import moment from 'moment'
import { Container, Row, Col, Form, FormGroup, Label, Input, Button,ListGroup, ListGroupItem } from 'reactstrap'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      greeting:"Estadísticas Covid 19",
      countries:[],
      filteredCountries:[],
      countrySlug:"",
      country: "",
      isListHidden: true,
      startDate : "",
      endDate : "",
      countryData : []
    }
    this.changeCountryHandler = this.changeCountryHandler.bind(this)
    this.selectCountryHandler = this.selectCountryHandler.bind(this)
    this.changeDateHandler =this.changeDateHandler.bind(this)
    this.getCountryData = this.getCountryData.bind(this)
  }

  componentDidMount(){
    console.log("hola koders")
    fetch('https://api.covid19api.com/countries').then( response => {
      response.json().then( json => {
        console.log(json)
        this.setState( { countries : json } )
      })
    })
  }

  changeCountryHandler( event ){
    let value = event.target.value.toLowerCase()
    console.log(value)

    let filteredCountries = this.state.countries.filter( country => {
      return country.Slug.includes( value )
    } )

    console.log(filteredCountries)

    this.setState({ filteredCountries, isListHidden:false })
  }

  selectCountryHandler(event){
    let country = event.target.dataset.contryName
    let countrySlug = event.target.dataset.countrySlug
    this.setState({country, countrySlug, isListHidden:true });
  }

  changeDateHandler( event ){
      let key = event.target.name /*startDate || endDate */
      let value = moment(event.target.value).toISOString();

      this.setState( { [key] : value })
  }

  getCountryData(){
    fetch(`https://api.covid19api.com/country/${this.state.countrySlug}?from=${this.state.startDate}&to=${this.state.endDate}`).then( response => {
      response.json().then( json => {
        console.log(json)
        this.setState({ countryData: json })
      })
    })
  }

  render(){
    return(
      <div className="App bg-dark">
        <Container fluid>
          <Row>
            <Col xs='12' md='12'>
              <Greeting greeting={this.state.greeting} foo="bar" />
            </Col>
            <Col  xs='12' md='4'>
              <Form className="p-3 bg-light shadow rounded">
                <FormGroup className="position-relative">
                  <Label className="text-dark">País:</Label>
                  <Input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Escribe el nombre de un país"
                    onChange={this.changeCountryHandler}
                  ></Input>
                  <ListGroup>
                    {
                      this.state.filteredCountries.map( (country, index) => {
                        return(
                           <ListGroupItem
                           key={index}
                           className={`text-dark ${this.state.isListHidden ? `d-none` : '' }`}
                            data-country-name={country.Country}
                            data-country-slug={country.slug}
                            onClick={this.selectCountryHandler}
                            action
                            >
                            {country.Country}
                            </ListGroupItem>
                          )
                      })
                    }
                  </ListGroup>
                </FormGroup>
                <FormGroup>
                  <Label className="text-dark">Desde:</Label>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    onChange={this.changeDateHandler}
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Label className="text-dark">Hasta:</Label>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    onChange={this.changeDateHandler}
                  ></Input>
                </FormGroup>
                <Button
                  color="secondary"
                  className="btn-block"
                  type="button"
                  onClick={this.getCountryData}
                >Ver gráfica</Button>
              </Form>
            </Col>
            <Col xs='12' md='8'>
              <LineChart countryData={this.state.countryData} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

}

export default App;
