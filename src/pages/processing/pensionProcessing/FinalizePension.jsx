import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';
import html2pdf from 'html2pdf.js';
import { months } from 'utils/helpers';
import { fetchPensionRelated } from '../../../redux/slices/pensionRelatedSlice';
import { fetchDearnessRelief } from '../../../redux/slices/dearnessRelief';
import logo from '../../../assets/img/images/slip-header.png';
import '../../../assets/css/custom.css';
import { updatePensionField } from '../../../redux/slices/pensionSlice';


const PensionSlip = ({ formData, PensionerDetail, drDetails }) => {
  const slipRef = useRef(null);
  const dispatch = useDispatch()
  const monthLabel = months.find(m => m.value == formData.month)?.label || formData.month;

  // --- GET ALL VALUES FROM formData ---
  // Earnings
  const basic_pension = Number(formData.basic_pension) || 0;
  const additional_pension = Number(formData.additional_pension) || 0;
  const medical_allowance = Number(formData.medical_allowance) || 0;
  const dr_rate = Number(drDetails?.rate) || 0;
  const dearness_relief = ((basic_pension + additional_pension) * dr_rate) / 100;

  // Calculate total arrears from the dynamic array
  const total_arrear = (formData.arrears || []).reduce((sum, arrear) => sum + (Number(arrear.amount) || 0), 0);

  // Deductions from form
  const income_tax = Number(formData.income_tax) || 0;
  const recovery = Number(formData.recovery) || 0;
  const other_deduction = Number(formData.other) || 0;

  // Static deduction from PensionerDetail
  const commutation_amount = Number(formData?.commutation_amount) || 0;

  // --- CALCULATE TOTALS ---
  const totalEarnings = basic_pension + additional_pension + medical_allowance + dearness_relief + total_arrear;
  const totalDeductions = income_tax + recovery + other_deduction + commutation_amount;
  const netPension = totalEarnings - totalDeductions;

  if (formData.net_pension !== netPension) {
    dispatch(updatePensionField({ name: 'net_pension', value: netPension }));
  }

  // --- Helper Functions ---
  const formatCurrency = (val) => (Number(val) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const dateFormat = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-GB') : 'N/A';

  const handleDownloadPdf = () => {
    const element = slipRef.current;
    if (!element) return;
    const filename = `PensionSlip_${PensionerDetail?.name}_${monthLabel}_${formData.year}.pdf`;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;
    const orientation = elementWidth > elementHeight ? 'l' : 'p';
    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: elementWidth, windowHeight: elementHeight },
      jsPDF: { unit: 'px', format: [elementWidth, elementHeight], orientation: orientation, hotfixes: ['px_scaling'] }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <>
      <div className="salary-slip-container" ref={slipRef}>
        <div className="salary-slip">
          <div className="slip-header">
            <div className="logo-section">
              <img src={logo} alt="NIOH Logo" className="slip-logo w-100" />
              {/* <div className="org-name">
                <h1>आई.सी.एम.आर.- राष्ट्रीय व्यावसायिक स्वास्थ्य संस्थान</h1>
                <h2>ICMR- National Institute Of Occupational Health</h2>
                <p>अहमदाबाद - 380016 भारत / Ahmedabad - 380016 India</p>
                <p className="who-text">व्यावसायिक स्वास्थ्य के लिए डब्ल्यूएचओ का सहयोग केंद्र</p>
                <p className="who-text">WHO Collaborating Center for Occupational Health</p>
              </div> */}
            </div>
          </div>
          <div className="slip-title">
            पेंशन पर्ची / PENSION SLIP for {monthLabel} {formData.year}
          </div>
          <div className="employee-info">
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="info-label">कर्मचारी कोड / Emp. Code</td>
                  <td className="info-value">{PensionerDetail?.employee?.employee_code || 'N/A'}</td>
                  <td className="info-label">पीपीओ नंबर / PPO No.</td>
                  <td className="info-value">{PensionerDetail?.ppo_no || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="info-label">नाम / Name</td>
                  <td className="info-value">{PensionerDetail?.name || 'N/A'}</td>
                  <td className="info-label">संबंध / relation</td>
                  <td className="info-value">{PensionerDetail?.relation || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="info-label">ईमेल / Gmail</td>
                  <td className="info-value">{PensionerDetail?.employee?.email || 'N/A'}</td>
                  <td className="info-label">पेंशन प्रकार / Pension Type</td>
                  <td className="info-value">{PensionerDetail?.type_of_pension || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="info-label">माह / Month</td>
                  <td className="info-value">{monthLabel} {formData.year}</td>
                  <td className="info-label">महंगाई राहत दर / DR Rate</td>
                  <td className="info-value">{dr_rate}%</td>
                </tr>
                <tr>
                  <td className="info-label">टिप्पणियाँ / remarks </td>
                  <td className="info-value">{formData?.remarks}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="salary-details">
            <table className="salary-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>आय विवरण / EARNINGS</th>
                  <th style={{ width: '10%' }}>राशि / AMOUNT (₹)</th>
                  <th style={{ width: '40%' }}>कटौती विवरण / DEDUCTIONS</th>
                  <th style={{ width: '10%' }}>राशि / AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // 1. Create a list of all possible earnings with their labels and values.
                  const earnings = [
                    { label: 'मूल पेंशन / Basic Pension', value: basic_pension },
                    { label: 'अतिरिक्त पेंशन / Additional Pension', value: additional_pension },
                    { label: 'महंगाई राहत / Dearness Relief', value: dearness_relief },
                    { label: 'चिकित्सा भत्ता / Medical Allowance', value: medical_allowance },
                  ];

                  (formData.arrears || []).forEach(arrear => {
                    if (Number(arrear.amount) > 0) {
                      earnings.push({
                        label: `बकाया / ${arrear.type || 'N/A'}`,
                        value: arrear.amount
                      });
                    }
                  })

                  // 2. Create a list of all possible deductions.
                  const deductions = [
                    { label: 'आयकर / Income Tax', value: formData.income_tax },
                    { label: 'रिकवरी / Recovery', value: formData.recovery },
                    { label: 'परिवर्तनीय पेंशन / Commutation Pension', value: commutation_amount },
                    { label: formData.description || 'अन्य / Other', value: formData.other },
                  ];

                  // 3. Filter both lists to keep only items with a value greater than 0.
                  const visibleEarnings = earnings.filter(item => Number(item.value) > 0);
                  const visibleDeductions = deductions.filter(item => Number(item.value) > 0);

                  // 4. Determine the number of rows needed (the length of the longer list).
                  const numRows = Math.max(visibleEarnings.length, visibleDeductions.length);

                  // 5. Generate the table rows dynamically.
                  return Array.from({ length: numRows }).map((_, index) => {
                    const earning = visibleEarnings[index]; // Get the earning for this row, if it exists
                    const deduction = visibleDeductions[index]; // Get the deduction for this row, if it exists

                    return (
                      <tr key={index}>
                        {/* Column 1 & 2: Earning Label and Amount */}
                        <td>{earning ? earning.label : ''}</td>
                        <td className="amount-col">{earning ? formatCurrency(earning.value) : ''}</td>

                        {/* Column 3 & 4: Deduction Label and Amount */}
                        <td>{deduction ? deduction.label : ''}</td>
                        <td className="amount-col">{deduction ? formatCurrency(deduction.value) : ''}</td>
                      </tr>
                    );
                  });
                })()}

                {/* The total row is always visible and calculated outside the dynamic part */}
                <tr className="total-row">
                  <td><strong>कुल आय / TOTAL EARNINGS</strong></td>
                  <td className="amount-col"><strong>{formatCurrency(totalEarnings)}</strong></td>
                  <td><strong>कुल कटौती / TOTAL DEDUCTIONS</strong></td>
                  <td className="amount-col"><strong>{formatCurrency(totalDeductions)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="net-pay-summary" style={{ padding: '15px', border: '1px solid #ccc', marginTop: '10px', background: '#f9f9f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1em' }}>
              <span><strong>अंतिम शुद्ध पेंशन / NET PENSION PAYABLE</strong></span>
              <span style={{ fontSize: '1.2em' }}><strong>₹ {formatCurrency(netPension)}</strong></span>
            </div>
          </div>
          <div className="slip-footer">
            <p><strong>यह कंप्यूटर जनरेटेड डॉक्यूमेंट है और इसमें हस्ताक्षर की आवश्यकता नहीं है</strong></p>
            <p><strong>This is a computer-generated document and does not require a signature</strong></p>
            <hr style={{ margin: '10px 0', border: 0, borderTop: '1px solid #000' }} />
            <p>Generated on: {new Date().toLocaleDateString('en-IN')} | ICMR-NIOH Payroll System</p>
          </div>
        </div>
      </div>
      <Box sx={{ textAlign: 'center', m: 4 }}>
        <Button variant="contained" color="primary" onClick={handleDownloadPdf}>DOWNLOAD PENSION SLIP PDF</Button>
      </Box>
    </>
  );
};



const FinalizePension = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.pension);
  const { pensionRelated } = useSelector((state) => state.info);
  const { dearness } = useSelector((state) => state.dearnessRelief);

  useEffect(() => {
    if (!pensionRelated || pensionRelated.data?.length === 0) {
      dispatch(fetchPensionRelated({ page: 1, limit: 1000 }));
    }
    if (!dearness || dearness.length === 0) {
      dispatch(fetchDearnessRelief());
    }
  }, [dispatch, pensionRelated, dearness]);

  const selectedPensionInfo = pensionRelated?.find(
    p => p.id === formData.pension_related_info_id // Use the specific record ID
  );

  // If we can't find the core pension info, we can't proceed.
  if (!selectedPensionInfo || !selectedPensionInfo.pensioner) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>Loading pensioner details or pensioner not found. Please go back and select a pensioner.</Box>;
  }

  // Pass the pensioner's static details (like name, PPO no)
  const PensionerDetail = {
    ...selectedPensionInfo.pensioner,
    // We also need static values that don't come from the form
    commutation_amount: selectedPensionInfo.commutation_amount,
    type_of_pension: selectedPensionInfo.type_of_pension,
    ppo_no: selectedPensionInfo.ppo_no,
    relation: selectedPensionInfo.relation,
  };

  const selectedDr = dearness?.find(d => d.id === formData.dr_id);
  const drDetails = {
    rate: selectedDr?.dr_percentage || 0
  };

  // The PensionSlip component will now get everything it needs.
  return (
    <PensionSlip
      formData={formData} // Pass the entire form's state
      PensionerDetail={PensionerDetail} // Pass the static pensioner info
      drDetails={drDetails}
    />
  );
}
export default FinalizePension;