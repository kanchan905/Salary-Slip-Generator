import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BugReportIcon from '@mui/icons-material/BugReport';
import DownloadIcon from '@mui/icons-material/Download';

const reportOptions = [
    { title: 'Institute-wise Salary Reports', icon: <SummarizeIcon />, color: '#1976d2' },
    { title: 'Institute-wise Pension Reports', icon: <ReceiptLongIcon />, color: '#2e7d32' },
    { title: 'Deduction Reports', icon: <TableViewIcon />, color: '#f57c00' },
    { title: 'Allowance Reports', icon: <TableViewIcon />, color: '#6a1b9a' },
    { title: 'Audit Logs', icon: <BugReportIcon />, color: '#d32f2f' },
];

const ReportsDashboard = () => {
    const handleExport = (type) => {
        alert(`${type} export triggered!`);
        // Connect this with actual PDF/Excel generation logic
    };

    return (
        <>
            <div className='header bg-gradient-info pb-8 pt-8 pt-md-8'></div>
            <Container className="mt-5 mb-5">
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    📊 Reports
                </Typography>
                <Row>
                    {reportOptions.map((report, index) => (
                        <Col key={index} md={6} lg={4} className="mb-4">
                            <Card sx={{ backgroundColor: report.color, color: '#fff', borderRadius: '16px' }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>{report.icon}</Grid>
                                        <Grid item>
                                            <Typography variant="h6">{report.title}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 2, backgroundColor: '#fff', color: report.color }}
                                        fullWidth
                                        onClick={() => alert(`Viewing ${report.title}`)}
                                    >
                                        View Report
                                    </Button>
                                </CardContent>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row className="mt-4">
                    <Col xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Export Options
                        </Typography>
                        <div className='d-flex justify-content-start' style={{ gap: '10px' }}>
                            <Button
                                variant="outlined"
                                startIcon={<PictureAsPdfIcon />}
                                onClick={() => handleExport('PDF')}
                                className="me-3"
                            >
                                Export PDF
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleExport('Excel')}
                            >
                                Export Excel
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ReportsDashboard;
