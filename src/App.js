import React, { useState, useEffect } from 'react';
import './App.css';
// import AutoComplete from "react-google-autocomplete";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { newLandUseTables,mandatedLandUseTables } from './data/landUseTables';
import { oldLandUseTables } from './data/oldLandUseTables';
import {allLandUseTerms, allLandUseTermsGrouped} from './data/allLandUseTerms'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { renderIntoDocument } from 'react-dom/cjs/react-dom-test-utils.production.min';

// const findGroupTerm = (groupsTerms,term) =>{

//   groupsTerms.forEach((element)=>{
//     if (element.term === term){
//       console.log("Found group term" + term)
//       return element
//     }else if (element.children){
//       return (findGroupTerm(element.children,term))
//     }else{
//       return null;
//     }
//   })

// }

export const renderChildTerms = (term,luts,black) =>{

  // const out =  allLandUseTermsGrouped.map((element) => {
  //   if (element.term === term){
  //     console.log("Parent term"+term)
  //     return (element.children.map((child)=>{console.log("rendering term "+ child.term);newLanduseTerm(child.term)}) )
  //   }
  // });
  var i=1
  const out = []
  // const groupTerm = findGroupTerm(allLandUseTermsGrouped,term)
  
  allLandUseTermsGrouped.forEach((element)=>{


    // console.log("Parents scan"+element.term)
    if (element.term === term){
      console.log("Parent term:"+term)
      if(element.children){
      out.push(element.children.map((child)=>{console.log("rendering term "+ child.term);return newLanduseTerm(child.term,i++,luts,black)}))
      }
    }else {
      // console.log("scanning children" + element.term )
      element.children.forEach((childElement)=>{
        // console.log("child scan term:"+ childElement.term )
        if (childElement.term === term){
          // console.log("child found term:"+term)
          if (childElement.children){ 
            out.push(childElement.children.map((child)=>{console.log("rendering term "+ child.term);return newLanduseTerm(child.term,i++,luts,black)}))
          }
        }
        })
    }
  })
  if (out.length >0){
    console.log("out" + out)
    return (<ul>{out}</ul>)
  }
}

export const  newLanduseTerm = (term,i,luts,black=false)=> {
  if ( black || mandatedLandUseTables[0].permitted_with.includes(term )){ // todo: find the right zone
    return  (<li key={i}>{term} {isNew(term,luts.permittedWith)} {renderChildTerms(term,luts,true)}  </li>)
  }else{
    return  (<li key={i}><font color="blue">{term} {isNew(term,luts.permittedWith)}  </font> {renderChildTerms(term,luts)}</li>)
  }
}

const  oldLanduseTerm = (term,i)=> {
  
    return  (<li key={i}>{term} </li>)
  
}
const isNew = (landUse,previous)=>{
  if (previous.includes(landUse)){
    return("=")
  }
  return (<font color="green" >+</font>)
}

