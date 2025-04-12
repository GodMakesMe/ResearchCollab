import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url } from '../utils/constants';

const FundingForm = ({ projectId }: { projectId: number }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${backend_url}/funding/${projectId}`)
      .then(res => {
        if (res.data) {
          setSource(res.data.source || '');
          setAmount(res.data.amount || '');
          setCurrency(res.data.currency || 'INR');
        }
      })
      .catch(err => console.error(err));
  }, [projectId]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { projectId, source, amount, currency };

      const url = `${backend_url}/funding/${projectId}`;
      const method = source ? 'put' : 'post';

      await axios[method](url, payload);
      alert('✅ Funding details saved successfully');
    } catch (err) {
      console.error(err);
      alert('❌ Error saving funding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="funding-form">
      <h3 className="text-xl font-semibold mb-2">Funding Details</h3>
      <input value={source} onChange={e => setSource(e.target.value)} placeholder="Source" />
      <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Amount" />
      <input value={currency} onChange={e => setCurrency(e.target.value)} placeholder="Currency" />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default FundingForm;
