// src/services/Payment.ts
import { Request, Response } from 'express';
import { paymentRepository, IrembopayInvoice } from '../repository/IremboPay';
import { HttpStatusCodes } from '../utils/helpers';
import { bookingRepository } from '../repository/Hotel.booking';
import { roomOperationsRepository } from '../repository/Hotel.pricing-availability';
import crypto from 'crypto';
import { SECRETS } from '../utils/helpers';

class PaymentService {
  /**
   * Create a payment invoice for a booking
   */
  async createPaymentInvoice(req: Request, res: Response): Promise<Response> {
    try {
      const { bookingId } = req.params;

      // 1. Get booking details
      const bookingResult = await bookingRepository.getSpecificBooking(req);

      if (bookingResult.status !== HttpStatusCodes.OK || !bookingResult.data) {
        return res.status(bookingResult.status).json({
          message: bookingResult.message || 'Booking not found'
        });
      }

      const booking = bookingResult.data;

      // 2. Create unique transaction ID for IremboPay
      const transactionId = `NESTLY-${Date.now()}-${bookingId.substring(0, 8)}`;

      // 3. Build the invoice data
      const invoiceData: IrembopayInvoice = {
        transactionId,
        paymentAccountIdentifier: SECRETS.IREMBOPAY_ACCOUNT_ID, // Your payment account ID from settings
        customer: {
          email: req.body.email || '',
          phoneNumber: req.body.phoneNumber || '',
          name: req.body.name || ''
        },
        paymentItems: [
          {
            code: 'ROOM-BOOKING',
            quantity: 1,
            unitAmount: booking.total_price
          }
        ],
        description: `Hotel booking at ${booking.hotel_id} from ${booking.check_in_date} to ${booking.check_out_date}`,
        // Set expiry to 24 hours from now
        expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        language: 'EN'
      };

      // 4. Call the IremboPay API to create the invoice
      const invoiceResult = await paymentRepository.createInvoice(invoiceData);

      if (invoiceResult.status !== HttpStatusCodes.CREATED || !invoiceResult.data) {
        return res.status(invoiceResult.status).json({
          message: invoiceResult.message || 'Failed to create payment invoice'
        });
      }

      // 5. Update booking with invoice number and payment reference
      await bookingRepository.updateBooking(req);

      // 6. Return the invoice details to the client
      return res.status(HttpStatusCodes.CREATED).json({
        message: 'Payment invoice created successfully',
        data: {
          invoiceNumber: invoiceResult.data.invoiceNumber,
          paymentLinkUrl: invoiceResult.data.paymentLinkUrl,
          amount: invoiceResult.data.amount,
          currency: invoiceResult.data.currency,
          expiryAt: invoiceResult.data.expiryAt,
          publicKey: paymentRepository.getPublicKey()
        }
      });
    } catch (error) {
      console.error('Error creating payment invoice:', error);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while creating the payment invoice'
      });
    }
  }


  /**
   * Check payment status
   */
  async checkPaymentStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { invoiceNumber } = req.params;

      // Call the IremboPay API to get invoice details
      const invoiceResult = await paymentRepository.getInvoice(invoiceNumber);

      if (invoiceResult.status !== HttpStatusCodes.OK || !invoiceResult.data) {
        return res.status(invoiceResult.status).json({
          message: invoiceResult.message || 'Failed to retrieve invoice'
        });
      }

      const invoice = invoiceResult.data;

      return res.status(HttpStatusCodes.OK).json({
        message: 'Payment status retrieved successfully',
        data: {
          invoiceNumber: invoice.invoiceNumber,
          paymentStatus: invoice.paymentStatus,
          paymentReference: invoice.paymentReference || null,
          paymentMethod: invoice.paymentMethod || null,
          paidAt: invoice.paidAt || null
        }
      });
    } catch (error) {
      console.error('Error checking payment status:', error);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while checking the payment status'
      });
    }
  }
}

export const paymentService = new PaymentService();
