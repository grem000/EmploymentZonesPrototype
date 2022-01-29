import React, { useState, useEffect } from 'react';
import './App.css';
// import AutoComplete from "react-google-autocomplete";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { newLandUseTables,oldLandUseTables,mandatedLandUseTables } from './data/landUseTables';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'




function App() {

  const [zone, setZone] = useState("");
  const [lga, setLga] = useState("");
  const [luts, setLuts] = useState({'objectives':'','permittedWithout':'','permittedWith':'','prohibited':''});
  const [mapURL, setMap] = useState("");
  const [propId, setPropId] = useState('');
  const [debug, setDebug] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // const [addressQuery, setAddressQuery ] = useState("")

  const handleAddressSearch = async (addressQuery) => {
    setIsLoading(true);

    const result = await fetch('https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/address?a=' + addressQuery + '&noOfRecords=10');
    const addressResult = await result.json()
    console.log("queried" + result.status,)
    console.log(addressResult)
    // setAddresses(addressResult.map(element=>{ return {label:element.address}}))
    setAddresses(addressResult)
    setIsLoading(false);

  }
  const filterBy = () => true;

  useEffect(() => {
    const fetchData = async () => {
      console.log("query" + propId)
      if (!propId) { 
        
        return
      }
      // const result = await fetch('https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/address?a=53 shadforth&noOfRecords=10');
      // const result2 = await fetch('https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/lot?propId='+propId,);

      const result2 = await fetch('https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/council?propId='+propId)
      // setZone("B1") 
      const council = await result2.json()
      console.log(council)
      setLga(council[0])
     
     
      const result3 = await fetch('https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/layerintersect?type=property&id='+propId+'&layers=epi' , Headers={Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImdSUGdwQk55UTNDdGVQZUZER2s3V1ZpUU02aGl4Z3BILU94VWszYU12Q0EifQ.eyJleHAiOjE2NDM0MzA1OTYsIm5iZiI6MTY0MzQzMDI5NiwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9vZWhjaXRpemVuc3VhdC5iMmNsb2dpbi5jb20vNDk3Y2E3ZGItNjExYS00YjAxLWI1MWQtYTNjMDg1ZjM4YjkwL3YyLjAvIiwic3ViIjoiMGYxYTIxYzMtODI1Zi00NGFlLThjNTQtODY2YzBlZjJkNDEzIiwiYXVkIjoiYWNjYWRkZjktMjVhNS00NDQ5LWI4ZDYtNDNjMzA0OTM2NjgzIiwibm9uY2UiOiJlZmY5OGIxMi04NDllLTQzZDgtODE3Ny1jZTJjN2ZjYjJkZmYiLCJpYXQiOjE2NDM0MzAyOTYsImF1dGhfdGltZSI6MTY0MzQzMDI5Niwic2lnbkluTmFtZSI6InN2c2VkZXBpdWF0dXNlcjFAeW9wbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiU1ZTRURlcGkiLCJmYW1pbHlfbmFtZSI6IlVBVFVzZXIxIiwiZ3JvdXBzIjpbIkctU0UtQUFELUIyQy1QRUdBLU9SRy1EUElFLVVBVCIsIkctU0UtQUFELUIyQy1QRUdBLVNwYXRpYWxWaWV3ZXJfRGVwYXJ0bWVudFVzZXItVUFUIl0sInRpZCI6IjQ5N2NhN2RiLTYxMWEtNGIwMS1iNTFkLWEzYzA4NWYzOGI5MCJ9.RMdXaRxvz4xn57lgK7FbcJIvQH1yvG6V_IM9MWxKXhRg0Fzamu5C3vZeH7et6FzYqdcZZJo9orO7fP8cC5I32H3NZYArzKTf2H21ycRaZGv9aVoGiHCEBn4jtqCrsD1dj4EVq_hKnA1-V-607_n0ibag3xBAxSKDu4kWNJHTdc1JSq17Y4pmOuDZRUVsHqcymLLEfdQSWvFlrVk036iUgP07-V56mK-P715gLjMnDUizbStiF4CYfqsNBNPp3jlkpxshZoBF5rFzxw38B20lH8uNLTK_QWnKc3rQZ0tkfBlf5BGGBcdNvIQed2Zxi6De4j099fFfbiuDoV7xDVc0Wg'})
      // dynamicLayers:[{"id":591,"source":{"mapLayerId":591,"type":"mapLayer"},"drawingInfo":{"showLabels":false,"transparency":0}}]
      // const addressResult = await result.json()
      // console.log("queried"+result.status, )
      // setAddresses(addressResult)
      // console.log("queried" + result2.status, await result2.json())
      console.log("queried layers" + result3.status)
      const lotData = await result3.json()
      console.log("lotdata="+lotData)
      for (let index = 0; index < lotData.length; index++) {
        const element = lotData[index];
        console.log(element)

        if (element.id === '19') { // id = 19? 
          console.log("found " + JSON.stringify(element.results[0].Zone, "", 2))
          setZone(element.results[0].Zone)
        }

      }
      // console.log("queried"+ await JSON.stringify(result.json(),"",2))

      setDebug(null);
    };

    fetchData();
  }, [propId]);

  useEffect(()=>{
    // todo: get right LUT from data for current Zone/LGA - refer to scrape_luts_from_qord.py
    setLuts(newLandUseTables[0])
  },[zone,lga])

  // const b7 = (<div><b>1   Objectives of zone</b>
  //   <li>  To provide a range of office and light industrial uses.</li>
  //   <li> To encourage employment opportunities.</li>
  //   <li>  To encourage uses in the arts, technology, production and design sectors.</li>
  //   <b>2   Permitted without consent</b><br />
  //   Home occupations<br />
  //   <b>3   Permitted with consent</b><br />
  //   Centre-based child care facilities; Food and drink premises; Garden centres; Hardware and building supplies; Light industries; Neighbourhood shops; Office premises; Oyster aquaculture; Passenger transport facilities; Respite day care centres; Roads; Tank-based aquaculture; Vehicle sales or hire premises; Warehouse or distribution centres; Any other development not specified in item 2 or 4<br />
  //   <b>4   Prohibited</b><br />
  //   Advertising structures; Agriculture; Air transport facilities; Airstrips; Amusement centres; Animal boarding or training establishments; Biosolids treatment facilities; Boat launching ramps; Boat sheds; Camping grounds; Caravan parks; Cemeteries; Charter and tourism boating facilities; Correctional centres; Crematoria; Depots; Eco-tourist facilities; Electricity generating works; Entertainment facilities; Environmental facilities; Environmental protection works; Exhibition homes; Exhibition villages; Extractive industries; Farm buildings; Forestry; Freight transport facilities; Heavy industrial storage establishments; Helipads; Highway service centres; Home-based child care; Home occupations (sex services); Industrial training facilities; Industries; Jetties; Marinas; Mooring pens; Moorings; Mortuaries; Open cut mining; Pond-based aquaculture; Port facilities; Recreation facilities (major); Recreation facilities (outdoor); Registered clubs; Research stations; Residential accommodation; Resource recovery facilities; Restricted premises; Retail premises; Rural industries; Sewage treatment plants; Sex services premises; Tourist and visitor accommodation; Transport depots; Truck depots; Vehicle body repair workshops; Vehicle repair stations; Waste disposal facilities; Water recreation structures; Water recycling facilities; Water supply systems; Wharf or boating facilities<br />
  //   LUTS: {luts}<br />
  //   <br /> </div>)

  return (
    <div className="App">
      <header className="App-header">
        <img src="https://www.nsw.gov.au/sites/default/files/2020-07/NSW-Government-official-logo.jpg" alt="logo" className='App-logo' />
      </header>
      <p>Address:
        
        {/* <AutoComplete
        apiKey={'AIzaSyBdeB3jK5qqCUotzuN5nLVA3EeeDBt9vGE'}
        onPlaceSelected={(place) => { console.log(place); setZone("B7"); setLuts(b7); setQuery(place) }}
      // options={{componentRestrictions:{country:'au'},fields:"geometry.location"}}
      />
       */}
      
      <AsyncTypeahead
        id="location"
        filterBy={filterBy}
        isLoading={isLoading}
        labelKey="address"
        onSearch={handleAddressSearch}
        options={addresses}
        minLength={5}
        onChange={(x)=>{ if (x[0]) { setPropId(x[0].propId)}} }
        
      />
</p>

      <div>
      <b>LGA </b>: {lga} <br />
      <b>Zone </b>: {zone} <br />
<br/>
        <table>
          <thead>
          <tr><th>Old</th><th>New</th></tr>
          </thead>
          <tbody>
          <tr> <td>{luts.objectives}</td><td>{luts.objectives} <br/><br/>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Label>Feedback on Objective</Form.Label>
    <Form.Control as="textarea" rows={3} />
  </Form.Group></td></tr>
          <tr> <td>{luts.permittedWithout}</td><td>{luts.permittedWithout}<br/><br/>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Label>Feedback on Permitted without consent</Form.Label>
    <Form.Control as="textarea" rows={3} />
  </Form.Group></td></tr>
          <tr> <td>{luts.permittedWith}</td><td>{luts.permittedWith}<br/><br/>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Label>Feedback on permitted with consent</Form.Label>
    <Form.Control as="textarea" rows={3} />
  </Form.Group></td></tr>
          <tr> <td>{luts.prohibited}</td><td>{luts.prohibited}<br/><br/>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Label>Feedback on prohibited</Form.Label>
    <Form.Control as="textarea" rows={3} />
  </Form.Group></td></tr>
          </tbody>
        </table>





    <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" placeholder="Enter email" />
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
  </Form.Group>

  <Button variant="primary">Submit</Button>

        <h2>{debug}</h2>




      </div>


      {/* <iframe src={mapURL}></iframe> */}
      {/* 
https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/address?a=53 shadforth&noOfRecords=10
https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/lot?propId=764913 */}




    </div>

  );



}

export default App;
