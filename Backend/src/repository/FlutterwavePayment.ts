import { HttpStatusCodes, SECRETS } from '../utils/helpers';
import { DataResponse, IFlutterPaymentDataResponse } from './../utils/types';
import axios from 'axios';

// Initialize Flutterwave
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(SECRETS.FLW_PUBLIC_KEY, SECRETS.FLW_SECRET_KEY);

export interface IFlutterwavePaymentUserDetails {
  amount: number | string;
  currency: string;
  redirect_url?: string;
  name: string;
  email: string;
  phone_number: number | string;
  customizationsTitle: string;
  customizationsDescription: string;
}

const generateTxRef = (): string => {
  return `rwpay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

class FlutterWavePaymentRepository {
  async Payment(
    userDetails: IFlutterwavePaymentUserDetails, subAccountId?: string
  ): Promise<DataResponse | undefined> {
    try {
      const {
        amount,
        currency = 'RWF',
        email,
        phone_number,
        name,
        customizationsTitle,
        customizationsDescription,
      } = userDetails;

      if (!amount) {
        return {
          status: HttpStatusCodes.BAD_REQUEST,
          message: 'Missing required fields: amount ',
        };
      }

      const tx_ref = generateTxRef();

      const payload = {
        tx_ref,
        amount: parseFloat(String(amount)),
        currency,
        redirect_url: 'https://your-app.com/payment/callback' as string,
        customer: {
          email,
          phonenumber: phone_number,
          name,
        },
        customizations: {
          title: customizationsTitle,
          description: customizationsDescription,
        },
        subaccounts: [
          {
            id: subAccountId,
            transaction_charge_type: 'percentage',
            transaction_charge: 0.05,
          },
        ],
        configurations: {
          session_duration: 30, // Session timeout in minutes (maxValue: 1440)
          max_retry_attempt: 1, // Max retry (int)
        },
      };

      // Create a post Request to Flutterwave
      try {
        const response: IFlutterPaymentDataResponse = await axios.post(
          `${SECRETS.FLUTTERWAVE_API_URL}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${SECRETS.FLW_SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const { status, data } = response.data;
        const { link } = data;
        if (status === 'success') {
          return {
            status: HttpStatusCodes.OK,
            message: `Complete your payment within 30 minutes using the checkout link to secure your booking`,
            data: {
              checkout_link: link,
              tx_ref,
            },
          };
        } else {
          return {
            status: HttpStatusCodes.BAD_REQUEST,
            message: 'Payment processing failed',
          };
        }
      } catch (error: any) {
        return {
          status: HttpStatusCodes.BAD_REQUEST,
          message: `Encountered an error while processing payment, ${error}`,
        };
      }
    } catch (error: any) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: `Card payment processing failed: ${error?.message || error}`,
      };
    }
  }

  // Method to verify payment status
  async verifyPayment(tx_ref: string): Promise<DataResponse | undefined> {
    if (!tx_ref) {
      return {
        status: HttpStatusCodes.BAD_REQUEST,
        message: 'Transaction reference is required',
      };
    }

    try {
      const response: IFlutterPaymentDataResponse = await axios.get(
        `${SECRETS.FLUTTERWAVE_PAYMENT_VERIFICATION_URL}?tx_ref=${tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const { status } = response.data;

      if (status === 'success') {
        return {
          status: HttpStatusCodes.OK,
          message: 'Payment was done successfully',
        };
      } else {
        return {
          status: HttpStatusCodes.BAD_REQUEST,
          message: 'Payment verification failed',
        };
      }
    } catch (error: any) {
      return {
        status: HttpStatusCodes.BAD_REQUEST,
        message: `Encountered an error while verifying payment: ${error?.message || error}`,
      };
    }
  }
  
}

export const paymentRepository = new FlutterWavePaymentRepository();
