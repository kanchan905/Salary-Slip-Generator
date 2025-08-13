import React, { useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
    Alert,
} from "reactstrap";
import ChangePasswordHeader from "components/Headers/ChangePasswordHeader.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../global/AxiosSetting";
import { logout, appLogout } from "../../redux/slices/authSlice";

const ChangePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.old_password) {
            newErrors.old_password = "Current password is required";
        }

        if (!formData.new_password) {
            newErrors.new_password = "New password is required";
        } else if (formData.new_password.length < 6) {
            newErrors.new_password = "New password must be at least 6 characters long";
        }

        if (!formData.confirm_password) {
            newErrors.confirm_password = "Please confirm your new password";
        } else if (formData.new_password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }

        if (formData.old_password === formData.new_password) {
            newErrors.new_password = "New password must be different from current password";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post("/users/change-password", {
                old_password: formData.old_password,
                new_password: formData.new_password,
            });

            if (response?.data?.successMsg) {
                toast.success(response?.data?.successMsg || "Password changed successfully!");
                setFormData({
                    old_password: "",
                    new_password: "",
                    confirm_password: "",
                });
                setErrors({});
                
                // Logout and redirect after a short delay to show success message
                setTimeout(() => {
                    dispatch(logout());
                    dispatch(appLogout());
                    navigate("/login");
                }, 2000); // 2 second delay
            } else {
                toast.error(response?.data?.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Change password error:", error);
            const errorMessage = error.response?.data?.message || "Failed to change password. Please try again.";
            toast.error(errorMessage);

            // Handle specific error cases
            if (error.response?.status === 400) {
                if (error.response.data.message?.includes("current password")) {
                    setErrors(prev => ({
                        ...prev,
                        old_password: "Current password is incorrect"
                    }));
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ChangePasswordHeader user={user} />
            <Container className="mt--7" fluid>
                <Row className="justify-content-center">
                    <Col lg="8" md="10">
                        <Card className="shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">Change Password</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleSubmit}>
                                    <h6 className="heading-small text-muted mb-4">Password Information</h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="12">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="old_password">
                                                        Current Password *
                                                    </label>
                                                    <Input
                                                        className={`form-control-alternative ${errors.old_password ? 'is-invalid' : ''}`}
                                                        id="old_password"
                                                        name="old_password"
                                                        type="password"
                                                        value={formData.old_password}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter your current password"
                                                    />
                                                    {errors.old_password && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.old_password}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="new_password">
                                                        New Password *
                                                    </label>
                                                    <Input
                                                        className={`form-control-alternative ${errors.new_password ? 'is-invalid' : ''}`}
                                                        id="new_password"
                                                        name="new_password"
                                                        type="password"
                                                        value={formData.new_password}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter your new password"
                                                    />
                                                    {errors.new_password && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.new_password}
                                                        </div>
                                                    )}
                                                    <small className="form-text text-muted">
                                                        Password must be at least 6 characters long
                                                    </small>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="confirm_password">
                                                        Confirm New Password *
                                                    </label>
                                                    <Input
                                                        className={`form-control-alternative ${errors.confirm_password ? 'is-invalid' : ''}`}
                                                        id="confirm_password"
                                                        name="confirm_password"
                                                        type="password"
                                                        value={formData.confirm_password}
                                                        onChange={handleInputChange}
                                                        placeholder="Confirm your new password"
                                                    />
                                                    {errors.confirm_password && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.confirm_password}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>

                                    <hr className="my-4" />

                                    {/* <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="12">
                                                <Alert color="info" className="mb-4">
                                                    <i className="ni ni-bell-55 mr-2"></i>
                                                    <strong>Security Tips:</strong>
                                                    <ul className="mb-0 mt-2">
                                                        <li>Use a strong password with a mix of letters, numbers, and special characters</li>
                                                        <li>Don't use easily guessable information like your name or birthdate</li>
                                                        <li>Consider using a password manager for better security</li>
                                                    </ul>
                                                </Alert>
                                            </Col>
                                        </Row>
                                    </div> */}

                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="12">
                                                <Button
                                                    color="primary"
                                                    type="submit"
                                                    disabled={loading}
                                                    className="mr-3"
                                                >
                                                    {loading ? "Changing Password..." : "Change Password"}
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    type="button"
                                                    onClick={() => navigate("/user-profile")}
                                                >
                                                    Cancel
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ChangePassword;
