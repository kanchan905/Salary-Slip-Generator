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
            <div className="container-fluid px-0">
              <div className="row align-items-center g-2">
                <div className="col-12 col-md-8 mb-2 mb-md-0">
              <h5 className="mb-0">Pay Commission Table</h5>
                </div>
                <div className="col-12 col-md-4 text-md-end">
              <Select
                value={selectedCommissionId}
                displayEmpty
                onChange={(e) => setSelectedCommissionId(e.target.value)}
                size="small"
                    fullWidth
              >
                <MenuItem value="" disabled>Select Pay Commission</MenuItem>
                {payCommissions.map((commission) => (
                  <MenuItem key={commission.id} value={commission.id}>
                    {commission.name} - {commission.year}
                  </MenuItem>
                ))}
              </Select>
                </div>
              </div>
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
