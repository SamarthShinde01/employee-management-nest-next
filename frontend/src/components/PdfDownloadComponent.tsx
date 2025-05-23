import { formatDate, formatINR } from "@/lib/utils";

// @ts-ignore
export default function ExportDefaultFunction({ project }: unknown) {
	const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Project Report - ${project.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          color: #333;
          padding: 1.2rem;
          line-height: 1.4;
          font-size: 12px;
          background-color: #fff;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.8rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .project-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.2rem;
        }
        
        .client-name {
          font-size: 11px;
          color: #6b7280;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .status-active {
          background-color: #ecfdf5;
          color: #059669;
        }
        
        .status-inactive {
          background-color: #fee2e2;
          color: #dc2626;
        }
        
        .project-description {
          margin: 0.8rem 0;
          color: #4b5563;
          font-size: 11px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
          margin-bottom: 1rem;
        }
        
        .detail-card {
          padding: 0.6rem;
          border-radius: 0.3rem;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        
        .detail-label {
          font-size: 10px;
          color: #6b7280;
          margin-bottom: 0.2rem;
        }
        
        .detail-value {
          font-size: 12px;
          font-weight: 500;
          color: #111827;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin: 0.8rem 0 0.6rem 0;
          padding-bottom: 0.3rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          margin-bottom: 1rem;
        }
        
        .team-member {
          display: flex;
          align-items: center;
          padding: 0.6rem;
          border-radius: 0.3rem;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          min-height: 40px;
        }
        
        .member-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 0.6rem;
          background-color: #e5e7eb;
        }
        
        .member-name {
          font-weight: 500;
          font-size: 11px;
          margin-bottom: 0.1rem;
        }
        
        .member-role {
          font-size: 10px;
          color: #6b7280;
        }
        
        .member-assigned {
          font-size: 9px;
          color: #9ca3af;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
          font-size: 11px;
        }
        
        th {
          text-align: left;
          padding: 0.4rem 0.6rem;
          background-color: #f3f4f6;
          color: #374151;
          font-weight: 600;
          font-size: 10px;
        }
        
        td {
          padding: 0.4rem 0.6rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .total-row {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        
        .milestone {
          margin-bottom: 0.6rem;
          padding-left: 0.6rem;
          border-left: 2px solid #3b82f6;
          font-size: 11px;
        }
        
        .milestone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.1rem;
        }
        
        .milestone-name {
          font-weight: 500;
        }
        
        .milestone-status {
          font-size: 9px;
          padding: 0.15rem 0.4rem;
          border-radius: 9999px;
          font-weight: 500;
        }
        
        .status-achieved {
          background-color: #ecfdf5;
          color: #059669;
        }
        
        .status-pending {
          background-color: #eff6ff;
          color: #1d4ed8;
        }
        
        .milestone-date {
          color: #6b7280;
          font-size: 10px;
        }
        
        .footer {
          margin-top: 1rem;
          padding-top: 0.8rem;
          border-top: 1px solid #e5e7eb;
          font-size: 10px;
          color: #6b7280;
        }
        
        .compact-view {
          display: flex;
          gap: 1rem;
        }
        
        .left-column {
          flex: 2;
        }
        
        .right-column {
          flex: 1;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="project-title">${project.name}</h1>
          <p class="client-name">${
						project.clientName || "No client specified"
					}</p>
        </div>
        <span class="status-badge ${
					project.status === "ACTIVE" ? "status-active" : "status-inactive"
				}">
          ${project.status}
        </span>
      </div>
      
      ${
				project.description
					? `
        <div class="project-description">
          <p>${project.description}</p>
        </div>
      `
					: ""
			}
      
      <div class="details-grid">
        <div class="detail-card">
          <div class="detail-label">Start Date</div>
          <div class="detail-value">${formatDate(project.startDate)}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">End Date</div>
          <div class="detail-value">${formatDate(project.endDate)}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">Budget</div>
          <div class="detail-value">${formatINR(Number(project.budget))}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">Created At</div>
          <div class="detail-value">${formatDate(project.createdAt)}</div>
        </div>
      </div>
      
      <div class="compact-view">
        <div class="left-column">
          <h2 class="section-title">Team Members</h2>
          <div class="team-grid">
            ${project.projectAssignments
							?.map(
								(assignment: any) => `
              <div class="team-member">
                ${
									assignment.employee.profileImage
										? `
                  <img 
                    src="${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${assignment.employee.profileImage}" 
                    class="member-avatar"
                    alt="${assignment.employee.firstName} ${assignment.employee.lastName}"
                  />
                `
										: `
                  <div class="member-avatar"></div>
                `
								}
                <div>
                  <div class="member-name">${assignment.employee.firstName} ${
									assignment.employee.lastName
								}</div>
                  <div class="member-role">${assignment.employee.jobTitle}</div>
                  <div class="member-assigned">${formatDate(
										assignment.assignedAt
									)}</div>
                </div>
              </div>
            `
							)
							.join("")}
          </div>
          
          <h2 class="section-title">Budget Allocation</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${project.costAllocations
								?.map(
									(allocation: any) => `
                <tr>
                  <td>${allocation.category.name}</td>
                  <td>${formatINR(Number(allocation.allocatedAmount))}</td>
                  <td>${allocation.description || "-"}</td>
                </tr>
              `
								)
								.join("")}
              <tr class="total-row">
                <td>Total</td>
                <td>${formatINR(
									project.costAllocations?.reduce(
										(sum: number, item: any) =>
											sum + Number(item.allocatedAmount),
										0
									) || 0
								)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="right-column">
          ${
						project.milestones?.length > 0
							? `
            <h2 class="section-title">Milestones</h2>
            <div>
              ${project.milestones
								.map(
									(milestone: any) => `
                <div class="milestone">
                  <div class="milestone-header">
                    <div class="milestone-name">${milestone.name}</div>
                    <span class="milestone-status ${
											milestone.achievedDate
												? "status-achieved"
												: "status-pending"
										}">
                      ${milestone.achievedDate ? "✓" : "◯"}
                    </span>
                  </div>
                  <div class="milestone-date">
                    ${formatDate(milestone.targetDate)}
                    ${
											milestone.achievedDate
												? `<br>Achieved: ${formatDate(milestone.achievedDate)}`
												: ""
										}
                  </div>
                </div>
              `
								)
								.join("")}
            </div>
          `
							: ""
					}
        </div>
      </div>
      
      <div class="footer">
        <p>Project ID: ${project.id} | Last updated: ${formatDate(
		project.updatedAt
	)} | Generated: ${formatDate(new Date().toISOString())}</p>
      </div>
    </body>
    </html>
    `;

	return htmlContent;
}
