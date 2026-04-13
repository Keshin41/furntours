import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InternatService, ValidateInternatTicketsResult } from './internat.service';

/**
 * Handles internat (boarding event) routes.
 * The typical frontend flow is:
 *   1. POST /internat/validate  — run pre-payment checks, get non-adherent emails
 *   2. Add tickets (+ optional adhesion lines) to the global cart
 *   3. Pay via POST /payment/create-payment-intent
 */
@Controller('internat')
export class InternatController {
  constructor(private readonly internatService: InternatService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/validate')
  async validateTickets(@Body() data: any): Promise<ValidateInternatTicketsResult> {
    return this.internatService.validateTickets(data);
  }

  /** Admin / internal endpoint listing all registered internat participants. */
  @Get('/tickets')
  async getTickets(): Promise<any> {
    return this.internatService.getTickets();
  }

  /** @deprecated Returns 410. Use the global cart + /payment flow. */
  @HttpCode(HttpStatus.OK)
  @Post('/checkout')
  async processTickets(@Body() _data: any): Promise<any> {
    return this.internatService.processOrder();
  }
}
