import Head from 'next/head';
import useSWR from 'swr';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { useState } from 'react';

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
};

export type Customers = Customer[];

export type ApiError = {
  code: string;
  message: string;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok) throw body;
  return body;
};

const Home = () => {
  const { data, error, isLoading, mutate } = useSWR<Customers, ApiError>('/api/customers', fetcher);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', businessName: '', email: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setOpen(false);
      setForm({ firstName: '', lastName: '', businessName: '', email: '' });
      mutate(); // Re-fetch customer data
    } else {
      console.error('Failed to add customer');
    }
  };

  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{data ? `${data.length} Customers` : 'Customers'}</Typography>
              <Button variant="contained" startIcon={<AddRounded />} onClick={() => setOpen(true)}>
                Add Customer
              </Button>
            </Box>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((customer) => (
                    <TableRow key={customer.email}>
                      <TableCell>
                        {customer.businessName
                          ? customer.businessName
                          : `${customer.firstName} ${customer.lastName}`}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogContent>
          <Stack spacing={2}>
          <Stack spacing={2} direction="row" useFlexGap flexWrap={"wrap"} >
              <TextField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                sx={{ flex: 1, minWidth: '30%' }}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                sx={{ flex: 1, minWidth: '30%' }}
              />
              <TextField
                label="Business Name"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                sx={{ flex: 1, minWidth: '30%' }}
              />
              </Stack>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                sx={{ flex: 1, minWidth: '45%' }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </>
  );
};

export default Home;
