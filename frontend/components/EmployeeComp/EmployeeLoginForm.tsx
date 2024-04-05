'use client';
import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const EmployeeLoginForm: React.FC = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [clientReady, setClientReady] = useState(false);

    useEffect(() => {
        setClientReady(true);
    }, []);

    const onFinish = async (values: any) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${process.env.BACKEND}/api/EmployeeLogin`, {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) {
                // Set the token in a cookie
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: data.message,
                    showConfirmButton: false,
                    timer: 2000,
                });

                // Set the token in a cookie
                document.cookie = `employee=${data.token}; path=/; max-age=${data.expiryTime}`;
                setTimeout(() => {
                    router.push('/employee');
                }, 2000);
            } else {
                // Log the error response body
                console.log(await response.text());

                if (response.status === 400) {
                    Swal.fire({
                        title: 'Invalid Email',
                        text: 'Please try Again',
                        icon: 'error',
                    });
                } else if (response.status === 401) {
                    Swal.fire({
                        title: 'Invalid Password',
                        text: 'Please try Again',
                        icon: 'error',
                    });
                } else {
                    Swal.fire({
                        title: 'Something Went Wrong',
                        text: 'Please try Again',
                        icon: 'error',
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Something Went Wrong',
                text: 'Please try Again',
                icon: 'error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-[300px]">
            <Link href={'/'}>
                <div className="py-5">
                    <img className="w-[180px]" src="sagartech-logo.webp" alt="logo" />
                </div>
            </Link>
            <h2 className="pb-2 font-sans text-base font-medium">Employee Login</h2>
            <Form form={form} name="armaf-central-hub" layout="vertical" size="large" onFinish={onFinish}>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the admin email!',
                            type: 'email',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Please enter the admin password!' }]}>
                    <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item shouldUpdate>
                    {() => (
                        <Button
                            type="default"
                            htmlType="submit"
                            className="w-full bg-gray-900 text-white"
                            disabled={!clientReady || !form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                            loading={submitting}
                        >
                            Log in
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};

export default EmployeeLoginForm;
