import React from 'react';

import { useLink, useRegister } from '@refinedev/core';

import { Button,Col,Form, Input,  Row, Select, Typography } from 'antd';

export function RegisterPage() {
  const { mutate: register } = useRegister<RegisterData>();
  const [form] = Form.useForm()
  const onRoleChange = (value: string) => {
    form.setFieldsValue({ role: value });
  };
  const onSubmit = (values: RegisterData) => {
    // console.log(values)
    register(values);
  };
  const Link = useLink();
  const roleOptions = [
    { value: 'SALES_INTERN', label: 'Sales Intern' },
    { value: 'SALES_MANAGER', label: 'Sales Manager' },
    { value: 'SALES_PERSON', label: 'Sales Person' },
  ];

  return (
    <Row justify="center" style={{margin: "2em"}}> {/* Center the content horizontally */}
    <Col xs={24} sm={12} md={8} lg={6}> {/* Adjust size for different screen sizes */}
      <div style={{ backgroundColor: '#fff', borderRadius: 8, padding: 20, boxShadow: "2px 2px gray" }}> {/* Box styling */}
   
      <Typography.Title level={3}>Register</Typography.Title>
    <Form layout="vertical" onFinish={onSubmit} form={form}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select your role' }]}>
              <Select options={roleOptions} defaultValue="SALES_PERSON"  onChange={onRoleChange} /> {/* Use Select component for role */}
            </Form.Item>
      <Form.Item label="Title" name="title">
        <Input placeholder='Head Sales Person'/>
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password' }, ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject('Passwords do not match');
        },
      })]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Register
      </Button>
    </Form>
    <div style={{ textAlign: 'center', marginTop: 10 }}> {/* Signin text and button styling */}
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
    </div>
      </Col>
    </Row>
  );
};

interface RegisterData {
  name: string;
  role: string;
  title?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// export default RegisterPage;
