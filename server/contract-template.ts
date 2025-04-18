// Predefined contract template for MVP demo
export const getContractTemplate = (contractType = 'SaaS', clientName = 'TechCorp'): string => `
MASTER ${contractType.toUpperCase()} AGREEMENT

Agreement Number: CT-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}
Effective Date: ${new Date().toISOString().split('T')[0]}

This agreement is made between Precision Revenue Automation ("Provider") and ${clientName} ("Client").

1. SERVICES
Provider agrees to provide the ${contractType} services described in Attachment A to Client.

2. TERM
The term of this Agreement shall commence on the Effective Date and continue for a period of 12 months.

3. FEES AND PAYMENT
3.1 Client agrees to pay Provider a total of $50,000.00 for the services described herein.
3.2 The payment schedule will be as follows:
  - Initial payment: $12,500.00 due upon execution of this Agreement
  - Second payment: $12,500.00 due 3 months after the Effective Date
  - Third payment: $12,500.00 due 6 months after the Effective Date
  - Final payment: $12,500.00 due 9 months after the Effective Date
3.3 All payments are due within 30 days of receipt of invoice.

4. INTELLECTUAL PROPERTY
4.1 All intellectual property created by Provider during the performance of this Agreement shall remain the property of Provider.
4.2 Client is granted a non-exclusive, non-transferable license to use the deliverables for its internal business purposes.

5. TERMINATION
5.1 Either party may terminate this Agreement with 60 days written notice.
5.2 Upon termination, Client shall pay Provider for all services rendered up to the date of termination.

6. WARRANTIES AND REPRESENTATIONS
6.1 Provider warrants that the services will be performed in a professional manner.
6.2 Provider warrants a service level of 99.9% uptime for all SaaS services.

7. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of all proprietary information received from the other party.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.

SIGNATURES:

Client: ${clientName}
Provider: Precision Revenue Automation
Date: ${new Date().toISOString().split('T')[0]}
`;