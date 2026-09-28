import React, { useState } from 'react';
import { FileText, Download, Filter, CheckCircle } from 'lucide-react';

export default function ReportsView({ resources, donations, requests, distributions }) {
  const [reportType, setReportType] = useState('INVENTORY');

  const handleExportCSV = () => {
    let headers = [];
    let rows = [];

    if (reportType === 'INVENTORY') {
      headers = ['Resource ID', 'Name', 'Category', 'Current Stock', 'Unit', 'Min Threshold', 'Status'];
      rows = resources.map(r => [r.id, r.name, r.category, r.currentStock, r.unit, r.minStock, r.status]);
    } else if (reportType === 'DONATIONS') {
      headers = ['Donation ID', 'Donor Name', 'Resource Name', 'Quantity', 'Condition', 'Date'];
      rows = donations.map(d => [d.id, d.donorName, d.resourceName, d.quantity, d.condition, d.date]);
    } else if (reportType === 'REQUESTS') {
      headers = ['Request ID', 'Organization', 'Priority', 'Status', 'Created Date'];
      rows = requests.map(r => [r.id, r.orgName, r.priority, r.status, r.createdDate]);
    } else if (reportType === 'DISTRIBUTIONS') {
      headers = ['Distribution ID', 'Request ID', 'Organization', 'Resource', 'Quantity', 'Received By', 'Date'];
      rows = distributions.map(d => [d.id, d.reqId, d.orgName, d.resourceName, d.quantity, d.receivedBy, d.distDate]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relfor_${reportType.toLowerCase()}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Reporting & CSV Audits</h2>
            <span className="badge badge-success">Live Database Source</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Generate operational summary reports and export formatted CSV raw data files.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-primary">
          <Download size={16} /> Export Current Report as CSV
        </button>
      </div>

      {/* Selector */}
      <div className="glass-panel" style={{ padding: '18px 24px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Select Report Category:</span>
        
        {['INVENTORY', 'DONATIONS', 'REQUESTS', 'DISTRIBUTIONS'].map(type => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={reportType === type ? 'btn btn-secondary btn-sm' : 'btn btn-outline btn-sm'}
          >
            {type} REPORT
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>
            {reportType} Audit Dataset
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
            Authoritative Backend Source
          </span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            {reportType === 'INVENTORY' && (
              <>
                <thead>
                  <tr>
                    <th>Resource ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Min Threshold</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: 'monospace', color: '#818cf8', fontWeight: 700 }}>{r.id}</td>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{r.name}</td>
                      <td>{r.category}</td>
                      <td><strong style={{ color: '#34d399' }}>{r.currentStock} {r.unit}</strong></td>
                      <td>{r.minStock} {r.unit}</td>
                      <td><span className="badge badge-success">{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {reportType === 'DONATIONS' && (
              <>
                <thead>
                  <tr>
                    <th>Donation ID</th>
                    <th>Donor Name</th>
                    <th>Resource</th>
                    <th>Quantity</th>
                    <th>Condition</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontFamily: 'monospace', color: '#818cf8', fontWeight: 700 }}>{d.id}</td>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{d.donorName}</td>
                      <td>{d.resourceName}</td>
                      <td><strong style={{ color: '#34d399' }}>+{d.quantity}</strong></td>
                      <td>{d.condition}</td>
                      <td>{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {reportType === 'REQUESTS' && (
              <>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Organization</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: 'monospace', color: '#818cf8', fontWeight: 700 }}>{r.id}</td>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{r.orgName}</td>
                      <td><span className="badge badge-warning">{r.priority}</span></td>
                      <td><span className="badge badge-info">{r.status}</span></td>
                      <td>{r.createdDate}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {reportType === 'DISTRIBUTIONS' && (
              <>
                <thead>
                  <tr>
                    <th>Distribution ID</th>
                    <th>Organization</th>
                    <th>Resource Handed Over</th>
                    <th>Quantity</th>
                    <th>Received By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {distributions.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontFamily: 'monospace', color: '#06b6d4', fontWeight: 700 }}>{d.id}</td>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{d.orgName}</td>
                      <td>{d.resourceName}</td>
                      <td><strong style={{ color: '#34d399' }}>{d.quantity}</strong></td>
                      <td>{d.receivedBy}</td>
                      <td>{d.distDate}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>

    </div>
  );
}
