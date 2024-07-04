import { timeStamp } from "console";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Row, ReportInput } from "../App";

interface TableFormProps {
  rows: Row[],
  setRows: Dispatch<SetStateAction<Row[]>>, 
  reportsInputs: ReportInput[]
}

export default function TableForm({rows, setRows, reportsInputs} : TableFormProps) {

    //rows form
    const[nameIdInput, setNameIdInput] = useState<string>('')
    const[nameInput, setNameInput] = useState<string>('')
    const[colorInput, setColorInput] = useState<string>('')
    const[verticalLevelInput, setVerticalLevelInput] = useState<number>(0)
    const[parentInput, setParentInput] = useState<string>('')
    const[errors, setErrors] = useState<any>({})

    function checkNameIdUniqueness(rows: any, nameId: string, result:{unique: boolean} = {unique: true}) {
        rows.map((row:any) => {
          if(row.nameId == nameId){
            result.unique = false
          }
          if(row.childs){
            checkNameIdUniqueness(row.childs, nameId, result)
          }
        })
      
        return result.unique;
      }
      
      
      function addNewRow(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        setErrors({})
      
        if(!nameIdInput) {
          setErrors({...errors, nameIdInput: "NameId can`t be empty"})
        return
        }
      
        
      
        if(!checkNameIdUniqueness(rows, nameIdInput)){
          setErrors({...errors, nameIdInput: "NameId should be unique"})
          return
        }
      
        if(!nameInput){
          setErrors({...errors, nameInput: "Name can`t be empty"})
          return
        }
      
        let newRow = {
          nameId: nameIdInput,
          name: nameInput,
          color: colorInput,
          verticalLevel: verticalLevelInput,
          date: Date.now(),
          extend: true,
          childs: []
        }
      
        if(parentInput) {
          setRows(addToParent(rows, parentInput, newRow))
          setNameIdInput('')
          setColorInput('')
          setNameInput('')
          setVerticalLevelInput(0)
          setParentInput('')
          return
        }
      
        setRows([...rows, newRow])
        setNameIdInput('')
        setColorInput('')
        setNameInput('')
        setVerticalLevelInput(0)
      }
      
      function addToParent(rows: any, parent: any, newRow: any) {
        let newRows = rows.map((row:any) => {
          if(row.nameId == parent){
            row.childs.push(newRow)
          }
          if(row.childs){
            addToParent(row.childs, parent, newRow)
          }
      
          return row
        })
      
      
        return newRows
      }

    return(
        <div className="d-flex justify-content-center p-3">
            <form className="m-2 border p-3">
                <h3>Add Row:</h3>
                <div className="input-group mb-3">
                    <span className="input-group-text input-label">NameId</span>
                    <input className="form-control" value={nameIdInput} type="text" name='nameId' onChange={(e) => setNameIdInput(e.target.value)} />  
                </div>
                {errors.nameIdInput && <div className="m-3 text-danger">{errors.nameIdInput}</div>}
                <div className="input-group mb-3">
                    <span className="input-group-text input-label">Name</span>
                    <input className="form-control" value={nameInput} type="text" name='name' onChange={(e) => setNameInput(e.target.value)} />
                </div>
                {errors.nameInput && <div className="m-3 text-danger">{errors.nameInput}</div>}
                <div className="input-group mb-3">
                    <span className="input-group-text input-label">Color</span>
                    <input className="form-control" value={colorInput} type="text" name='color' onChange={(e) => setColorInput(e.target.value)} />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text input-label">Vertical level</span>
                    <input className="form-control" value={verticalLevelInput} type="number" name='verticalLevel' onChange={(e) => setVerticalLevelInput(parseInt(e.target.value))} />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text input-label">Parent</span>
                    <select  value={parentInput} className="form-select" onChange={(e) => setParentInput(e.target.value)}>
                    <option key="none" value={""}>None</option>
                        {reportsInputs.map((report: any) => (
                        <option key={report.nameId} value={report.nameId}>{report.name}</option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-outline-primary" onClick={(e) => addNewRow(e)}>Add Row</button>
            </form>
        </div>
    )
}