export function App() {

  const [zone, setZone] = useState("");
  const [newZone, setNewZone] = useState("");
  const [lga, setLga] = useState("");
  const [luts, setLuts] = useState({'objectives':'','permittedWithout':'','permittedWith':'','prohibited':''});
  const [newLuts, setNewLuts] = useState({'objectives':'','permittedWithout':'','permittedWith':'','prohibited':''});
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
      const result = await fetch('https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/lot?propId='+propId,);
      const lotData = await result.json()
      console.log(lotData)
      const ringsX = lotData[0].geometry.rings[0].map((item)=> item[0])
      const ringsY = lotData[0].geometry.rings[0].map((item)=> item[1])
      const deltaX = Math.max(...ringsX) - Math.min(...ringsX) +500
      const deltaY = Math.max(...ringsY) - Math.min(...ringsY) +500
      
      const bbox = `${Math.min(...ringsX)-deltaX} ,${Math.min(...ringsY)-deltaY/2} ,${Math.max(...ringsX)+deltaX/2} ,${Math.max(...ringsY)+deltaY/2}`;// 16825418.912965454,-3995818.605369472,16826339.7402905,-3995067.3727009203 ${}` 
      console.log("bbox=",bbox,ringsX)
      // const newLayer = `, {"id":591,"source":{"mapLayerId":591,"type":"mapLayer"},"drawingInfo":{"showLabels":false,"transparency":0}}`
      const newLayer = ``

      const mu = `https://api-uat.apps1.nsw.gov.au/planning/arcgis/V1/rest/services/ePlanning/Planning_Portal_Principal_Planning/MapServer/export?bbox=${bbox}&bboxSR=102100&imageSR=102100&size=1542,1258&dpi=192&format=png32&transparent=true&dynamicLayers=[{%22id%22:603,%22source%22:{%22mapLayerId%22:603,%22type%22:%22mapLayer%22},%22drawingInfo%22:{%22showLabels%22:true,%22transparency%22:0}},
        {%22id%22:19,%22source%22:{%22mapLayerId%22:19,%22type%22:%22mapLayer%22},%22drawingInfo%22:{%22showLabels%22:true,%22transparency%22:50}}${newLayer}]&f=image`
      // const mu = `https://uat.planningportal.nsw.gov.au/bb60d395-a809-4753-9589-e600b48f5834`
      // const dummy = await fetch(mu)
      // console.log("dummy",await dummy.text())
      // setMap(`https://api-uat.apps1.nsw.gov.au/planning/arcgis/V1/rest/services/ePlanning/Planning_Portal_Principal_Planning/MapServer/export?bbox=${bbox}&bboxSR=102100&imageSR=102100&size=1542,1258&dpi=192&format=png32&transparent=true&`+
      // `dynamicLayers=[{"id":591,"source":{"mapLayerId":591,"type":"mapLayer"},"drawingInfo":{"showLabels":false,"transparency":0}}]&f=image`)
     
      setMap(mu)
      const result2 = await fetch('https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/council?propId='+propId)
      // setZone("B1") 
      const council = await result2.json()
      console.log(council)
      setLga(council[0])

   
     
      const result3 = await fetch('https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/layerintersect?type=property&id='+propId+'&layers=epi' , )
      // dynamicLayers:[{"id":591,"source":{"mapLayerId":591,"type":"mapLayer"},"drawingInfo":{"showLabels":false,"transparency":0}}]
      // const addressResult = await result.json()
      // console.log("queried"+result.status, )
      // setAddresses(addressResult)
      // console.log("queried" + result2.status, await result2.json())
      console.log("queried layers" + result3.status)
      const layerData = await result3.json()
      // console.log("lotdata="+lotData)
      for (let index = 0; index < layerData.length; index++) {
        const element = layerData[index];
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
    // todo: get right LUT from data for current Zone/LGA - refer to scrape_luts_from_word.py
    const findDefaultNewZone = (z) => { 
      for (let index = 0; index < mandatedLandUseTables.length; index++) {
        const newZoneLUT = mandatedLandUseTables[index];
        for (let i =0;i<newZoneLUT.from_keys.length;i++){
          if (newZoneLUT.from_keys[i] === zone) {
            return newZoneLUT.key }
        }
      }
      console.log("no mmandated zone mapping")
      return zone
    }
    const findNewLUT = (nz) => { 
      for (let index = 0; index < newLandUseTables.length; index++) {
        const newZoneLUT = newLandUseTables[index];
        if ( (( newZoneLUT.LEP === lga) || true) && newZoneLUT.Zone && (newZoneLUT.Zone.split(" ")[1] === nz) ) { /// this will fail as LUTS as Zone names not codes and LEP <>LGA
          return newZoneLUT
        }
      }
      console.log("no match found using sample new zone")
      setDebug("no match found using sample new zone")
      return newLandUseTables[0]
    }

    const findOldLUT = (z) => { 
      for (let index = 0; index < oldLandUseTables.length; index++) {
        const oldZoneLUT = oldLandUseTables[index];
        if ( (( oldZoneLUT.LEP === lga) || true) && oldZoneLUT.Zone && (oldZoneLUT.Zone.split(" ")[1] === z) ) { /// this will fail as LUTS as Zone names not codes and LEP <>LGA
          return oldZoneLUT
        }
      }
      console.log("no match found using sample old zone")
      setDebug("no match found using sample old zone")
      return oldLandUseTables[0]
    }
    setNewZone(findDefaultNewZone(zone))

    setNewLuts(findNewLUT(zone))
    setLuts(findOldLUT(zone))
  },[zone,lga])




 

  return (
    <div className="App">
      <header className="App-header">
        <img src="https://www.nsw.gov.au/sites/default/files/2020-07/NSW-Government-official-logo.jpg" alt="logo" className='App-logo' />
      </header>
      <p>Address:
        

      
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

<h2>{debug}</h2>

        <table>
          <thead>
          <tr><th>Old {zone} </th><th>New  {newLuts.zone} ({newZone})</th></tr>
          </thead>
          <tbody>
          <tr> <td>{luts.objectives}</td><td><div dangerouslySetInnerHTML={{ __html: newLuts.objectives}}></div> <br/><br/>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Label>Feedback on Objective</Form.Label>
    <Form.Control as="textarea" rows={3} />
  </Form.Group></td></tr>
          <tr><td>{luts.permittedWithout}</td><td>{newLuts.permittedWithout}<br/><br/>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Label>Feedback on Permitted without consent</Form.Label>
    <Form.Control as="textarea" rows={3} />
  </Form.Group></td></tr>
          <tr> <td>
          <ul>
          {luts && luts.permittedWith && luts.permittedWith ? luts.permittedWith.replace("3   Permitted with consent","").split(";").map((term,i) => {
          return oldLanduseTerm(term,i)
           }
          ) : "empty"}
          </ul>
            
            </td><td>
          <b>Permitted with Consent:</b> 
          <ul>
          { luts && newLuts && newLuts.permittedWith ? newLuts.permittedWith.map((term,i) => {
          return newLanduseTerm(term,i,luts)
           }
          ) : "empty"}
          </ul><br/><br/>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Label>Feedback on permitted with consent</Form.Label>
    <Form.Control as="textarea" rows={3} />
  </Form.Group></td></tr>
          <tr> <td>{luts.prohibited}</td><td>{newLuts.prohibited}<br/><br/>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Label>Feedback on prohibited</Form.Label>
    <Form.Control as="textarea" rows={3} />
  </Form.Group></td></tr>
          </tbody>
        </table>



        <Form.Select aria-label="Default select example">
  <option>Reason for interest</option>
  <option value="1">Land owner</option>
  <option value="2">Peak </option>
  <option value="3">Academic</option>
  <option value="3">Scraper</option>
</Form.Select>

    <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" placeholder="Enter email" />
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
  </Form.Group>

  <Button variant="primary">Submit</Button>





      </div>
      {mapURL ? <img src={mapURL} /> : <div/>}

      {/* <iframe src={mapURL}></iframe> */}
      {/* 
https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/address?a=53 shadforth&noOfRecords=10
https://api-uat.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/lot?propId=764913 */}




    </div>

  );



}

export default App;
