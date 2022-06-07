import React from "react";
import DataTable from "react-data-table-component";
const CustomerTable = ({ columns, data }) => {
  return (
    <div>
      <DataTable
        title="Countries List"
        columns={columns}
        data={data}
        fixedHeader
        fixedHeaderScrollHeight="450px"
        pagination
        highlightOnHover
        responsive

        // use action to add upload csv in campaign
      />
    </div>
  );
};

export default CustomerTable;
