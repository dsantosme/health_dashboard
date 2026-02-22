/**
 * Medical Analysis Service Factory
 * 
 * Factory pattern to create the appropriate implementation based on configuration.
 * Supports both internal (direct calls) and MCP (external service) modes.
 */

import { IMedicalAnalysisService } from '../ports/IMedicalAnalysisService';
import { MedicalAnalysisDomain } from '../domain/MedicalAnalysisDomain';
import { InternalLLMAdapter } from './internal/InternalLLMAdapter';
import { InternalDataAdapter } from './internal/InternalDataAdapter';

export type DeploymentMode = 'internal' | 'mcp';

export class MedicalAnalysisServiceFactory {
  /**
   * Create Medical Analysis Service based on deployment mode
   */
  static create(mode: DeploymentMode = 'internal'): IMedicalAnalysisService {
    if (mode === 'mcp') {
      // TODO: Implement MCP adapter when ready
      throw new Error('MCP mode not yet implemented. Use internal mode.');
    }

    // Internal mode: use direct adapters
    const llmProvider = new InternalLLMAdapter();
    const dataRepository = new InternalDataAdapter();

    return new MedicalAnalysisDomain(llmProvider, dataRepository);
  }

  /**
   * Get deployment mode from environment variable
   */
  static getDeploymentMode(): DeploymentMode {
    const mode = process.env.MEDICAL_ANALYSIS_DEPLOYMENT_MODE?.toLowerCase();
    
    if (mode === 'mcp') {
      return 'mcp';
    }

    return 'internal';
  }
}
