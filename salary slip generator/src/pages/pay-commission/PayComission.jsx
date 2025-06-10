import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader } from "reactstrap";
// import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { fetchPayCommisions } from "../../redux/slices/payCommision";
import Commission from "./Commission";
import { Select } from "@mui/material";

const PayComission = () => {
  const dispatch = useDispatch();
  const { payCommissions, loading, error } = useSelector((state) => state.payCommision);

  const [selectedCommissionId, setSelectedCommissionId] = useState("");
  const [selectedCommission, setSelectedCommission] = useState(null);

  useEffect(() => {
    dispatch(fetchPayCommisions());
    console.log("Fetching pay commissions...", payCommissions);
    if(selectedCommissionId){
      const commission = payCommissions.find((commission) => commission.id === selectedCommissionId);
      if (commission) {
        setSelectedCommission(commission?.name);
      } else {
        setSelectedCommission(null);
      }
    }
  }, [selectedCommissionId, selectedCommission]);


  return (
    <>
      <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
      <div className="mt--7 container-fluid">
        <Card className="card-stats mb-4 mb-lg-0">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pay Commission</h5>
              <Select
                value={selectedCommissionId}
                displayEmpty
                onChange={(e) => setSelectedCommissionId(e.target.value)}
                size="small"
              >
                <MenuItem value="" disabled>Select Pay Commission</MenuItem>
                {payCommissions.map((commission) => (
                  <MenuItem key={commission.id} value={commission.id}>
                    {commission.name} - {commission.year}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </CardHeader>
          <CardBody>
            <Commission selectedCommissionId={selectedCommissionId} commissionName={selectedCommission}/>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default PayComission;
