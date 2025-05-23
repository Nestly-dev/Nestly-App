// src/repository/Payment.ts
import axios from 'axios';
import { DataResponse } from '../utils/types';
import { HttpStatusCodes, SECRETS } from '../utils/helpers';

export interface IrembopayInvoice {
  transactionId: string;
  paymentAccountIdentifier: string;
  customer?: {
    email?: string;
    phoneNumber?: string;
    name?: string;
  };
  paymentItems: Array<{
    code: string;
    quantity: number;
    unitAmount: number;
  }>;
  description?: string;
  expiryAt?: string;
  language?: 'EN' | 'FR' | 'RW';
}

export interface IrembopayInvoiceResponse {
  invoiceNumber: string;
  transactionId: string;
  paymentAccountIdentifier: string;
  paymentItems: Array<{
    code: string;
    quantity: number;
    unitAmount: number;
  }>;
  paymentStatus: 'NEW' | 'PAID';
  amount: number;
  currency: string;
  type: 'SINGLE' | 'BATCH';
  createdAt: string;
  updatedAt?: string;
  expiryAt?: string;
  customer?: {
    email?: string;
    phoneNumber?: string;
    name?: string;
  };
  description?: string;
  paymentLinkUrl: string;
}


class PaymentRepository {
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly publicKey: string;

  constructor() {
    this.baseUrl = 'https://api.sandbox.irembopay.com/payments';
    this.secretKey = SECRETS.IREMBOPAY_SECRET_KEY;
    this.publicKey = SECRETS.IREMBOPAY_PUBLIC_KEY;
  }

  /**
   * Create an invoice in IremboPay system
   * @param invoiceData - The data to create the invoice
   * @returns DataResponse with the created invoice details
   */
  async createInvoice(invoiceData: IrembopayInvoice): Promise<DataResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/invoices`,
        invoiceData,
        {
          headers: {
            'Content-Type': 'application/json',
            'irembopay-secretkey': this.secretKey,
            'X-API-Version': '2'
          }
        }
      );

      if (response.data.success) {
        return {
          data: response.data.data,
          status: HttpStatusCodes.CREATED,
          message: 'Invoice created successfully'
        };
      } else {
        return {
          data: null,
          status: HttpStatusCodes.BAD_REQUEST,
          message: response.data.message || 'Failed to create invoice'
        };
      }
    } catch (error: any) {
      console.error('Error creating IremboPay invoice:', error.response?.data || error.message);

      // Extract error details from IremboPay response if available
      const errorMessage = error.response?.data?.message || 'An error occurred while creating the invoice';
      const errorDetails = error.response?.data?.errors
        ? error.response.data.errors.map((e: any) => `${e.code}: ${e.detail}`).join(', ')
        : '';

      return {
        data: null,
        message: `${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}`,
        status: error.response?.status || HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  /**
   * Get invoice details by invoice number
   * @param invoiceNumber - The invoice number to retrieve
   * @returns DataResponse with the invoice details
   */
  async getInvoice(invoiceNumber: string): Promise<DataResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/invoices/${invoiceNumber}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'irembopay-secretkey': this.secretKey,
            'X-API-Version': '2'
          }
        }
      );

      if (response.data.success) {
        return {
          data: response.data.data,
          status: HttpStatusCodes.OK,
          message: 'Invoice fetched successfully'
        };
      } else {
        return {
          data: null,
          status: HttpStatusCodes.BAD_REQUEST,
          message: response.data.message || 'Failed to fetch invoice'
        };
      }
    } catch (error: any) {
      console.error('Error fetching IremboPay invoice:', error.response?.data || error.message);

      return {
        data: null,
        message: error.response?.data?.message || 'An error occurred while fetching the invoice',
        status: error.response?.status || HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  /**
   * Update invoice expiry date
   * @param invoiceNumber - The invoice number to update
   * @param expiryAt - The new expiry date in ISO format
   * @returns DataResponse with the updated invoice details
   */
  async updateInvoiceExpiry(invoiceNumber: string, expiryAt: string): Promise<DataResponse> {
    try {
      const response = await axios.put(
        `${this.baseUrl}/invoices/${invoiceNumber}`,
        {
          expiryAt: expiryAt
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'irembopay-secretkey': this.secretKey,
            'X-API-Version': '2'
          }
        }
      );

      if (response.data.success) {
        return {
          data: response.data.data,
          status: HttpStatusCodes.OK,
          message: 'Invoice expiry updated successfully'
        };
      } else {
        return {
          data: null,
          status: HttpStatusCodes.BAD_REQUEST,
          message: response.data.message || 'Failed to update invoice expiry'
        };
      }
    } catch (error: any) {
      console.error('Error updating IremboPay invoice:', error.response?.data || error.message);

      return {
        data: null,
        message: error.response?.data?.message || 'An error occurred while updating the invoice',
        status: error.response?.status || HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }


  /**
   * Get the public key for frontend integration
   */
  getPublicKey(): string {
    return this.publicKey;
  }

  /**
   * Verify an IremboPay signature from webhook notifications
   * @param signature - The signature from the irembopay-signature header
   * @param payload - The request body as a string
   * @returns boolean indicating if the signature is valid
   */
  verifyWebhookSignature(signature: string, payload: string): boolean {
    // Implementation will depend on the crypto library you're using
    // This is a placeholder for the verification logic
    return true; // For now, just return true
  }
}

export const paymentRepository = new PaymentRepository();
