import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripeClient: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly configService: ConfigService) {
    this.stripeClient = new Stripe(configService.get('STRIPE_SECRET_KEY', ''));
  }

  async createPaymentIntent(amount: number, metadata?: Record<string, string>) {
    const paymentIntent = await this.stripeClient.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata,
    });
    return paymentIntent.client_secret;
  }

  async retrievePaymentIntent(paymentIntentId: string, expandLatestCharge = false) {
    return this.stripeClient.paymentIntents.retrieve(
      paymentIntentId,
      expandLatestCharge ? { expand: ['latest_charge'] } : undefined,
    );
  }

  verifyWebhook(event: Buffer, signature: string): Stripe.Event {
    try {
      const verifiedEvent = this.stripeClient.webhooks.constructEvent(
        event,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET', ''),
      );
      return verifiedEvent;
    } catch (err: unknown) {
      this.logger.error(
        `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
      throw err;
    }
  }
}
