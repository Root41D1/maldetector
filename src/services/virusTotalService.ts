
import { toast } from "sonner";

// VirusTotal API constants
const VIRUSTOTAL_API_KEY = "4bcfb3fa35c4ad66dbf543bee7cb70d411d1298d2ef1d219969e4c923bb020c5";
const VIRUSTOTAL_BASE_URL = "https://www.virustotal.com/api/v3";

// CORS proxy URL - Add this to handle CORS issues
const CORS_PROXY = "https://corsproxy.io/?";

// Types
export interface FileScanResult {
  id: string;
  type: string;
  attributes: {
    date: number;
    status: string;
    stats: {
      harmless: number;
      malicious: number;
      suspicious: number;
      undetected: number;
      timeout: number;
    };
    results: Record<string, {
      category: string;
      engine_name: string;
      engine_version: string;
      result: string | null;
      method: string;
      engine_update: string;
    }>;
  };
}

export interface FileUploadResponse {
  data: {
    id: string;
    type: string;
  };
}

export interface FileReport {
  data: FileScanResult;
}

// Error handling
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Helper functions for API calls
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch (e) {
      // If we can't parse the error JSON, use the status text
      errorMessage = response.statusText;
    }
    throw new ApiError(errorMessage, response.status);
  }
  return response.json();
};

// Service methods
export const virusTotalService = {
  /**
   * Upload a file to VirusTotal for scanning
   */
  async uploadFile(file: File): Promise<string> {
    try {
      // Use FormData to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // First, get an upload URL using the CORS proxy
      const uploadUrlResponse = await fetch(`${CORS_PROXY}${VIRUSTOTAL_BASE_URL}/files/upload_url`, {
        method: 'GET',
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY
        }
      });
      
      if (!uploadUrlResponse.ok) {
        throw new ApiError('Failed to get upload URL', uploadUrlResponse.status);
      }
      
      const { data } = await uploadUrlResponse.json();
      const uploadUrl = data;
      
      // Now upload to the provided URL using the CORS proxy
      const uploadResponse = await fetch(`${CORS_PROXY}${uploadUrl}`, {
        method: 'POST',
        body: formData,
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY
        }
      });
      
      const result = await handleResponse(uploadResponse) as FileUploadResponse;
      return result.data.id;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 429) {
          toast.error('Rate limit exceeded. Please try again later.');
        } else {
          toast.error(`Upload error: ${error.message}`);
        }
      } else {
        toast.error('Failed to upload file for scanning');
        console.error('File upload error:', error);
      }
      throw error;
    }
  },
  
  /**
   * Get the analysis report for a file by its ID
   */
  async getFileReport(fileId: string): Promise<FileScanResult> {
    try {
      const response = await fetch(`${CORS_PROXY}${VIRUSTOTAL_BASE_URL}/analyses/${fileId}`, {
        method: 'GET',
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY
        }
      });
      
      const result = await handleResponse(response) as FileReport;
      return result.data;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Report error: ${error.message}`);
      } else {
        toast.error('Failed to retrieve scan report');
        console.error('Report retrieval error:', error);
      }
      throw error;
    }
  },
  
  /**
   * Check if a file has been analyzed before by its hash
   */
  async checkFileByHash(hash: string): Promise<FileScanResult | null> {
    try {
      const response = await fetch(`${CORS_PROXY}${VIRUSTOTAL_BASE_URL}/files/${hash}`, {
        method: 'GET',
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY
        }
      });
      
      if (response.status === 404) {
        return null; // File not previously analyzed
      }
      
      const result = await handleResponse(response) as FileReport;
      return result.data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      
      if (error instanceof ApiError) {
        toast.error(`Hash check error: ${error.message}`);
      } else {
        toast.error('Failed to check file hash');
        console.error('Hash check error:', error);
      }
      throw error;
    }
  }
};
