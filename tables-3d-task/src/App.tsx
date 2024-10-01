import React, { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table';
import TableForm from './components/TableForm';
import ReportForm from './components/ReportForm';

export type Row = {
  nameId: string, 
  name: string,
  verticalLevel: number,
  date: number,
  color: string,
  extend: boolean,
  childs: Row[]
}

export type ReportInput = {
  name: string,
  nameId: string
}

  //dummy data
  let rowsDummy: Row[] = [
    {nameId: "sales", name: "Sales", verticalLevel:1, date:0, color:"white", extend: true, childs: [
      { nameId: "costs", name: "Costs", verticalLevel:0, date:0, color:"red", extend: true, childs: [
        { nameId: "costs2", name: "Costs 2", verticalLevel:0, date:0, color:"red", extend: true, childs: [
          { nameId: "costs3", name: "Costs 3", verticalLevel:1, date:0, color:"red", extend: true, childs: [] },
          { nameId: "costs4", name: "Costs 4", verticalLevel:0, date:0, color:"red", extend: true, childs: [] }
        ] }
      ] }
    ]},
    { nameId: "netIncome", name: "Net Income", verticalLevel:0, date:0, color:"green", extend: true, childs: [] }
  ]
  //dummy data
  let reportsDummy = [
    { id:0, sales:3, costs:-1, netIncome:2},
    { id:1, sales:5, costs:-1, netIncome:45},
    { id:2, costs:-1, netIncome:4, costs3:8},
    { id:3, costs:-1, netIncome:4, costs3:8}
  ]

function App() {


const[rows, setRows] = useState<Row[]>(rowsDummy)
const[reports, setReports] = useState<any[]>(reportsDummy) //set reports as "any"
const[tableRows, setTableRows] = useState<JSX.Element[]>([])

//reports form
//NB:reportsInputs are used for the Row form as well
const[reportsInputs, setReportsInputs] = useState<ReportInput[]>([])
const[selectedReportId, setSelectedReportId] = useState<number | null>(null)

function addReportsInputs(rows: Row[], arrayToPush:ReportInput[] = []) {   
  rows.map((row) => {  
    arrayToPush.push({name:row.name, nameId:row.nameId})
    if(row.childs){
       addReportsInputs(row.childs, arrayToPush)
    }
  })
  return arrayToPush
}

function handleEditReport(id: number){
  setSelectedReportId(id);
}

//extend and collapse rows
function extendTable(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, parent: string) {
  event.preventDefault();
  let newRows = extendChildRows(rows, parent)
  setRows(newRows)
}

//extend and collapse rows and child rows, recursive function
function extendChildRows(rows: Row[], parent: string) {
  let newRows = rows.map(row => {
    if(row.nameId == parent){
      row.extend = !row.extend
    }

    if(row.childs.length) {
      extendChildRows(row.childs, parent)
    }
    return row
  })

  return newRows
}

// create an array with the rows of the table
//as JSX elements
function makeTableArray() {
  let tableArray:JSX.Element[] = []

  rows.map((row) => {
    tableArray.push(createTableRow(row))
    if(row.childs.length > 0 && row.extend) {
      let index = 0;
        setChildRows(row.childs, tableArray, index)
    }
  })

  setTableRows(tableArray)
}

//add child rows to table Array, recursive function
function setChildRows(rowArray: Row[], arrayToPush: JSX.Element[], index: number) {
  rowArray.map((row) => {
    arrayToPush.push(createTableRow(row, true, index))
    if(row.childs.length > 0 && row.extend) {
      setChildRows(row.childs, arrayToPush, index+1)
    }
  })
}

//order rows by vertical level
function orderRows(rows: Row[]){
  //copy to not mutate the original rows array
  let newRows = [...rows].sort((a: {
    date: number; verticalLevel: number; 
}, b: {
  date: number; verticalLevel: number; 
}) => a.verticalLevel - b.verticalLevel || b.date - a.date ); //if two rows have the same vertical level, the newest should be first

  newRows = newRows.map((row) => {
    if(row.childs){
      row.childs = orderRows(row.childs)
    }

    return row
  })
 return newRows
}

//fix vertical levels to be 1,2,3 ...
function fixVertical(rows: Row[]) {
 let fixedRows = rows.map((row, i) => {
  row.verticalLevel = i+1; 
  if(row.childs){
    fixVertical(row.childs)
  }
  return row
 })

 return fixedRows
}

//compare rows and ordered rows for changes
function compareRows(newRows: Row[]) {
  if (JSON.stringify(newRows) == JSON.stringify(rows)){
    return true
  }else{
    return false
  }
}

// create a the table row as JSX element
function createTableRow(row: Row, childs: boolean = false, index:number = 0): JSX.Element {
  let childClass = "parent-row"
  if(childs){
    childClass = "child-row"
  }

  return   <tr className={childClass} key={row.nameId}>
             <td><span className='ml-2 fs-6 vertical-level'>{row.verticalLevel}</span></td>
             <td style={{backgroundColor:row.color}}><div className={`text-start col ${index ? 'ps-'+index : ''}`}>{childs? <i className=" mr-1 bi bi-arrow-90deg-right" /> : ''}{row.name} { row.childs.length > 0 && <button className='btn btn-primary btn-sm' onClick={(e) => extendTable(e, row.nameId)}>{row.extend? "collapse" : "extend"}</button>}</div></td>
             {reports.map((report, index) => {
                return report.hasOwnProperty(row.nameId) ? <td onDoubleClick={() => handleEditReport(report.id)} style={{backgroundColor:row.color}} key={index}>{report[row.nameId  as keyof object]}</td> : <td style={{backgroundColor:row.color}} onDoubleClick={() => handleEditReport(report.id)} key={index}></td>
            })}
            </tr>
                 
}

useEffect(() => {
  //order rows by VL and fix VLs
  let orderedRows = orderRows(rows)
  orderedRows = fixVertical(orderedRows)

  //check if the new ordered rows must be set as rows
  if(!compareRows(orderedRows)) {
    setRows(orderedRows)
  }
  //make the table as an array of JSX elements
  makeTableArray()
  //make Report Inputs, also used for select options in 
  //create  new row form
  setReportsInputs(addReportsInputs(rows))
},[rows, reports])

  return (
    <div className="App">
      <Table tableRows={tableRows} />
      <div className='d-flex justify-content-center'>
        <ReportForm reportsInputs={reportsInputs} setReports={setReports} reports={reports} 
          selectedReportId={selectedReportId} setSelectedReportId={setSelectedReportId} />
        <TableForm rows={rows} setRows={setRows} reportsInputs={reportsInputs} />
      </div>     
    </div>
  );
}

export default App;
