import React, { useState } from "react";
import { Container, Card, CardBody, Button } from "reactstrap";
import UserCreation from "./UserCreation";
// import NextStepComponent from "./NextStepComponent"; // Placeholder for step 2

const UserStepper = () => {
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState({});

    const handleNext = (dataFromStep) => {
        setUserData((prev) => ({ ...prev, ...dataFromStep }));
        setStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleReset = () => {
        setStep(0);
        setUserData({});
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                console.log('userData', userData);
                return <UserCreation onNext={handleNext} defaultData={userData} />;
            // case 1:
            //   return <NextStepComponent onBack={handleBack} onNext={handleNext} data={userData} />;
            // case 2:
            //   return <FinalStep data={userData} onBack={handleBack} onReset={handleReset} />;
            default:
                return (
                    <div>
                        <h5>All steps completed!</h5>
                        <pre>{JSON.stringify(userData, null, 2)}</pre>
                        <Button color="secondary" onClick={handleReset}>Reset</Button>
                    </div>
                );
        }
    };

    return (
        <>
        <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
            <Container className="mt-4">
                <Card>
                    <CardBody>
                        <h3 className="mb-4">Create User - Step {step + 1}</h3>
                        {renderStep()}
                        {step > 0 && (
                            <Button color="secondary" className="mt-3" onClick={handleBack}>
                                Back
                            </Button>
                        )}
                    </CardBody>
                </Card>
            </Container>
        </>
    );
};

export default UserStepper;
