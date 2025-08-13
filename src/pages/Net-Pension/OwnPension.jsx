import React, { useRef, useState } from 'react';
import { Container, TextField, MenuItem, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import html2pdf from 'html2pdf.js';
import logo from '../../assets/img/images/slip-header.png'; 
import { fetchOwnPension } from '../../redux/slices/netPensionSlice';
import '../../assets/css/custom.css'; 
import { months } from 'utils/helpers';
import { toast } from 'react-toastify';
import { Bounce, ToastContainer } from "react-toastify";



const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear + 5 - i);

const formatCurrency = (val) =>
  val != null ? Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

const PensionSlipPage = () => {
  const dispatch = useDispatch();
  const slipRef = useRef();
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [ppo, setPpo] = useState('');
  const { ownPension, loading, error } = useSelector((state) => state.netPension);
  const isLoading = loading === 'loading';

  const handleFetch = () => {
    if (!month || !year || !ppo) {
       toast.info('Please select Month, Year, and enter PPO Number.')
      return;
    }
    dispatch(fetchOwnPension({ month, year, ppo }));
  };

  const pensionSlip = ownPension?.data;
  const { monthly_pension, pensioner_deduction, pensioner } = pensionSlip || {};
  const monthLabel = months.find(m => m.value === Number(pensionSlip?.month))?.label;

  // **CHANGE 3: Replaced the PDF download function**
  const handleDownloadPdf = () => {
    const element = slipRef.current;
    if (!element) return;
    
    const filename = `PensionSlip_${pensioner?.name}_${monthLabel}_${pensionSlip?.year}.pdf`;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: elementWidth, windowHeight: elementHeight },
      jsPDF: { unit: 'px', format: [elementWidth, elementHeight], orientation: 'p', hotfixes: ['px_scaling'] }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>Download Your Pension Slip</Typography>

      <Box display="flex" gap={2} mb={3} alignItems="center">
        <TextField select label="Month" fullWidth value={month} onChange={(e) => setMonth(e.target.value)}>{months.map((m) => (<MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>))}</TextField>
        <TextField select label="Year" fullWidth value={year} onChange={(e) => setYear(e.target.value)}>{years.map((y) => (<MenuItem key={y} value={y}>{y}</MenuItem>))}</TextField>
        <TextField label="PPO Number" fullWidth value={ppo} onChange={(e) => setPpo(e.target.value)} />
      </Box>

      <Button variant="contained" onClick={handleFetch} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : 'Generate Slip'}
      </Button>

      {loading === 'failed' && <Alert severity="error" sx={{ mt: 2 }}>Error: {error || 'Could not fetch pension slip.'}</Alert>}
      
      {!isLoading && pensionSlip ? (
        <>
          {/* **CHANGE 4: This entire block is the new layout from your target component** */}
          <div className="salary-slip-container" ref={slipRef}>
            <div className="salary-slip">
              <div className="slip-header">
                  <img src={logo} alt="Organization Header"  width={'100%'}/>
              </div>
              <div className="slip-title">
                पेंशन पर्ची / PENSION SLIP for {monthLabel} {pensionSlip.year}
              </div>
              <div className="employee-info">
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td className="info-label">कर्मचारी कोड / Emp. Code</td>
                      <td className="info-value">{pensioner?.employee?.employee_code || 'N/A'}</td>
                      <td className="info-label">पीपीओ नंबर / PPO No.</td>
                      <td className="info-value">{pensioner?.ppo_no || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="info-label">नाम / Name</td>
                      <td className="info-value">{pensioner?.name || 'N/A'}</td>
                      <td className="info-label">संबंध / Relation</td>
                      <td className="info-value">{pensioner?.relation || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="info-label">ईमेल / Email</td>
                      <td className="info-value">{pensioner?.email || 'N/A'}</td>
                      <td className="info-label">पेंशन प्रकार / Pension Type</td>
                      <td className="info-value">{pensioner?.type_of_pension || 'N/A'}</td>
                    </tr>
                     <tr>
                      <td className="info-label">भुगतान की तारीख / Payment Date</td>
                      <td className="info-value">{pensionSlip.payment_date ? new Date(pensionSlip.payment_date).toLocaleDateString('en-GB') : 'N/A'}</td>
                      <td className="info-label">टिप्पणियाँ / Remarks</td>
                      <td className="info-value">{monthly_pension?.remarks || 'N/A'}</td>
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
                      const earnings = [
                        { label: 'मूल पेंशन / Basic Pension', value: monthly_pension?.basic_pension },
                        { label: 'अतिरिक्त पेंशन / Additional Pension', value: monthly_pension?.additional_pension },
                        { label: 'महंगाई राहत / Dearness Relief', value: monthly_pension?.dr_amount },
                        { label: 'चिकित्सा भत्ता / Medical Allowance', value: monthly_pension?.medical_allowance },
                      ];
                      
                      if (monthly_pension?.arrears && monthly_pension.arrears.length > 0) {
                          monthly_pension.arrears.forEach(arrear => {
                              earnings.push({ label: `बकाया / Arrear (${arrear.type || 'Misc'})`, value: arrear.amount });
                          });
                      } else if (monthly_pension?.total_arrear > 0) {
                          earnings.push({ label: 'कुल बकाया / Total Arrear', value: monthly_pension.total_arrear });
                      }

                      const deductions = [
                        { label: 'आयकर / Income Tax', value: pensioner_deduction?.income_tax },
                        { label: 'रिकवरी / Recovery', value: pensioner_deduction?.recovery },
                        { label: 'परिवर्तनीय पेंशन / Commutation', value: pensioner_deduction?.commutation_amount },
                        { label: 'अन्य / Other', value: pensioner_deduction?.other },
                      ];

                      const visibleEarnings = earnings.filter(item => item && item.value > 0);
                      const visibleDeductions = deductions.filter(item => item && item.value > 0);
                      const numRows = Math.max(visibleEarnings.length, visibleDeductions.length);

                      return Array.from({ length: numRows }).map((_, index) => {
                        const earning = visibleEarnings[index];
                        const deduction = visibleDeductions[index];
                        return (
                          <tr key={index}>
                            <td>{earning ? earning.label : ''}</td>
                            <td className="amount-col">{earning ? formatCurrency(earning.value) : ''}</td>
                            <td>{deduction ? deduction.label : ''}</td>
                            <td className="amount-col">{deduction ? formatCurrency(deduction.value) : ''}</td>
                          </tr>
                        );
                      });
                    })()}

                    <tr className="total-row">
                      <td><strong>कुल आय / TOTAL EARNINGS</strong></td>
                      <td className="amount-col"><strong>{formatCurrency(monthly_pension?.total_pension)}</strong></td>
                      <td><strong>कुल कटौती / TOTAL DEDUCTIONS</strong></td>
                      <td className="amount-col"><strong>{formatCurrency(pensioner_deduction?.amount)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="net-pay-summary" style={{padding:'10px',textAlign:'center',fontSize:'16px'}}>
                  <span><strong>अंतिम शुद्ध पेंशन / NET PENSION PAYABLE</strong></span>
                  <span className='net-pay-amount'><strong>₹ {formatCurrency(pensionSlip.net_pension)}</strong></span>
              </div>
              <div className="slip-footer">
                <p><strong>यह कंप्यूटर जनरेटेड डॉक्यूमेंट है और इसमें हस्ताक्षर की आवश्यकता नहीं है</strong></p>
                <p><strong>This is a computer-generated document and does not require a signature</strong></p>
                <hr />
                <p>Generated on: {new Date().toLocaleDateString('en-GB')} | Your Pension Portal</p>
              </div>
            </div>
          </div>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
              DOWNLOAD PENSION SLIP PDF
            </Button>
          </Box>
        </>
      ): (
        <div style={{textAlign:'center', marginTop:'20px'}}>
          <h3>Pension not available for this !</h3>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Container>
  );
};

export default PensionSlipPage;