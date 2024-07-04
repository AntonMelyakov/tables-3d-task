import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ReportInput } from "../App";

interface ReportFormProps {
  reportsInputs: ReportInput[],
  reports: any[],
  setReports: Dispatch<SetStateAction<any[]>>,
  selectedReportId: number | null,
  setSelectedReportId: Dispatch<SetStateAction<number | null>>
}


export default function ReportForm({reportsInputs, reports, setReports, selectedReportId, setSelectedReportId }: ReportFormProps) {
    //reports form
    //const[reportsInputs, setReportsInputs] = useState<any[]>([])
    const[reportsFormValues, setReportsFormValues] = useState({})
    //const[selectedReportId, setSelectedReportId] = useState<number | null>(null)
    //const[selectedReport, setSelectedReport] = useState<object | null>(null)

    // function addReportsInputs(rows: any, arrayToPush:object[] = []) {   
    //     rows.map((row: any) => {  
    //       arrayToPush.push({name:row.name, nameId:row.nameId})
    //       if(row.childs){
    //          addReportsInputs(row.childs, arrayToPush)
    //       }
    //     })
    //     return arrayToPush
    //   }
      
      function getnewReportId() {
        if(reports.length == 0){
          return 0
        }
      
        const max = reports.reduce(function(prev: { id: number; }, current: { id: number; }) {
          return (prev && prev.id > current.id) ? prev : current
        }) //returns object
      
        return max.id+1
      }

      function deleteReport(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        setReports( reports.filter((report: { id: number; }) => report.id !== selectedReportId))
        setSelectedReportId(null)
        setReportsFormValues({})
      }

      
      function addValuesToEditReport(id: number){
        let selectedReport = reports.filter((report: { id: number; }) => report.id == id)
        // setSelectedReport(selectedReport[0])
        setReportsFormValues({...selectedReport[0]})
      }

      
      
      function addNewReport(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        if(selectedReportId === null) { //new report
          let newReport = {...reportsFormValues, id: getnewReportId()}
          setReports([...reports, newReport])
        }else{
         let newReports= reports.map((report: { id: number; }) => {
            if(report.id == selectedReportId) {
              return {...reportsFormValues, id: selectedReportId}
            }else{
              return report
            }
          })
      
          setReports(newReports)
        }
        
        setSelectedReportId(null)
        setReportsFormValues({})
      }
      
    //   function handleEditReport(id: any){
    //     setSelectedReportId(id);
    //     let selectedReport = reports.filter((report: { id: any; }) => report.id == id)
    //     setSelectedReport(selectedReport[0])
    //     setReportsFormValues({...selectedReport[0]})
    //   }
      
       
      function handleFormChange( name:string, value: string) {
        setReportsFormValues({...reportsFormValues, [name]: value})
      }

      useEffect(() => {
        if(selectedReportId !== null)
        addValuesToEditReport(selectedReportId)
      },[selectedReportId])

    return (
        <div className="d-flex justify-content-center p-3">
            <form className={`m-2 border p-3 ${selectedReportId !== null ? 'bg-primary-subtle' : ''}`}>
            <h3>{selectedReportId !== null ? "Edit " : "Add "} Report:</h3>
            {reportsInputs.length > 0 && reportsInputs.map((input: ReportInput, i: number) => <div className="input-group mb-3" key={i}>
                <span className="input-group-text input-label">{input.name}</span>
                <input className="form-control" type="text" name={input.nameId} value={reportsFormValues[input.nameId as keyof object] || ''} onChange={(e)=>handleFormChange(input.nameId, (e.target as HTMLInputElement).value)}  />
            </div>)}
            <button className="btn btn-outline-primary" onClick={(e) => addNewReport(e)}> {selectedReportId !== null ? "Edit Report" : "Submit Report"}</button>
            { selectedReportId !== null && <button className="btn btn-outline-danger m-2" onClick={(e) => deleteReport(e)}> Delete Report</button> }
            </form>
      </div>
    )
}