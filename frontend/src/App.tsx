import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RegisterCustomer from './components/RegisterCustomer';
import CheckEligibility from './components/CheckEligibility';
import CreateLoan from './components/CreateLoan';
import ViewLoans from './components/ViewLoans';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RegisterCustomer />} />
        <Route path="/check-eligibility" element={<CheckEligibility />} />
        <Route path="/create-loan" element={<CreateLoan />} />
        <Route path="/view-loans" element={<ViewLoans />} />
      </Routes>
    </Layout>
  );
}

export default App;
