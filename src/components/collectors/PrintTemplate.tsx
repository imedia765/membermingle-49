interface PrintTemplateProps {
  collectors: any[];
}

export function PrintTemplate({ collectors }: PrintTemplateProps) {
  return `
    <html>
      <head>
        <title>All Collectors Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, h3 { color: #333; }
          .collector-info { margin-bottom: 20px; }
          .info-item { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0 40px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .collector-section { margin-bottom: 40px; page-break-inside: avoid; }
          .section { margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <h1>All Collectors Report</h1>
        ${collectors?.map(collector => `
          <div class="collector-section">
            <div class="section">
              <h2>Collector: ${collector.name}</h2>
              <div class="collector-info">
                <div class="info-item"><strong>ID:</strong> ${collector.prefix}${collector.number}</div>
                <div class="info-item"><strong>Status:</strong> ${collector.active ? 'Active' : 'Inactive'}</div>
                <div class="info-item"><strong>Total Members:</strong> ${collector.members?.length || 0}</div>
              </div>
            </div>

            <div class="section">
              <h3>Members List</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Member ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Town</th>
                    <th>Postcode</th>
                    <th>Status</th>
                    <th>Membership Type</th>
                  </tr>
                </thead>
                <tbody>
                  ${collector.members?.map(member => `
                    <tr>
                      <td>${member.full_name}</td>
                      <td>${member.member_number}</td>
                      <td>${member.email || '-'}</td>
                      <td>${member.phone || '-'}</td>
                      <td>${member.address || '-'}</td>
                      <td>${member.town || '-'}</td>
                      <td>${member.postcode || '-'}</td>
                      <td>${member.status || '-'}</td>
                      <td>${member.membership_type || '-'}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="9">No members found</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        `).join('') || '<p>No collectors found</p>'}
        <div class="section">
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `;
}