import React from "react";

interface TableProps {
    tableRows: JSX.Element[]
}

export default function Table({tableRows}: TableProps) {
    
    return (
        <div>
            <h3 className="w-100 mb-5 mt-3">3d-stockpick task</h3>
              <div className='d-flex justify-content-center m-3'>
                <table className='table table-bordered table-hover w-50'>
                <tbody>
                    {tableRows.length > 0 && tableRows.map((row) => row )}
                </tbody>
                </table>
            </div>
            <p className="">*Double click on the report cell to Edit :)</p>
        </div>
    )
}

