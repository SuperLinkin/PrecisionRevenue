import { type ContractAnalysis } from './contract-analysis';

interface RevenueTrigger {
  type: 'milestone' | 'usage' | 'time' | 'performance' | 'hybrid' | 'contingent' | 'cumulative';
  description: string;
  conditions: string[];
  measurement: string;
  recognition: {
    timing: 'point_in_time' | 'over_time';
    pattern: string;
    constraints: string[];
    method: 'output' | 'input' | 'straight_line' | 'usage_based' | 'milestone_based';
    allocation: {
      basis: string;
      percentage: number;
      timing: string;
    };
  };
  compliance: {
    ifrs15Step: number; // 1-5 corresponding to IFRS 15 steps
    ascTopic606: string;
    riskFactors: string[];
    evidenceRequired: string[];
  };
}

interface RevenueClause {
  id: string;
  clause: string;
  type: 'primary' | 'conditional' | 'variable' | 'constraint' | 'modification' | 'combination';
  triggers: RevenueTrigger[];
  dependencies?: string[];
  ifrsReference: string[];
  ascReference: string[];
  compliance: {
    variableConsideration: {
      type: 'bonus' | 'penalty' | 'rebate' | 'refund' | 'usage_based' | 'other';
      constraintRequired: boolean;
      estimationMethod: string;
    };
    contractModification: {
      type: 'prospective' | 'cumulative_catchup' | 'separate_contract';
      impact: string;
    };
    disclosureRequirements: string[];
  };
}

export interface RevenueAnalysis {
  clauses: RevenueClause[];
  triggers: RevenueTrigger[];
  variableConsideration: {
    elements: Array<{
      type: string;
      description: string;
      estimation: string;
      constraint: boolean;
      justification: string;
    }>;
    totalImpact: number;
  };
  performanceObligations: Array<{
    description: string;
    type: 'distinct' | 'series' | 'combined';
    recognitionPattern: string;
    triggers: RevenueTrigger[];
    allocation: {
      method: string;
      amount: number;
      basis: string;
    };
  }>;
  specialConsiderations: {
    financing: boolean;
    nonCash: boolean;
    multipleContracts: boolean;
    modifications: boolean;
    warranties: boolean;
  };
}

export async function analyzeRevenueClausesAndTriggers(
  contractText: string,
  options: {
    industryContext?: string;
    contractType?: string;
    specialFocus?: string[];
  } = {}
): Promise<RevenueAnalysis> {
  const { industryContext, contractType, specialFocus } = options;
  
  const prompt = `
    As REMY, a revenue recognition expert, analyze this contract with focus on complex revenue clauses and triggers.
    Pay special attention to:
    
    1. Revenue Triggers and Conditions
       - Identify all events/conditions that trigger revenue recognition
       - Classify triggers (milestone, usage, time-based, performance, hybrid, contingent, cumulative)
       - Specify measurement criteria and evidence requirements
       - Map to specific IFRS 15 steps and ASC 606 requirements
       - Evaluate recognition methods (output, input, straight-line, usage-based, milestone-based)
    
    2. Variable Consideration
       - Identify all variable elements (bonuses, penalties, incentives, rebates, refunds)
       - Assess estimation methods and constraints
       - Evaluate probability of significant reversals
       - Document evidence requirements for variable consideration
       - Analyze impact on transaction price allocation
    
    3. Performance Obligations
       - Identify and classify all obligations
       - Determine recognition patterns
       - Link obligations to specific triggers
       - Evaluate interdependencies
       - Assess stand-alone selling prices and allocation methods
       - Consider timing of transfer of control
    
    4. Special Considerations
       - Financing components (significant financing, time value of money)
       - Non-cash consideration (fair value measurement)
       - Contract modifications (prospective vs cumulative catch-up)
       - Multiple contract implications (combination and modification)
       - Warranty obligations (service-type vs assurance-type)
       - Principal vs agent considerations
       - Licensing arrangements (right to use vs right to access)
       - Contract costs (incremental costs, fulfillment costs)
    
    5. Compliance Requirements
       - Map clauses to specific IFRS 15 / ASC 606 requirements
       - Identify disclosure requirements
       - Document evidence needed for compliance
       - Assess impact on financial statements
       - Consider industry-specific guidance
    
    ${industryContext ? `Industry Context: ${industryContext}` : ''}
    ${contractType ? `Contract Type: ${contractType}` : ''}
    ${specialFocus ? `Special Focus Areas:\n${specialFocus.join('\n')}` : ''}
    
    Contract Text:
    ${contractText}
    
    Provide analysis in the specified RevenueAnalysis interface format.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are REMY, an expert in complex revenue recognition scenarios under IFRS 15 and ASC 606. Focus on detailed clause analysis and trigger identification."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error("Error analyzing revenue clauses:", error);
    throw new Error(`Failed to analyze revenue clauses: ${error.message}`);
  }
}

export function validateRevenueTriggers(triggers: RevenueTrigger[]): boolean {
  return triggers.every(trigger => {
    // Validate trigger structure and logic
    const hasValidType = ['milestone', 'usage', 'time', 'performance', 'hybrid', 'contingent', 'cumulative'].includes(trigger.type);
    const hasValidTiming = ['point_in_time', 'over_time'].includes(trigger.recognition.timing);
    const hasConditions = trigger.conditions && trigger.conditions.length > 0;
    const hasMeasurement = !!trigger.measurement;
    
    return hasValidType && hasValidTiming && hasConditions && hasMeasurement;
  });
}

export function assessVariableConsideration(
  clauses: RevenueClause[],
  contractValue: number
): { 
  hasConstraint: boolean;
  estimatedImpact: number;
  recommendations: string[];
} {
  const variableClauses = clauses.filter(c => c.type === 'variable');
  const constraintNeeded = variableClauses.some(c => 
    c.triggers.some(t => t.recognition.constraints.length > 0)
  );
  
  // Implement variable consideration assessment logic
  return {
    hasConstraint: constraintNeeded,
    estimatedImpact: 0, // Calculate based on clause analysis
    recommendations: []
  };
} 